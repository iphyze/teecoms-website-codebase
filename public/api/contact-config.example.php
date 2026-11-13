<?php
/**
 * Copy this file to contact-config.php (same folder) on the server and fill it in.
 * contact-config.php is git-ignored so passwords never reach the repository.
 */
return [
    // Who receives enquiries (one or more addresses)
    'to' => ['info@digitalinvoice.ng'],

    // Sender shown on both emails. Use an address on your own domain that your
    // SMTP account is allowed to send from, or emails may be marked as spam.
    'from_email' => 'no-reply@your-domain.example',
    'from_name' => 'Teecoms Integrated Solutions',

    // SMTP account (cPanel: Email Accounts > Connect Devices shows these values)
    'smtp' => [
        'host' => 'mail.your-domain.example',
        'port' => 465,          // 465 with 'ssl', or 587 with 'tls'
        'secure' => 'ssl',      // 'ssl' | 'tls' | '' (none)
        'username' => 'no-reply@your-domain.example',
        'password' => '',       // or set the TEECOMS_SMTP_PASSWORD environment variable
    ],

    // Public site address: used for the logo and links inside the emails
    'site_url' => 'https://your-domain.example',

    // Extra origins allowed to post here (only if the form is on another domain)
    'allowed_origins' => [],

    // Per-visitor limit
    'rate_limit' => ['max' => 5, 'window' => 600],

    // Send the visitor a confirmation email
    'auto_reply' => true,
];
