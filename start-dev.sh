#!/bin/bash
# Start Expo with error logging

mkdir -p expo-errors
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="expo-errors/expo-error-${TIMESTAMP}.txt"

echo "Starting Expo... Logging to $LOG_FILE"
npx expo start --tunnel 2>&1 | tee "$LOG_FILE"
