<?php

namespace App\Containers\User\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class VerifyEmail extends Mailable
{
    public function __construct(
        public readonly string $code,
        public readonly string $userName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Email Verification Code');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verify-email');
    }
}
