from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import pymysql
import os

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


def admin_required(func):
    from functools import wraps

    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        role = claims.get("role")

        if role != "Admin":
            return {
                "status": "error",
                "message": "Admin access required"
            }, 403

        return func(*args, **kwargs)

    return wrapper


@user_bp.route("/users/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "Staff")

    if not username or not password:
        return {
            "status": "error",
            "message": "Username and password are required"
        }, 400

    if role not in ["Admin", "Staff"]:
        return {
            "status": "error",
            "message": "Role must be Admin or Staff"
        }, 400

    hashed_password = generate_password_hash(password)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (username, password_hash, role)
            VALUES (%s, %s, %s)
            """,
            (username, hashed_password, role)
        )

        conn.commit()

        return {
            "status": "success",
            "message": "User registered successfully"
        }, 201

    except pymysql.err.IntegrityError:
        return {
            "status": "error",
            "message": "Username already exists"
        }, 409

    finally:
        cursor.close()
        conn.close()


@user_bp.route("/users/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {
            "status": "error",
            "message": "Username and password are required"
        }, 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username = %s",
        (username,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return {
            "status": "error",
            "message": "Invalid username or password"
        }, 401

    if not check_password_hash(user["password_hash"], password):
        return {
            "status": "error",
            "message": "Invalid username or password"
        }, 401

    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={
            "username": user["username"],
            "role": user["role"]
        }
    )

    return {
        "status": "success",
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "role": user["role"]
        }
    }, 200


@user_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, username, role
        FROM users
        ORDER BY id ASC
        """
    )

    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": users
    }, 200


@user_bp.route("/users/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):
    data = request.get_json()

    username = data.get("username")
    role = data.get("role")

    if not username or not role:
        return {
            "status": "error",
            "message": "Username and role are required"
        }, 400

    if role not in ["Admin", "Staff"]:
        return {
            "status": "error",
            "message": "Role must be Admin or Staff"
        }, 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE users
        SET username = %s, role = %s
        WHERE id = %s
        """,
        (username, role, user_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "message": "User updated successfully"
    }, 200


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM users WHERE id = %s",
        (user_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "message": "User deleted successfully"
    }, 200