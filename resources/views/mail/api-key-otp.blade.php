<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP API Key</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 32px 16px; }
        .wrapper { max-width: 560px; margin: 0 auto; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: -0.3px; }
        .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 36px 40px; }
        .greeting { color: #1e293b; font-size: 16px; margin: 0 0 16px; }
        .device-pill { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 14px; margin-bottom: 24px; }
        .device-pill span { font-size: 13px; color: #1d4ed8; font-weight: 600; }
        .otp-label { font-size: 13px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
        .otp-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; text-align: center; padding: 28px 20px; margin-bottom: 24px; }
        .otp-code { font-size: 46px; font-weight: 800; letter-spacing: 12px; color: #1e3a5f; font-family: 'Courier New', monospace; }
        .timer { font-size: 13px; color: #dc2626; margin-top: 10px; font-weight: 600; }
        .info { background: #fef9c3; border-left: 4px solid #fbbf24; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-bottom: 24px; }
        .info p { margin: 0; font-size: 13px; color: #713f12; line-height: 1.5; }
        .footer { padding: 20px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
        .footer p { font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.6; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">
        <div class="header">
            <h1>🔑 Verifikasi API Key</h1>
            <p>{{ config('app.name') }} — Sistem Monitoring IoT</p>
        </div>
        <div class="body">
            <p class="greeting">Halo, <strong>{{ $userName }}</strong>!</p>
            <p style="color:#475569;font-size:14px;margin:0 0 18px;">Kamu meminta akses ke API Key perangkat:</p>

            <div class="device-pill">
                <span>📡 {{ $device->name }} ({{ $device->device_code }})</span>
            </div>

            <div class="otp-label">Kode OTP Kamu</div>
            <div class="otp-box">
                <div class="otp-code">{{ $otpCode }}</div>
                <div class="timer">⏱ Berlaku selama 5 menit</div>
            </div>

            <div class="info">
                <p>⚠️ <strong>Jangan bagikan kode ini</strong> kepada siapapun. Tim kami tidak akan pernah meminta kode OTP kamu. Jika kamu tidak merasa melakukan permintaan ini, abaikan email ini.</p>
            </div>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh {{ config('app.name') }}.<br>
            &copy; {{ date('Y') }} {{ config('app.name') }}. Hak cipta dilindungi.</p>
        </div>
    </div>
</div>
</body>
</html>
