from flask import Flask, make_response, request
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import MetaData
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/dist',
    template_folder='../client/dist'
)
app.secret_key = b' \xee5#\x02\x9d\xe1{\x8fIDMy/F\xa3'

# Database configuration: Use SQLite for local development, PostgreSQL for production
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

# Check if we're in a production environment (Railway sets DATABASE_URL)
# If DATABASE_URL is set and contains a valid PostgreSQL connection, use it
# Otherwise, fall back to SQLite for local development
if DATABASE_URL and DATABASE_URL.startswith(("postgres://", "postgresql://")):
    # Production: PostgreSQL (Railway or other PostgreSQL provider)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    # Local development: Use SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dev.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

CORS(app)

migrate= Migrate(app,db)

db.init_app(app)

api=Api(app)

bcrypt= Bcrypt(app)