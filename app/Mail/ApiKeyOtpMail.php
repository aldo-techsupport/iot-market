<?php

namespace App\Mail;

use App\Models\Device;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApiKeyOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $otpCode;
    public Device $device;
    public string $userName;

    public function __construct(string $otpCode, Device $device, string $userName)
    {
        $this->otpCode   = $otpCode;
        $this->device    = $device;
        $this->userName  = $userName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[' . config('app.name') . '] Kode OTP API Key — ' . $this->device->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.api-key-otp',
        );
    }
}
