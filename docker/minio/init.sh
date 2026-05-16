#!/bin/sh
set -e

mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

mc mb --ignore-existing local/"$MINIO_BUCKET"

mc anonymous set download local/"$MINIO_BUCKET"

# Upload product images
if [ -d /frontend-images/products ]; then
    echo "Uploading product images to MinIO..."
    mc cp --recursive /frontend-images/products/ local/"$MINIO_BUCKET"/products/
    echo "Product images uploaded."
fi

# Upload hero and editorial images (root level)
echo "Uploading hero/editorial images..."
for img in /frontend-images/*.png /frontend-images/*.jpg; do
    [ -f "$img" ] && mc cp "$img" local/"$MINIO_BUCKET"/"$(basename "$img")"
done
echo "MinIO initialization complete."
