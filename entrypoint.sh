#!/bin/bash

cd backend

echo "Run collectstatic"
python manage.py collectstatic --no-input
echo "Run makemigrations"
python manage.py makemigrations
echo "Run migrate"
python manage.py migrate

gunicorn -c config/gunicorn/conf.py --bind :8000 backend.wsgi:application
