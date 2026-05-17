<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ItemSeeder extends Seeder
{
    private string $imgBase = '';

    /* 57 product PNGs from Figma export (512×512) */
    private array $imgs = [
        '095e853690b6907e58edc5a29bb98cd1adfa109e.png',
        '0e679b3e0ce561c7d48b609c998379d68b3da835.png',
        '0ec2ea6dca3c477e91ed21f74b360556333eec5d.png',
        '10e129fc36c77d4e0e0329b29873e13581be7b1a.png',
        '15ded9fc74ff4df44fc7d6a7c9cc79b8891dd067.png',
        '165e42f56de71750f4393c6809c470a28278821e.png',
        '194406a73a09b9f51fcac104bde6759d94be6618.png',
        '1c8a1374a009938c32a25be48903d325b2ccdb45.png',
        '1d31bf8d18626c9bd15402d451509082cf72f44d.png',
        '1e70f1fb1c6798ce7a4ff1d239a54d3ec24ae847.png',
        '201c61fdc8fbc8d87133bdcd3af8309a67e0cd96.png',
        '286f27a8d3beb6def0f8a74671f8e5f9bf8f8973.png',
        '2cfd09ea658575de8807d985f61e122a2fa38a71.png',
        '3fddf98207d39615a6539f68c7f616885ff325ab.png',
        '4e49eb10c9d98bd56516543df038bea134b7f3bc.png',
        '4f61c6dba3dfdbcc0aef5e4258e05ac54b9ac7b5.png',
        '5f261f5f41dda102a43a1cf2ae3550d4b840c895.png',
        '645bf182f6c569d8af36a1a8ee58ce6c6176ee11.png',
        '6cd49ee60cc288d72d95b2e6c573a0ad0fb67ed4.png',
        '700b760c573c314a07eda79cd1db53cc59b564d4.png',
        '741123a42fd1112e5ee76db2d7d2cdb505e79652.png',
        '753ee11f8ac1de4ba91bdc3a1361f1105fa97c58.png',
        '7641f1c014e7f1b6cacc0c79f47741e1848fd44f.png',
        '7982f21252d909c6fd3d7a33e8e94fffb31a9fc2.png',
        '7cf260d4a5537eef2f5981189edc5aa718062221.png',
        '8038a45aa7fd3b4b875f6a7b95331e5580e0d3e5.png',
        '80843ab44e28a73bd497d75e5f1f78269b069493.png',
        '81de92c6c2d814a2bca70d95b2a56e2c00160754.png',
        '86976f505f6a46aedfe434fb1f949af5d20b8937.png',
        '88bf9a9d29afd217060f0830e2fc2333876beda2.png',
        '8ea6481e53c26301d016f60e3e81ce620cc9b3d1.png',
        '8ef1e9cda8052ef7dd89f319b3f7dde9f5d46614.png',
        '9bb0dec7f6bbf1716fe9690c97f81dd093804e5d.png',
        '9bbfa795adf55a602dc284ac96ba057104a1cb0f.png',
        '9cf96a67c0ed9a530bde9fbf744130ea300c4b04.png',
        'a30533420b61b0df9bef91ab8031336b571b7485.png',
        'a5bb28c4ea2202b2aac7d3a4d142bc3849a3db8d.png',
        'aeee15b5c39d72045f0b786325dcab92794cf869.png',
        'af4b8ee43452c4121e68ae673de10fe8b937b212.png',
        'ba786c9c17b672b942e677cb556ab750aff0bdc5.png',
        'be9452a906c9e47489c7dc8a8bb3fe75eb482a7e.png',
        'c3a34490aac8444d5814ef34e39c54887bf961ff.png',
        'c50966a9e7c0592f0ebb951321960b16b6ccd620.png',
        'cf5eaa7713ed0f0110287111ffc1874f9f74b39c.png',
        'da712fd2b4f5497164652fd689b56560a68ee148.png',
        'dc54078b666724dfde8fcb932c4925d57d909740.png',
        'e25a0f866e3996d2066bc70a7a9c7523b935e9de.png',
        'e3dbb6843ab23ef4ca706465e08f7837f2e8e8ef.png',
        'e6aaac2ae837b9c4a033bad0d4edb21f73a6651b.png',
        'ea5b722d6b73ea43446d03152c72ce08d631374d.png',
        'eefded638b81cec8badf5939ee18568fc0974161.png',
        'f58116a1446c1833a9c5f4649dcf6c916c7cd83d.png',
        'fa18ca70a6f3d606b9e4bd2e26f7e614a27d0629.png',
        'fe41e33f6f50b5ce46318ba4be66c11edffc4bfd.png',
        'febb2814daf55492db36391bfcd22bd9cf42a445.png',
    ];

    private int $imgCursor = 0;

    private function img(): string
    {
        $hash = $this->imgs[$this->imgCursor % count($this->imgs)];
        $this->imgCursor++;
        return $this->imgBase . $hash;
    }

    public function run(): void
    {
        $this->imgBase = rtrim(env('STORAGE_BASE_URL', '/storage/storage'), '/') . '/figma/';

        $designers = DB::table('designers')->pluck('id', 'slug');

        $catalogue = [
            /* ── MAISON NOIR ─────────────────────────────────── */
            'maison-noir' => [
                ['name' => 'Silk Bias-Cut Maxi Dress',      'category' => 'Dresses',     'price' => 1890, 'size' => 'M',        'color' => '#1a1a1a', 'description' => 'Fluid bias-cut in pure silk charmeuse. The natural drape moves with the body, creating a silhouette that is simultaneously sculptural and effortless.', 'is_signature' => true],
                ['name' => 'Draped One-Shoulder Gown',       'category' => 'Dresses',     'price' => 2340, 'size' => 'S',        'color' => '#1a1a1a', 'description' => 'A single sweep of matte crêpe from shoulder to floor. Minimal in design, maximal in presence.', 'is_signature' => false],
                ['name' => 'Structured Leather Blazer',      'category' => 'Blazers',     'price' => 2100, 'size' => 'M',        'color' => '#1a1a1a', 'description' => 'Soft lamb leather with precise tailoring. The silhouette is sharp; the touch, unexpectedly supple.', 'is_signature' => true],
                ['name' => 'Wide-Leg Crepe Trousers',        'category' => 'Trousers',    'price' => 890,  'size' => 'M',        'color' => '#1a1a1a', 'description' => 'High-waisted, wide-leg trousers in matte crêpe. A wardrobe cornerstone for any season.', 'is_signature' => false],
                ['name' => 'Leather Crossbody Bag',          'category' => 'Bags',        'price' => 1650, 'size' => 'One Size', 'color' => '#1a1a1a', 'description' => 'Full-grain leather with a single clean seam. Adjustable strap, interior zip pocket. The perfect companion.', 'is_signature' => false],
            ],

            /* ── LUMIÈRE ─────────────────────────────────────── */
            'lumiere' => [
                ['name' => 'Champagne Column Gown',          'category' => 'Dresses',     'price' => 3200, 'size' => 'S',        'color' => '#c9a870', 'description' => 'A column of champagne silk with a barely-there sheen. Worn to the most important evenings.', 'is_signature' => true],
                ['name' => 'Ivory Silk Wrap Dress',          'category' => 'Dresses',     'price' => 1740, 'size' => 'M',        'color' => '#f0ebe4', 'description' => 'Wrap silhouette in ivory habotai silk. Effortlessly adjustable, endlessly elegant.', 'is_signature' => false],
                ['name' => 'Gold-Embroidered Evening Blazer','category' => 'Blazers',     'price' => 2890, 'size' => 'M',        'color' => '#c9a870', 'description' => 'Ivory satin base with hand-applied gold thread embroidery at the lapels. A collector\'s piece.', 'is_signature' => true],
                ['name' => 'Crystal Drop Earrings',          'category' => 'Accessories', 'price' => 620,  'size' => 'One Size', 'color' => '#c9a870', 'description' => 'Faceted crystal drops suspended in 18k gold-plated settings. Length 6cm.', 'is_signature' => false],
                ['name' => 'Metallic Evening Clutch',        'category' => 'Bags',        'price' => 980,  'size' => 'One Size', 'color' => '#c9a870', 'description' => 'Gold metallic fabric over a rigid frame. Magnetic closure, internal mirror. Designed for the night.', 'is_signature' => false],
            ],

            /* ── STUDIO FORM ─────────────────────────────────── */
            'studio-form' => [
                ['name' => 'Ivory Structured Blazer',        'category' => 'Blazers',     'price' => 1340, 'size' => 'M',        'color' => '#f0ebe4', 'description' => 'A masterclass in tailoring. The ivory wool-blend holds its shape through every hour of the day.', 'is_signature' => true],
                ['name' => 'Charcoal Power Blazer',          'category' => 'Blazers',     'price' => 1290, 'size' => 'L',        'color' => '#3c3c3c', 'description' => 'Double-faced wool in deep charcoal. Padded shoulders, single-button closure. Unapologetically commanding.', 'is_signature' => false],
                ['name' => 'Tailored Wide-Leg Suit Trouser', 'category' => 'Trousers',    'price' => 780,  'size' => 'M',        'color' => '#3c3c3c', 'description' => 'Matching trouser to the Charcoal Power Blazer. Full length, wide leg, impeccable press.', 'is_signature' => false],
                ['name' => 'Ribbed Cashmere Turtleneck',     'category' => 'Knitwear',    'price' => 890,  'size' => 'M',        'color' => '#f0ebe4', 'description' => 'Grade-A cashmere in a fine rib. The roll neck sits perfectly high. A foundation piece.', 'is_signature' => false],
                ['name' => 'Classic Double-Breasted Trench', 'category' => 'Coats',       'price' => 2450, 'size' => 'M',        'color' => '#c9a870', 'description' => 'Gabardine cotton in camel. Fully lined, storm flap, D-ring belt. The definitive trench.', 'is_signature' => true],
            ],

            /* ── ARCHIVE ─────────────────────────────────────── */
            'archive' => [
                ['name' => 'Camel Wool Overcoat',            'category' => 'Coats',       'price' => 2200, 'size' => 'M',        'color' => '#c9a870', 'description' => 'Boiled Italian wool in the warmest camel. Notch lapel, two patch pockets. Lasts a lifetime.', 'is_signature' => true],
                ['name' => 'Double-Breasted Peacoat',        'category' => 'Coats',       'price' => 1850, 'size' => 'L',        'color' => '#1a1a1a', 'description' => 'Six-button peacoat in boiled merino. Maritime origins, contemporary proportions.', 'is_signature' => false],
                ['name' => 'Cream Pleated Midi Dress',       'category' => 'Dresses',     'price' => 1120, 'size' => 'S',        'color' => '#f0ebe4', 'description' => 'Accordion pleats in matte crêpe de chine. Midi length, wide scoop neck. Archive\'s most-loved silhouette.', 'is_signature' => false],
                ['name' => 'Merino Ribbed Cardigan',         'category' => 'Knitwear',    'price' => 680,  'size' => 'M',        'color' => '#f0ebe4', 'description' => 'Extra-fine merino in a wide rib. Six mother-of-pearl buttons. The cardigan you will pass down.', 'is_signature' => false],
                ['name' => 'Oversized Cashmere Pullover',    'category' => 'Knitwear',    'price' => 920,  'size' => 'XL',       'color' => '#c9a870', 'description' => 'Grade-A cashmere in a relaxed oversized cut. Drop shoulder, ribbed cuffs and hem. Indulgent comfort.', 'is_signature' => true],
            ],

            /* ── SOLE NOIR ───────────────────────────────────── */
            'sole-noir' => [
                ['name' => 'Black Patent Chelsea Boots',     'category' => 'Footwear',    'price' => 1290, 'size' => '38',       'color' => '#1a1a1a', 'description' => 'Patent leather with elastic side panels and a stacked heel. The boot for every occasion.', 'is_signature' => true],
                ['name' => 'Nude Suede Heeled Mules',        'category' => 'Footwear',    'price' => 890,  'size' => '37',       'color' => '#c9a870', 'description' => 'Butter-soft suede on a sculpted 8cm heel. Open toe. The definition of effortless sophistication.', 'is_signature' => false],
                ['name' => 'Polished Leather Ankle Boots',   'category' => 'Footwear',    'price' => 1450, 'size' => '38',       'color' => '#1a1a1a', 'description' => 'Box-calf leather on a tapered block heel. Side zip. Structured and timeless.', 'is_signature' => false],
                ['name' => 'Gold Chain Collar Necklace',     'category' => 'Accessories', 'price' => 480,  'size' => 'One Size', 'color' => '#c9a870', 'description' => '18k gold-plated brass links. Lobster clasp, 42cm + 5cm extension. Wearable alone or layered.', 'is_signature' => false],
                ['name' => 'Structured Leather Tote',        'category' => 'Bags',        'price' => 2100, 'size' => 'One Size', 'color' => '#1a1a1a', 'description' => 'Full-grain leather over a rigid base. Open top, interior pocket, optional crossbody strap.', 'is_signature' => true],
            ],

            /* ── VERDANT ─────────────────────────────────────── */
            'verdant' => [
                ['name' => 'Forest Green Long Coat',         'category' => 'Coats',       'price' => 2890, 'size' => 'M',        'color' => '#2d4a3e', 'description' => 'Responsible traceable wool in deep forest green. Belted waist, dropped shoulders. Statement outerwear.', 'is_signature' => true],
                ['name' => 'Belted Cocoon Coat',             'category' => 'Coats',       'price' => 2400, 'size' => 'M',        'color' => '#1a1a1a', 'description' => 'Organic boiled wool in a cocoon silhouette. Wide belt cinches to define. Sustainably produced.', 'is_signature' => false],
                ['name' => 'Oversized Cable-Knit Pullover',  'category' => 'Knitwear',    'price' => 740,  'size' => 'XL',       'color' => '#f0ebe4', 'description' => 'Heavyweight organic merino in a classic cable knit. Chunky and warm — the one you want on winter mornings.', 'is_signature' => false],
                ['name' => 'Alpaca Ribbed Turtleneck',       'category' => 'Knitwear',    'price' => 820,  'size' => 'M',        'color' => '#c9a870', 'description' => 'Baby alpaca blended with organic merino. Supremely soft, genuinely warm, long-wearing.', 'is_signature' => false],
                ['name' => 'Soft Leather Shopper',           'category' => 'Bags',        'price' => 1380, 'size' => 'One Size', 'color' => '#5a3a2a', 'description' => 'Vegetable-tanned leather in cognac. Unstructured silhouette, brass rivets. Improves with every use.', 'is_signature' => true],
            ],
        ];

        $items  = [];
        $images = [];

        foreach ($catalogue as $slug => $entries) {
            $designerId = $designers[$slug] ?? null;
            if (!$designerId) continue;

            foreach ($entries as $entry) {
                $itemId = (string) Str::ulid();
                $items[] = [
                    'id'             => $itemId,
                    'designer_id'    => $designerId,
                    'name'           => $entry['name'],
                    'slug'           => Str::slug($entry['name']),
                    'description'    => $entry['description'],
                    'price'          => $entry['price'],
                    'category'       => $entry['category'],
                    'size'           => $entry['size'],
                    'color'          => $entry['color'],
                    'stock_quantity' => rand(5, 40),
                    'is_signature'   => $entry['is_signature'],
                    'is_active'      => true,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ];

                /* 2 images per item */
                $images[] = ['id' => (string) Str::ulid(), 'item_id' => $itemId, 'url' => $this->img(), 'sort_order' => 0, 'created_at' => now()];
                $images[] = ['id' => (string) Str::ulid(), 'item_id' => $itemId, 'url' => $this->img(), 'sort_order' => 1, 'created_at' => now()];
            }
        }

        DB::table('items')->insertOrIgnore($items);
        DB::table('item_images')->insertOrIgnore($images);

        $this->command?->info('Seeded ' . count($items) . ' items with ' . count($images) . ' images.');
    }
}
