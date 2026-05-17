<?php

namespace app\Containers\Cart\Mail;

use App\Containers\Cart\Models\Cart;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AbandonedCartReminder extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Cart $cart,
        public array $cartData
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You left items in your cart - Complete your purchase!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $html = $this->generateHtml();

        return new Content(
            html: $html,
        );
    }

    /**
     * Generate HTML for email
     */
    private function generateHtml(): string
    {
        $userName = $this->cart->user->name;
        $items = $this->cartData['items'];
        $itemCount = count($items);
        $totalPrice = $this->cartData['totalPrice'];
        $cartUrl = config('app.frontend_url', 'http://localhost') . '/cart';

        $itemsHtml = '';
        foreach ($items as $item) {
            $imageHtml = $item['image_url']
                ? '<img src="' . htmlspecialchars($item['image_url']) . '" alt="' . htmlspecialchars($item['name']) . '" class="item-image">'
                : '';

            $metaHtml = '';
            if ($item['size'] || $item['color']) {
                $meta = [];
                if ($item['size']) $meta[] = 'Size: ' . htmlspecialchars($item['size']);
                if ($item['color']) $meta[] = 'Color: ' . htmlspecialchars($item['color']);
                $metaHtml = '<div class="item-meta">' . implode(' | ', $meta) . '</div>';
            }

            $itemsHtml .= '
            <div class="cart-item">
                ' . $imageHtml . '
                <div class="item-details">
                    <div class="item-name">' . htmlspecialchars($item['name']) . '</div>
                    ' . $metaHtml . '
                    <div class="item-meta">Quantity: ' . $item['quantity'] . '</div>
                    <div class="item-price">$' . number_format($item['subtotal'], 2) . '</div>
                </div>
            </div>';
        }

        $pluralItems = $itemCount > 1 ? 's' : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Cart is Waiting</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .cart-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            margin-bottom: 15px;
        }
        .cart-item:last-child {
            border-bottom: none;
        }
        .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 15px;
        }
        .item-details {
            flex-grow: 1;
        }
        .item-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .item-meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 3px;
        }
        .item-price {
            font-weight: bold;
            color: #27ae60;
        }
        .total-section {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: right;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        .cta-button {
            display: inline-block;
            margin-top: 25px;
            padding: 15px 40px;
            background-color: #3498db;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
        }
        .cta-button:hover {
            background-color: #2980b9;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Cart is Waiting!</h1>

        <p class="greeting">
            Hi {$userName},
        </p>

        <p>
            You left <strong>{$itemCount} item{$pluralItems}</strong> in your cart.
            Don't miss out on these amazing pieces!
        </p>

        <div class="cart-items">
            {$itemsHtml}
        </div>

        <div class="total-section">
            <p>Total: <span class="total">\${$totalPrice}</span></p>
        </div>

        <center>
            <a href="{$cartUrl}" class="cta-button">
                Complete Your Purchase
            </a>
        </center>

        <p style="margin-top: 25px; color: #666;">
            These items are in high demand and may sell out soon.
            Complete your purchase now to secure your favorites!
        </p>

        <div class="footer">
            <p>
                This is an automated reminder about your cart.
                If you've already completed your purchase, please disregard this email.
            </p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
