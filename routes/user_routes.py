from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

user_bp = Blueprint("user_bp", __name__)

def get_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST") or "",
        user=os.getenv("DB_USER") or "",
        password=os.getenv("DB_PASSWORD") or "",
        database=os.getenv("DB_NAME") or "",
        cursorclass=pymysql.cursors.DictCursor
    )

@user_bp.route("/users/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if not username or not password or not role:
        return {"status": "error", "message": "username, password, and role are required"}, 400

    if role not in ["Admin", "Staff"]:
        return {"status": "error", "message": "role must be Admin or Staff"}, 400

    hashed_password = generate_password_hash(password)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        sql = """
        INSERT INTO users (username, password_hash, role)
        VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (username, hashed_password, role))
        conn.commit()

        user_id = cursor.lastrowid

        return {
            "message": "User registered successfully",
            "user_id": user_id
        }, 201

    except pymysql.err.IntegrityError:
        return {"status": "error", "message": "Username already exists"}, 409

    finally:
        cursor.close()
        conn.close()


@user_bp.route("/users/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {"status": "error", "message": "username and password are required"}, 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return {"status": "error", "message": "Invalid username or password"}, 401

    if not check_password_hash(user["password_hash"], password):
        return {"status": "error", "message": "Invalid username or password"}, 401

    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"]}
    )

    return {
        "message": "Login successful",
        "access_token": access_token
    }, 200