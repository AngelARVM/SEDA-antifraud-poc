#!/bin/sh
set -e

echo "Running npm install..."
npm install

if [ -z "$SERVICE_NAME" ]; then
  echo "SERVICE_NAME is not set"
  exit 1
fi

echo "Starting Nest service: $SERVICE_NAME"
npm run start:dev:${SERVICE_NAME}