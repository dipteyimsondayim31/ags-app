#!/bin/sh
set -e

# Run Prisma db push to sync schema with Postgres
echo "Running Prisma db push..."
npx prisma db push

# Seed the database with initial categories, cards, and admin user
echo "Running Prisma db seed..."
npx prisma db seed

# Start Next.js server
echo "Starting Next.js server..."
exec npm run start
