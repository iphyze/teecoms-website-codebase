<?php
/**
 * Teecoms contact form endpoint.
 *
 *   GET  ?action=token  -> { token }   one-time signed form token
 *   POST JSON { fullName, company, email, phone, service, message,
 *               website (honeypot), token, turnstileToken? }
 *
 * Emails the enquiry to the configured inbox (Reply-To: the visitor) and sends
 * the visitor a branded confirmation.
 *
 * Settings come from environment values (see docs/BUILD-GUIDE.md):
 *   1. env.php, generated at build time from the project's .env
 *   2. a .env file above the web root (overrides 1)
 *   3. real server environment variables (override both)
 *
 * Spam protection, in order: rate limit, honeypot, signed one-time token with
 * a minimum fill time, optional Cloudflare Turnstile, validation, content
 * checks, duplicate check. Suspected bots get a normal-looking success reply
 * and nothing is sent, so they learn nothing.
 */
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as MailException;

require __DIR__ . '/lib/PHPMailer/Exception.php';
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';
require __DIR__ . '/lib/templates.php';
require __DIR__ . '/lib/diagnose.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/** JSON that never comes out empty: invalid UTF-8 (e.g. from a mail server) is substituted. */
function json_out(array $body, int $flags = 0): string
{
    $json = json_encode($body, $flags | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    return $json !== false ? $json : '{"ok":false,"error":"encoding_failed","detail":' . json_encode(json_last_error_msg()) . '}';
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_out($body);
    exit;
}

// Looks like success to the sender; nothing is sent
function drop(string $reason): void
{
    error_log('Teecoms contact: dropped (' . $reason . ') from ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    respond(200, ['ok' => true]);
}

// ---- Configuration -------------------------------------------------------------
function parse_env_file(string $file): array
{
    $values = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $key = preg_replace('/^export\s+/', '', $key);
        if (preg_match('/^(["\'])(.*)\1$/s', $value, $m)) {
            $value = $m[2];
        } else {
            $value = trim(preg_replace('/\s+#.*$/', '', $value)); // inline comment
        }
        $values[$key] = $value;
    }
    return $values;
}

function load_env(array &$sources = []): array
{
    $env = [];
    if (is_file(__DIR__ . '/env.php')) {
        $generated = require __DIR__ . '/env.php';
        if (is_array($generated)) {
            $env = $generated;
            $sources[] = 'api/env.php (from the build)';
        }
    }
    // A .env kept outside the web root (e.g. /home/account/.env beside public_html).
    // During `npm run dev` + `npm run dev:php` (PHP serving /public) this is the
    // project folder, so the project's .env and .env.local are used.
    foreach ([dirname(__DIR__, 2), dirname(__DIR__, 3)] as $dir) {
        $found = false;
        foreach (['.env', '.env.local'] as $name) { // .env.local overrides .env, as in Next.js
            if (is_readable($dir . '/' . $name)) {
                $env = array_merge($env, parse_env_file($dir . '/' . $name));
                $sources[] = $dir . '/' . $name;
                $found = true;
            }
        }
        if ($found) {
            break;
        }
    }
    foreach (array_keys($env + array_flip([
        'CONTACT_TO', 'CONTACT_FROM_EMAIL', 'CONTACT_FROM_NAME', 'CONTACT_SITE_URL', 'CONTACT_ALLOWED_ORIGINS',
        'CONTACT_RATE_LIMIT_MAX', 'CONTACT_RATE_LIMIT_WINDOW', 'CONTACT_AUTO_REPLY', 'CONTACT_MIN_SECONDS',
        'CONTACT_TOKEN_SECRET', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USERNAME', 'SMTP_PASSWORD',
        'TURNSTILE_SECRET_KEY', 'NEXT_PUBLIC_SITE_URL', 'CONTACT_TRANSPORT', 'SMTP_VERIFY_PEER', 'CONTACT_DEBUG',
        'CONTACT_DIAGNOSTICS_KEY',
    ])) as $key) {
        $value = getenv($key);
        if ($value !== false && $value !== '') {
            $env[$key] = $value;
            $sources['server'] = 'server environment variables';
        }
    }
    return $env;
}

function list_value(?string $value): array
{
    return array_values(array_filter(array_map('trim', explode(',', (string) $value))));
}

$sources = [];
$env = load_env($sources);
$sources = array_values($sources);
$config = [
    'to' => list_value($env['CONTACT_TO'] ?? 'info@digitalinvoice.ng'),
    'from_email' => $env['CONTACT_FROM_EMAIL'] ?? '',
    'from_name' => $env['CONTACT_FROM_NAME'] ?? 'Teecoms Integrated Solutions',
    'smtp' => [
        'host' => $env['SMTP_HOST'] ?? '',
        'port' => (int) ($env['SMTP_PORT'] ?? 465),
        'secure' => strtolower($env['SMTP_SECURE'] ?? 'ssl'),
        'username' => $env['SMTP_USERNAME'] ?? '',
        'password' => $env['SMTP_PASSWORD'] ?? '',
    ],
    'site_url' => $env['CONTACT_SITE_URL'] ?? ($env['NEXT_PUBLIC_SITE_URL'] ?? ''),
    'allowed_origins' => list_value($env['CONTACT_ALLOWED_ORIGINS'] ?? ''),
    'rate_max' => max(1, (int) ($env['CONTACT_RATE_LIMIT_MAX'] ?? 5)),
    'rate_window' => max(60, (int) ($env['CONTACT_RATE_LIMIT_WINDOW'] ?? 600)),
    'auto_reply' => strtolower($env['CONTACT_AUTO_REPLY'] ?? 'true') !== 'false',
    'min_seconds' => max(0, (int) ($env['CONTACT_MIN_SECONDS'] ?? 3)),
    'token_secret' => ($env['CONTACT_TOKEN_SECRET'] ?? '') !== ''
        ? $env['CONTACT_TOKEN_SECRET']
        : hash('sha256', ($env['SMTP_PASSWORD'] ?? '') . '|' . __DIR__ . '|teecoms-contact'),
    'turnstile_secret' => $env['TURNSTILE_SECRET_KEY'] ?? '',
    // smtp (default) | mail (the host's built-in mailer, when outgoing SMTP is blocked)
    'transport' => strtolower($env['CONTACT_TRANSPORT'] ?? 'smtp') === 'mail' ? 'mail' : 'smtp',
    // false only if the mail server's certificate doesn't match SMTP_HOST and no matching name works
    'verify_peer' => strtolower($env['SMTP_VERIFY_PEER'] ?? 'true') !== 'false',
    // true: failed sends include the mail server's error in the response (turn off when fixed)
    'debug' => strtolower($env['CONTACT_DEBUG'] ?? 'false') === 'true',
    'diagnostics_key' => $env['CONTACT_DIAGNOSTICS_KEY'] ?? '',
];

// ---- CORS: same-origin by default ----------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'OPTIONS') {
    respond(204, []);
}

