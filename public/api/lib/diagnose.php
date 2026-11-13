<?php
/**
 * Mailer diagnostics: /api/contact.php?action=diagnose&key=YOUR_KEY[&send=1]
 *
 * Enabled only when CONTACT_DIAGNOSTICS_KEY is set; the key must match.
 * Checks each step of sending in order and explains failures. Never prints
 * the SMTP password (the login exchange is masked).
 */
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as MailException;

/** Explains a malformed SMTP_HOST (a common mix-up), or returns '' when it looks fine. */
function teecoms_smtp_host_problem(string $host): string
{
    if (str_contains($host, '@')) {
        return 'SMTP_HOST must be the mail server’s name (for example mail.digitalinvoice.ng), not an email address. '
            . 'The email address goes in SMTP_USERNAME (and usually CONTACT_FROM_EMAIL).';
    }
    if (str_contains($host, '://') || str_contains($host, '/') || str_contains($host, ' ')) {
        return 'SMTP_HOST must be a bare server name such as mail.digitalinvoice.ng, without https://, slashes or spaces.';
    }
    return '';
}

function teecoms_diagnose(array $config, array $sources, bool $send): array
{
    $checks = [];
    $add = function (string $name, bool $ok, string $detail, string $hint = '') use (&$checks) {
        $checks[] = array_filter(['check' => $name, 'ok' => $ok, 'detail' => $detail, 'fix' => $ok ? '' : $hint], fn ($v) => $v !== '');
        return $ok;
    };
    $smtp = $config['smtp'];
    $host = $smtp['host'];
    $port = (int) $smtp['port'];
    $secure = $smtp['secure'];

    // 1. PHP and extensions
    $add('PHP version', version_compare(PHP_VERSION, '8.1', '>='), PHP_VERSION, 'Use PHP 8.1 or newer (cPanel: Select PHP Version / MultiPHP Manager).');
    $add('openssl extension', extension_loaded('openssl'), extension_loaded('openssl') ? 'loaded' : 'missing', 'Enable the openssl extension in the PHP settings.');
    $add('mbstring extension', extension_loaded('mbstring'), extension_loaded('mbstring') ? 'loaded' : 'missing', 'Enable the mbstring extension in the PHP settings.');

    // 2. Settings (masked)
    $add('Settings loaded from', $sources !== [], $sources ? implode(', ', $sources) : 'none',
        'Run npm run build with the mail settings in .env, then upload out/ (it creates api/env.php).');
    $add('Transport', true, $config['transport'] === 'mail' ? 'mail (host’s built-in mailer, no SMTP login)' : 'smtp');
    $add('Recipients (CONTACT_TO)', (bool) $config['to'], implode(', ', $config['to']) ?: 'not set', 'Set CONTACT_TO.');
    $add('Sender (CONTACT_FROM_EMAIL)', $config['from_email'] !== '', $config['from_email'] ?: 'not set', 'Set CONTACT_FROM_EMAIL to an address on your domain.');
    if ($config['transport'] === 'smtp') {
        $add('SMTP settings', $host !== '', sprintf('host %s, port %d, security %s, username %s, password %s, certificate check %s',
            $host ?: '(not set)', $port, $secure ?: 'none', $smtp['username'] ?: '(none)',
            $smtp['password'] !== '' ? 'set (' . mb_strlen($smtp['password']) . ' characters)' : 'NOT set', $config['verify_peer'] ? 'on' : 'off'), 'Set SMTP_HOST.');
        $hostProblem = teecoms_smtp_host_problem($host);
        if ($hostProblem !== '') {
            $add('SMTP_HOST format', false, $host, $hostProblem);
            return ['ok' => false, 'checks' => $checks];
        }
        if ($smtp['username'] !== '' && !str_contains($smtp['username'], '@')) {
            $add('SMTP_USERNAME format', false, $smtp['username'],
                'cPanel mail logins are the full email address (for example info@digitalinvoice.ng).');
        }
        $pair = ['465' => 'ssl', '587' => 'tls'][(string) $port] ?? null;
        if ($pair !== null && $secure !== $pair) {
            $add('Port and security pairing', false, "port $port with SMTP_SECURE=$secure",
                "Port $port normally uses SMTP_SECURE=$pair (465 = ssl, 587 = tls).");
        }
        if ($smtp['username'] !== '' && strcasecmp($smtp['username'], $config['from_email']) !== 0) {
            $add('Sender matches login', false, "From {$config['from_email']} but logged in as {$smtp['username']}",
                'Many hosts only send From the logged-in mailbox. Set CONTACT_FROM_EMAIL to the same address as SMTP_USERNAME.');
        }
    }

    if ($config['transport'] === 'smtp' && $host !== '') {
        // 3. DNS
        $ip = gethostbyname($host);
        if (!$add('DNS lookup', $ip !== $host || filter_var($host, FILTER_VALIDATE_IP), "$host -> $ip",
            'The SMTP host name doesn’t resolve. Check SMTP_HOST (cPanel: Email Accounts > Connect Devices).')) {
            return ['ok' => false, 'checks' => $checks];
        }

        // 4. Can this server reach the port at all?
        $errno = 0; $errstr = '';
        $sock = @fsockopen($host, $port, $errno, $errstr, 8);
        if (!$add('Port reachable', (bool) $sock, $sock ? "connected to $host:$port" : "$host:$port: $errstr ($errno)",
            "This server can’t open $host:$port. The host may block outgoing SMTP: try port 587 with tls (or 465 with ssl), use localhost as SMTP_HOST, or set CONTACT_TRANSPORT=mail to use the host’s built-in mailer.")) {
            return ['ok' => false, 'checks' => $checks];
        }
        fclose($sock);

        // 5. Certificate: does it match the host name?
        if ($secure === 'ssl' || $secure === 'tls') {
            [$names, $certError] = teecoms_peer_cert_names($host, $port, $secure);
            if ($names) {
                $matches = teecoms_cert_matches($host, $names);
                $issued = 'certificate issued to: ' . implode(', ', array_slice($names, 0, 6));
                if (!$matches && !$config['verify_peer']) {
                    // Deliberately allowed with SMTP_VERIFY_PEER=false: a warning, not a failure
                    $add('Certificate name', true, $issued . '. Doesn’t match ' . $host . ', but certificate checking is off (SMTP_VERIFY_PEER=false). Better: set SMTP_HOST to one of these names and turn checking back on.');
                } else
                $add('Certificate name', $matches, $issued,
                    'The mail server’s certificate isn’t issued to “' . $host . '”, so secure connections are refused. Set SMTP_HOST to '
                    . 'one of the names above (usually the server hostname), or as a last resort set SMTP_VERIFY_PEER=false.');
            } else {
                $add('Certificate name', false, $certError ?: 'no certificate received',
                    $secure === 'ssl' ? 'Port 465 needs SMTP_SECURE=ssl; if this keeps failing, try port 587 with tls.' : 'The server didn’t offer STARTTLS on this port; try port 465 with ssl.');
            }
        }

        // 6. Log in (no email sent); the password is masked in the transcript
        $transcript = [];
        $mail = teecoms_mailer($config, $transcript);
        try {
            $connected = $mail->smtpConnect();
            $add('SMTP login', $connected, $connected ? 'connected and accepted' : 'connection failed',
                'See the transcript below for the server’s reply.');
            $mail->smtpClose();
        } catch (MailException $e) {
            $msg = $mail->ErrorInfo ?: $e->getMessage();
            $hint = stripos($msg, 'authenticate') !== false
                ? 'The mail server rejected the username or password (535). Check the password length shown under “SMTP settings” matches your real password. '
                  . 'Confirm the login works in webmail with the same address and password, or reset the mailbox password in cPanel (Email Accounts > Manage), '
                  . 'then update SMTP_PASSWORD in .env, rebuild and upload. After several failures the host may block logins from this server for a while.'
                : (stripos($msg, 'certificate') !== false || stripos($msg, 'ssl') !== false
                    ? 'Secure connection failed: see “Certificate name” above.'
                    : 'See the transcript below for the server’s reply.');
            $add('SMTP login', false, $msg, $hint);
            return ['ok' => false, 'checks' => $checks, 'transcript' => $transcript];
        }
    }

    // 7. Optional real test email to the recipients
    if ($send) {
        $transcript = $transcript ?? [];
        $mail = teecoms_mailer($config, $transcript);
        try {
            foreach ($config['to'] as $address) {
                $mail->addAddress($address);
            }
            $mail->Subject = 'Teecoms contact form: diagnostics test';
            $mail->Body = '<p>This test email was sent by the contact form diagnostics. If you can read it, sending works.</p>';
            $mail->AltBody = 'This test email was sent by the contact form diagnostics. If you can read it, sending works.';
            $mail->send();
            $add('Test email', true, 'sent to ' . implode(', ', $config['to']) . ': check the inbox (and spam folder)');
        } catch (MailException $e) {
            $add('Test email', false, $mail->ErrorInfo ?: $e->getMessage(),
                $config['transport'] === 'mail' ? 'The host’s built-in mailer refused the message; ask the host to enable PHP mail(), or use SMTP.' : 'See the transcript below.');
        }
    }

    $ok = !in_array(false, array_column($checks, 'ok'), true);
    $report = ['ok' => $ok, 'checks' => $checks];
    if (!empty($transcript)) {
        $report['transcript'] = $transcript;
    }
    return $report;
}

