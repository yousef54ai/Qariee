#!/bin/bash

# Quick upload script for R2
# Usage: ./upload.sh

BUCKET_NAME="qariee"

echo "📦 Uploading to R2 bucket: $BUCKET_NAME"

# Upload metadata
echo "⬆️  Uploading metadata..."
wrangler r2 object put $BUCKET_NAME/metadata/reciters.json --file=./metadata/reciters.json

# Upload images (if exist)
if [ -f "./images/reciters/mishary-alafasy.jpg" ]; then
    echo "⬆️  Uploading reciter images..."
    wrangler r2 object put $BUCKET_NAME/images/reciters/mishary-alafasy.jpg --file=./images/reciters/mishary-alafasy.jpg
    wrangler r2 object put $BUCKET_NAME/images/reciters/abdul-basit.jpg --file=./images/reciters/abdul-basit.jpg
    wrangler r2 object put $BUCKET_NAME/images/reciters/sudais.jpg --file=./images/reciters/sudais.jpg
fi

echo "✅ Upload complete!"
echo "🌐 Test URL: https://pub-ab70d7236e61414aabfd72718fa65d27.r2.dev/metadata/reciters.json"
