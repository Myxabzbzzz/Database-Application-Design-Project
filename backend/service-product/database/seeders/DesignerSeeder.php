<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DesignerSeeder extends Seeder
{
    private string $imgBase = '';

    public function run(): void
    {
        $this->imgBase = rtrim(env('STORAGE_BASE_URL', '/storage/storage'), '/') . '/figma/';

        $designers = [
            [
                'name'        => 'MAISON NOIR',
                'slug'        => 'maison-noir',
                'description' => 'Paris-born atelier dedicated to the beauty of darkness. Each piece is an exploration of shadow, structure, and sensuality — crafted for those who find poetry in restraint.',
                'avatar_url'  => $this->imgBase . '02d2b3e4cb24899953893632831c26752e796839.jpg',
                'banner_url'  => $this->imgBase . '041112313df1b172d38642f3bb6c553ef53cdbbb.png',
            ],
            [
                'name'        => 'LUMIÈRE',
                'slug'        => 'lumiere',
                'description' => 'Masters of occasionwear. LUMIÈRE transforms light into garments — liquid silks, champagne-hued satins, and evening gowns that belong in a different century.',
                'avatar_url'  => $this->imgBase . '24d12f591603072747f0e27389342be35d119eac.jpg',
                'banner_url'  => $this->imgBase . '14966ea30ff34d4d274482b50e9fb859de34885c.png',
            ],
            [
                'name'        => 'STUDIO FORM',
                'slug'        => 'studio-form',
                'description' => 'Architectural tailoring that treats the body as a canvas. STUDIO FORM\'s clean geometry and refined proportions define a new standard for power dressing.',
                'avatar_url'  => $this->imgBase . '2d58c6eeccafa7025cbd214fefa57ffbbf74499b.jpg',
                'banner_url'  => $this->imgBase . '2c77025b71d3f4dfd4a1f8a201d27e375244c405.png',
            ],
            [
                'name'        => 'ARCHIVE',
                'slug'        => 'archive',
                'description' => 'Timeless essentials built for a life well-lived. ARCHIVE believes the best garment is the one you wear for twenty years — quality over trend, always.',
                'avatar_url'  => $this->imgBase . '2e766a2a3c31fd05ece15411c3f263ae73a2eb32.jpg',
                'banner_url'  => $this->imgBase . '3806ba65f36f4892fa9c44fd3b1d296d177019f3.png',
            ],
            [
                'name'        => 'SOLE NOIR',
                'slug'        => 'sole-noir',
                'description' => 'Footwear and accessories that complete the picture. SOLE NOIR\'s obsession with leather craft produces pieces that become more beautiful with age.',
                'avatar_url'  => $this->imgBase . '419b4bf115b45331801c04e15c5e33512ef6d674.jpg',
                'banner_url'  => $this->imgBase . '462e7c4f9b4d51ceaf1caa42a3864f32ba37979f.png',
            ],
            [
                'name'        => 'VERDANT',
                'slug'        => 'verdant',
                'description' => 'Sustainable luxury outerwear rooted in nature. VERDANT sources only the finest traceable wools and organic textiles, proving that ethics and elegance are inseparable.',
                'avatar_url'  => $this->imgBase . '4a27a2a4f962dda0764822a8f60b08dcce70ff3a.jpg',
                'banner_url'  => $this->imgBase . '5cdd19ef458c1621455ac5915a745952ba52ca1c.png',
            ],
        ];

        foreach ($designers as &$d) {
            $d['id']         = (string) Str::ulid();
            $d['created_at'] = now();
            $d['updated_at'] = now();
        }

        DB::table('designers')->insertOrIgnore($designers);
    }
}
