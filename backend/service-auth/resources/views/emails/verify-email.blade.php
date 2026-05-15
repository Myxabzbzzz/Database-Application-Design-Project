<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 40px 0; }
        .container { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 40px; }
        h2 { color: #333; margin-top: 0; }
        p { color: #555; line-height: 1.6; }
        .code { font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #1a1a1a;
                background: #f0f0f0; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
        .footer { color: #999; font-size: 13px; margin-top: 32px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hi, {{ $userName }}!</h2>
        <p>Use the code below to verify your email address. The code expires in <strong>10 minutes</strong>.</p>
        <div class="code">{{ $code }}</div>
        <p>If you didn't create an account, you can ignore this email.</p>
        <div class="footer">This email was sent automatically. Please do not reply.</div>
    </div>
</body>
</html>
