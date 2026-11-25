<?php
/**
 * Branded HTML emails for the Teecoms contact form.
 * Table layout + inline styles for Gmail, Outlook and Apple Mail.
 * All visitor input is escaped with e().
 */
declare(strict_types=1);

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

const TEECOMS_FONT = "'Plus Jakarta Sans','Segoe UI',Helvetica,Arial,sans-serif";

function teecoms_layout(string $title, string $preheader, string $content, string $siteUrl, string $footerNote): string
{
    $font = TEECOMS_FONT;
    $logo = e($siteUrl . '/images/brand/teecoms-logo-light.png');
    $site = e($siteUrl);
    $host = e(preg_replace('#^https?://#', '', $siteUrl));
    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>{$title}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background: #eef3f9; }
  a { color: #1766c8; }
  @media (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .h1 { font-size: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#eef3f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef3f9;">{$preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef3f9;">
  <tr><td align="center" style="padding:36px 12px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
      <tr><td class="px" style="padding:0 8px 20px;">
        <a href="{$site}" style="text-decoration:none;"><img src="{$logo}" width="210" alt="Teecoms Integrated Solutions Limited" style="display:block;width:210px;height:auto;border:0;"></a>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #d6dfec;border-radius:18px;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="6" style="height:6px;line-height:6px;font-size:0;background:#1766c8;background-image:linear-gradient(90deg,#1766c8,#19d8a4);">&nbsp;</td></tr>
          <tr><td class="px" style="padding:38px 44px 40px;font-family:{$font};color:#0a1e45;">
            {$content}
          </td></tr>
        </table>
      </td></tr>
      <tr><td class="px" style="padding:24px 8px 0;font-family:{$font};font-size:12px;line-height:1.6;color:#5a6987;">
        <strong style="color:#0a1e45;">Teecoms Integrated Solutions Limited</strong><br>
        Connecting People. Securing Systems. Transforming Businesses.<br>
        <a href="{$site}" style="color:#1766c8;text-decoration:none;">{$host}</a><br>
        <span style="color:#8494b2;">{$footerNote}</span>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
HTML;
}

function teecoms_eyebrow(string $text): string
{
    return '<p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1766c8;">' . e($text) . '</p>';
}

function teecoms_button(string $label, string $href): string
{
    $font = TEECOMS_FONT;
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 4px;"><tr>'
        . '<td style="border-radius:10px;background:#1766c8;">'
        . '<a href="' . e($href) . '" style="display:inline-block;padding:13px 24px;font-family:' . $font . ';font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">' . e($label) . ' &rarr;</a>'
        . '</td></tr></table>';
}

function teecoms_rows(array $rows): string
{
    $html = '';
    foreach ($rows as $label => $value) {
        $html .= '<tr>'
            . '<td style="padding:11px 0;border-bottom:1px solid #e3e9f2;font-size:13px;color:#5a6987;width:38%;vertical-align:top;">' . e($label) . '</td>'
            . '<td style="padding:11px 0;border-bottom:1px solid #e3e9f2;font-size:14px;font-weight:600;color:#0a1e45;vertical-align:top;">' . $value . '</td>'
            . '</tr>';
    }
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $html . '</table>';
}

function teecoms_message_block(string $message, string $label): string
{
    return '<p style="margin:26px 0 8px;font-size:13px;color:#5a6987;">' . e($label) . '</p>'
        . '<div style="padding:18px 20px;background:#f4f8fd;border:1px solid #e3e9f2;border-radius:12px;font-size:14px;line-height:1.7;color:#0a1e45;">'
        . nl2br(e($message)) . '</div>';
}

function first_name(string $fullName): string
{
    $parts = preg_split('/\s+/', trim($fullName));
    return $parts[0] ?? $fullName;
}

// ---- Email to Teecoms --------------------------------------------------------
function teecoms_notification_html(array $d, string $siteUrl, string $when, string $ip): string
{
    $email = e($d['email']);
    $phone = $d['phone'] !== '' ? '<a href="tel:' . e(preg_replace('/[^\d+]/', '', $d['phone'])) . '" style="color:#1766c8;text-decoration:none;">' . e($d['phone']) . '</a>' : '<span style="color:#8494b2;font-weight:500;">Not given</span>';
    $content = teecoms_eyebrow('New website enquiry')
        . '<h1 class="h1" style="margin:0;font-size:28px;line-height:1.2;font-weight:800;letter-spacing:-0.5px;color:#0a1e45;">' . e($d['fullName']) . '</h1>'
        . '<p style="margin:6px 0 26px;font-size:15px;color:#46557a;">' . ($d['company'] !== '' ? e($d['company']) : 'No company given') . '</p>'
        . teecoms_rows([
            'Email' => '<a href="mailto:' . $email . '" style="color:#1766c8;text-decoration:none;">' . $email . '</a>',
            'Phone' => $phone,
            'Service of interest' => $d['service'] !== '' ? e($d['service']) : '<span style="color:#8494b2;font-weight:500;">Not selected</span>',
            'Submitted' => e($when),
        ])
        . teecoms_message_block($d['message'], 'Message')
        . teecoms_button('Reply to ' . first_name($d['fullName']), 'mailto:' . $d['email'] . '?subject=' . rawurlencode('Re: Your enquiry to Teecoms'));
    return teecoms_layout('New enquiry from ' . e($d['fullName']), 'New enquiry from ' . e($d['fullName']) . ' via the Teecoms website.', $content, $siteUrl,
        'Sent from the contact form on your website. Replying to this email answers ' . e(first_name($d['fullName'])) . ' directly. Visitor IP: ' . e($ip) . '.');
}

function teecoms_notification_text(array $d, string $siteUrl, string $when): string
{
    return "New website enquiry\n\nName: {$d['fullName']}\nCompany: " . ($d['company'] ?: 'Not given') . "\nEmail: {$d['email']}\nPhone: " . ($d['phone'] ?: 'Not given')
        . "\nService of interest: " . ($d['service'] ?: 'Not selected') . "\nSubmitted: {$when}\n\nMessage:\n{$d['message']}\n\nReply to this email to answer {$d['fullName']} directly.\n{$siteUrl}";
}

// ---- Confirmation to the visitor ----------------------------------------------
function teecoms_autoreply_html(array $d, string $siteUrl): string
{
    $rows = ['Service of interest' => $d['service'] !== '' ? e($d['service']) : 'General enquiry'];
    if ($d['company'] !== '') {
        $rows['Company'] = e($d['company']);
    }
    if ($d['phone'] !== '') {
        $rows['Phone'] = e($d['phone']);
    }
    $content = teecoms_eyebrow('Enquiry received')
        . '<h1 class="h1" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:800;letter-spacing:-0.5px;color:#0a1e45;">Thank you, ' . e(first_name($d['fullName'])) . '.</h1>'
        . '<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#46557a;">We’ve received your enquiry, and a member of the Teecoms team will get back to you at <strong style="color:#0a1e45;">' . e($d['email']) . '</strong>.</p>'
        . '<p style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#46557a;">Here’s a copy of what you sent us. If you’d like to add anything, simply reply to this email.</p>'
        . teecoms_rows($rows)
        . teecoms_message_block($d['message'], 'Your message')
        . teecoms_button('Visit the Teecoms website', $siteUrl ?: '#')
        . '<p style="margin:30px 0 0;font-size:15px;line-height:1.7;color:#46557a;">Warm regards,<br><strong style="color:#0a1e45;">The Teecoms team</strong></p>';
    return teecoms_layout('We’ve received your enquiry', 'Thanks for contacting Teecoms. Here’s a copy of your enquiry.', $content, $siteUrl,
        'You’re receiving this because you contacted us through our website.');
}

function teecoms_autoreply_text(array $d, string $siteUrl): string
{
    return 'Thank you, ' . first_name($d['fullName']) . ".\n\nWe've received your enquiry, and a member of the Teecoms team will get back to you at {$d['email']}.\n\n"
        . 'Service of interest: ' . ($d['service'] ?: 'General enquiry') . "\n\nYour message:\n{$d['message']}\n\nIf you'd like to add anything, simply reply to this email.\n\nWarm regards,\nThe Teecoms team\n{$siteUrl}";
}