// ---- Mailer (shared with diagnostics) ---------------------------------------------
/** $transcript collects the SMTP conversation, with the login exchange masked. */
function teecoms_mailer(array $config, array &$transcript): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_BASE64;
    $mail->isHTML(true);
    if ($config['transport'] === 'mail') {
        $mail->isMail();
    } else {
        $smtp = $config['smtp'];
        $mail->isSMTP();
        $mail->Host = $smtp['host'];
        $mail->Port = $smtp['port'];
        $mail->Timeout = 15;
        $mail->SMTPSecure = $smtp['secure'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : ($smtp['secure'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : '');
        $mail->SMTPAutoTLS = $smtp['secure'] === 'tls' || $smtp['secure'] === 'ssl';
        if ($smtp['username'] !== '') {
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['username'];
            $mail->Password = $smtp['password'];
        }
        if (!$config['verify_peer']) {
            $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]];
        }
        $secret = $smtp['password'];
        $inAuth = false;
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->Debugoutput = function (string $line) use (&$transcript, &$inAuth, $secret) {
            $line = rtrim($line);
            if (stripos($line, 'CLIENT -> SERVER: AUTH') !== false) {
                $inAuth = true;
                $transcript[] = 'CLIENT -> SERVER: AUTH [login details hidden]';
                return;
            }
            if ($inAuth && str_starts_with($line, 'CLIENT -> SERVER:')) {
                return; // username/password lines
            }
            if (preg_match('/SERVER -> CLIENT: (235|535|5\d\d)/', $line)) {
                $inAuth = false;
            }
            if ($secret !== '') {
                $line = str_replace([$secret, base64_encode($secret)], '[hidden]', $line);
            }
            if (preg_match('/[\x00-\x08\x0E-\x1F\x7F]/', $line) || !mb_check_encoding($line, 'UTF-8')) {
                $line = preg_replace('/(SERVER -> CLIENT:|SMTP ERROR: [^:]+:).*/', '$1 [encrypted/binary data omitted]', $line) ?: '[binary data omitted]';
            }
            if (count($transcript) < 80) {
                $transcript[] = $line;
            }
        };
    }
    $mail->setFrom($config['from_email'], $config['from_name']);
    return $mail;
}

