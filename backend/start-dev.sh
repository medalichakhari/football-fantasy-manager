#!/bin/sh


echo "🗄️  Applying database migrations..."


if npx prisma migrate deploy; then
  echo "Migrations applied successfully!"
else
  echo "Migration failed"
  if npx prisma db push; then
    echo "Database schema pushed successfully!"
  else
    echo "Failed to initialize database schema"
    exit 1
  fi
fi

echo "Starting development server..."
npm run dev
