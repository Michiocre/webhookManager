#!/bin/bash

cd /home/blank/spoti-vote

echo "Pulling from Master"

git pull origin master

echo "Pulled successfully from master"

echo "Installing dependencies..."

npm install

echo "Restarting server..."

npm run deploy-backend

echo "Server restarted Successfully"