// ---- Signed one-time form tokens ---------------------------------------------
const TOKEN_TTL = 7200; // a form can stay open for 2 hours

function issue_token(string $secret): string
{
    $payload = time() . '.' . bin2hex(random_bytes(12));
    return $payload . '.' . hash_hmac('sha256', $payload, $secret);
}

/** @return array{0:string,1:int,2:string} status ('ok'|'invalid'|'expired'), age, nonce */
function check_token(string $token, string $secret): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3 || !ctype_digit($parts[0])) {
        return ['invalid', 0, ''];
    }
    [$issued, $nonce, $mac] = $parts;
    if (!hash_equals(hash_hmac('sha256', $issued . '.' . $nonce, $secret), $mac)) {
        return ['invalid', 0, ''];
    }
    $age = time() - (int) $issued;
    return [$age > TOKEN_TTL || $age < -60 ? 'expired' : 'ok', $age, $nonce];
}

function temp_path(string $kind, string $key): string
{
    return sys_get_temp_dir() . '/teecoms-' . $kind . '-' . sha1($key);
}

if ($method === 'GET' && ($_GET['action'] ?? '') === 'token') {
    respond(200, ['token' => issue_token($config['token_secret'])]);
}
// Diagnostics: only when CONTACT_DIAGNOSTICS_KEY is set and matches; otherwise looks like it doesn't exist
if ($method === 'GET' && ($_GET['action'] ?? '') === 'diagnose') {
    $key = (string) ($_GET['key'] ?? '');
    if ($config['diagnostics_key'] === '' || !hash_equals($config['diagnostics_key'], $key)) {
        respond(404, ['ok' => false, 'error' => 'not_found']);
    }
    http_response_code(200);
    echo json_out(teecoms_diagnose($config, $sources, ($_GET['send'] ?? '') === '1'), JSON_PRETTY_PRINT);
    exit;
}
if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}
if ($config['transport'] === 'smtp' && ($hostProblem = teecoms_smtp_host_problem($config['smtp']['host'])) !== '') {
    error_log('Teecoms contact: ' . $hostProblem);
    respond(500, ['ok' => false, 'error' => 'smtp_host_invalid', 'detail' => $hostProblem]);
}
if ($config['from_email'] === '' || !$config['to'] || ($config['transport'] === 'smtp' && $config['smtp']['host'] === '')) {
    error_log('Teecoms contact: not configured (set SMTP_HOST, CONTACT_FROM_EMAIL and CONTACT_TO in .env)');
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}

// ---- 1. Rate limit: N submissions per window, per visitor IP -------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = time();
$bucket = temp_path('rate', $ip);
$hits = is_file($bucket) ? (json_decode((string) file_get_contents($bucket), true) ?: []) : [];
$hits = array_values(array_filter($hits, fn ($t) => is_int($t) && $t > $now - $config['rate_window']));
if (count($hits) >= $config['rate_max']) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}
$hits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);

// ---- Read input --------------------------------------------------------------------
$raw = file_get_contents('php://input', false, null, 0, 20000) ?: '';
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}
$limits = [
    'fullName' => 120, 'company' => 160, 'email' => 254, 'phone' => 40, 'service' => 120,
    'message' => 5000, 'website' => 200, 'token' => 200, 'turnstileToken' => 2048,
];
$data = [];
foreach ($limits as $key => $max) {
    $value = is_string($input[$key] ?? null) ? trim($input[$key]) : '';
    if ($key !== 'message') {
        $value = preg_replace('/[\r\n\t]+/', ' ', $value); // single-line fields: no header injection
    }
    $data[$key] = mb_substr($value, 0, $max);
}

// ---- 2. Honeypot: hidden field only bots fill in ---------------------------------
if ($data['website'] !== '') {
    drop('honeypot');
}

// ---- 3. Signed token: issued by this server, used once, not filled too fast ------
[$tokenStatus, $tokenAge, $nonce] = check_token($data['token'], $config['token_secret']);
if ($tokenStatus === 'invalid') {
    respond(400, ['ok' => false, 'error' => 'token_invalid']);
}
if ($tokenStatus === 'expired') {
    respond(400, ['ok' => false, 'error' => 'token_expired']); // the form fetches a new one and retries
}
if ($tokenAge < $config['min_seconds']) {
    drop('too_fast');
}
$used = temp_path('token', $nonce);
if (is_file($used)) {
    drop('token_reused');
}
// (marked as used only after a successful send, so a visitor can retry if sending fails)

