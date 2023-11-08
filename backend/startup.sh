#!/bin/bash

# Install required apt packages
apt-get update
apt-get install -y python3 python3-pip libjpeg-dev zlib1g-dev

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install required Python packages
pip install Pillow Django djangorestframework djangorestframework-simplejwt

# Run database migrations
python manage.py migrate
