#!/bin/bash

cd /home/blank/web/osuTime

echo "Pulling from Master"

git pull origin master

echo "Pulled successfully from master"

echo "Installing dependencies..."

npm run install-all

echo "Restarting server..."

npm run build

echo "Server restarted Successfully"
