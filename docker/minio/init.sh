#!/bin/sh
set -e

mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

mc mb --ignore-existing "local/$MINIO_BUCKET"
mc anonymous set download "local/$MINIO_BUCKET"

# ── Extract and upload Figma assets ──────────────────────────────────────────
FIG="/fig/design.fig"

if [ -f "$FIG" ]; then
    echo "Figma file found — extracting images..."
    TMP=$(mktemp -d)

    # .fig is a ZIP archive; images live in the images/ directory inside
    unzip -q "$FIG" "images/*" -d "$TMP" 2>/dev/null || true

    if [ -d "$TMP/images" ] && [ "$(ls -A "$TMP/images" 2>/dev/null)" ]; then
        echo "Uploading figma images to MinIO..."
        mc cp --recursive "$TMP/images/" "local/$MINIO_BUCKET/figma/"
        echo "Done — $(ls "$TMP/images" | wc -l | tr -d ' ') images uploaded to figma/"

        # Named images used directly in HTML (copies of specific figma assets)
        _cp() { mc cp "local/$MINIO_BUCKET/figma/$1" "local/$MINIO_BUCKET/$2" 2>/dev/null || true; }

        _cp "7325cf18b95b906643ce3ed3d54f3be066d5604b.png" "auth-hero.png"
        _cp "095e853690b6907e58edc5a29bb98cd1adfa109e.png" "hero-runway.png"
        _cp "0e679b3e0ce561c7d48b609c998379d68b3da835.png" "hero-store.png"
        _cp "0ec2ea6dca3c477e91ed21f74b360556333eec5d.png" "editorial-1.png"
        _cp "10e129fc36c77d4e0e0329b29873e13581be7b1a.png" "editorial-2.png"
        _cp "15ded9fc74ff4df44fc7d6a7c9cc79b8891dd067.png" "editorial-3.png"
        _cp "165e42f56de71750f4393c6809c470a28278821e.png" "editorial-4.png"
        _cp "194406a73a09b9f51fcac104bde6759d94be6618.png" "editorial-5.png"
    else
        echo "Warning: no images/ directory found inside Figma file."
    fi

    rm -rf "$TMP"
else
    echo "Warning: Figma file not mounted at $FIG — skipping image upload."
    echo "Mount the .fig file in docker-compose.yml to enable automatic image seeding."
fi

echo "MinIO init complete."