/** Certificate names (CN + subjectAltName DNS) presented on host:port. */
function teecoms_peer_cert_names(string $host, int $port, string $secure): array
{
    $ctx = stream_context_create(['ssl' => [
        'capture_peer_cert' => true, 'verify_peer' => false, 'verify_peer_name' => false, 'SNI_enabled' => true, 'peer_name' => $host,
    ]]);
    $errno = 0; $errstr = '';
    if ($secure === 'ssl') {
        $s = @stream_socket_client("ssl://$host:$port", $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $ctx);
        if (!$s) {
            return [[], "TLS connection failed: $errstr"];
        }
    } else {
        $s = @stream_socket_client("tcp://$host:$port", $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $ctx);
        if (!$s) {
            return [[], "connection failed: $errstr"];
        }
        stream_set_timeout($s, 8);
        $read = function () use ($s) { $out = ''; while (($line = fgets($s, 1024)) !== false) { $out .= $line; if (strlen($line) < 4 || $line[3] === ' ') { break; } } return $out; };
        $read();
        fwrite($s, "EHLO diagnostics\r\n"); $read();
        fwrite($s, "STARTTLS\r\n"); $reply = $read();
        if (strpos($reply, '220') !== 0) {
            fclose($s);
            return [[], 'server did not accept STARTTLS: ' . trim($reply)];
        }
        if (!@stream_socket_enable_crypto($s, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($s);
            return [[], 'TLS handshake failed'];
        }
    }
    $cert = stream_context_get_params($s)['options']['ssl']['peer_certificate'] ?? null;
    fclose($s);
    if (!$cert) {
        return [[], 'no certificate received'];
    }
    $info = openssl_x509_parse($cert) ?: [];
    $names = [];
    if (!empty($info['subject']['CN'])) {
        $names[] = (string) $info['subject']['CN'];
    }
    foreach (explode(',', $info['extensions']['subjectAltName'] ?? '') as $alt) {
        $alt = trim($alt);
        if (stripos($alt, 'DNS:') === 0) {
            $names[] = substr($alt, 4);
        }
    }
    return [array_values(array_unique($names)), ''];
}

function teecoms_cert_matches(string $host, array $names): bool
{
    $host = strtolower($host);
    foreach ($names as $name) {
        $name = strtolower($name);
        if ($name === $host) {
            return true;
        }
        if (str_starts_with($name, '*.') && substr_count($host, '.') >= 2 && substr($host, strpos($host, '.')) === substr($name, 1)) {
            return true;
        }
    }
    return false;
}
