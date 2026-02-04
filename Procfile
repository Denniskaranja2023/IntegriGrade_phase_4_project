release: cd server && python -m flask db upgrade
web: gunicorn server.config:app --bind 0.0.0.0:8080