// ---- 4. Optional Cloudflare Turnstile -----------------------------------------------
if ($config['turnstile_secret'] !== '') {
    $verified = false;
    if ($data['turnstileToken'] !== '') {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query(['secret' => $config['turnstile_secret'], 'response' => $data['turnstileToken'], 'remoteip' => $ip]),
            'timeout' => 8,
        ]]);
        $result = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
        $verified = is_string($result) && (json_decode($result, true)['success'] ?? false) === true;
    }
    if (!$verified) {
        respond(400, ['ok' => false, 'error' => 'captcha']);
    }
}

// ---- 5. Validation (mirrors the form's own rules) -----------------------------------
$errors = [];
if (mb_strlen($data['fullName']) < 2) {
    $errors['fullName'] = 'Enter your full name.';
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter a valid email address.';
}
$phoneDigits = preg_replace('/[\s().-]/', '', $data['phone']);
if ($data['phone'] !== '' && !preg_match('/^(?:\+234|234|0)\d{10}$/', $phoneDigits)) {
    $errors['phone'] = 'Enter a valid Nigerian phone number.';
}
if (mb_strlen($data['message']) < 20) {
    $errors['message'] = 'Tell us a little more (at least 20 characters).';
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'validation', 'fields' => $errors]);
}

// ---- 6. Content checks: typical spam patterns ------------------------------------------
$linkPattern = '~(https?://|www\.)\S+~i';
if (preg_match_all($linkPattern, $data['message']) > 3) {
    drop('too_many_links');
}
if (preg_match($linkPattern, $data['fullName'] . ' ' . $data['company'])) {
    drop('link_in_name');
}
if (preg_match('~<a\s|\[url[=\]]|\[link[=\]]~i', $data['message'])) {
    drop('markup_links');
}

// ---- 7. Duplicate: same email + message within 24 hours ----------------------------------
$fingerprint = temp_path('dupe', strtolower($data['email']) . '|' . preg_replace('/\s+/', ' ', mb_strtolower($data['message'])));
if (is_file($fingerprint) && filemtime($fingerprint) > $now - 86400) {
    drop('duplicate');
}

// ---- Mail ----------------------------------------------------------------------------------
$siteUrl = rtrim($config['site_url'], '/');
$submittedAt = (new DateTimeImmutable('now', new DateTimeZone('Africa/Lagos')))->format('j M Y, g:i a') . ' WAT';

$transcript = [];
try {
    $notice = teecoms_mailer($config, $transcript);
    foreach ($config['to'] as $address) {
        $notice->addAddress($address);
    }
    $notice->addReplyTo($data['email'], $data['fullName']);
    $notice->Subject = 'New enquiry: ' . ($data['service'] ?: 'General enquiry') . ' from ' . $data['fullName'];
    $notice->Body = teecoms_notification_html($data, $siteUrl, $submittedAt, $ip);
    $notice->AltBody = teecoms_notification_text($data, $siteUrl, $submittedAt);
    $notice->send();
} catch (MailException $e) {
    $reason = $notice->ErrorInfo ?: $e->getMessage();
    error_log('Teecoms contact: notification failed: ' . $reason . ' | ' . implode(' / ', array_slice($transcript, -6)));
    // 500, not 502: some proxies (e.g. Cloudflare) replace 502 responses with their own page
    respond(500, array_filter(['ok' => false, 'error' => 'send_failed', 'detail' => $config['debug'] ? $reason : null]));
}
@touch($fingerprint);
@touch($used);

if ($config['auto_reply']) {
    try {
        $replyLog = [];
        $reply = teecoms_mailer($config, $replyLog);
        $reply->addAddress($data['email'], $data['fullName']);
        $reply->addReplyTo($config['to'][0], $config['from_name']);
        $reply->Subject = 'We’ve received your enquiry | Teecoms';
        $reply->Body = teecoms_autoreply_html($data, $siteUrl);
        $reply->AltBody = teecoms_autoreply_text($data, $siteUrl);
        $reply->send();
    } catch (MailException $e) {
        // The enquiry itself reached the team, so the visitor still sees success.
        error_log('Teecoms contact: auto-reply failed: ' . $e->getMessage());
    }
}

respond(200, ['ok' => true]);
