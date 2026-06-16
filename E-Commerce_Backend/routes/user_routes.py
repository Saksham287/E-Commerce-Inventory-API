from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from utils.auth import admin_required, staff_required
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
        cursorclass=pymysql.cursors.DictCursor,
    )


def has_status_column():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SHOW COLUMNS FROM users LIKE 'status'")
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        conn.close()


@user_bp.route("/users/register", methods=["POST"])
@admin_required
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "Staff")
    warehouse_id = data.get("warehouse_id")

    if not username or not password:
        return {"status": "error", "message": "Username and password are required"}, 400

    if role not in ["Admin", "Staff"]:
        return {"status": "error", "message": "Role must be Admin or Staff"}, 400

    if role == "Admin":
        warehouse_id = None

    if role == "Staff" and not warehouse_id:
        return {"status": "error", "message": "Staff must be assigned to a warehouse"}, 400

    hashed_password = generate_password_hash(password)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        if has_status_column():
            cursor.execute(
                """
                INSERT INTO users (username, password_hash, role, status, warehouse_id)
                VALUES (%s, %s, %s, 'Active', %s)
                """,
                (username, hashed_password, role, warehouse_id),
            )
        else:
            cursor.execute(
                """
                INSERT INTO users (username, password_hash, role, warehouse_id)
                VALUES (%s, %s, %s, %s)
                """,
                (username, hashed_password, role, warehouse_id),
            )

        conn.commit()

        return {
            "status": "success",
            "message": "User registered successfully",
        }, 201

    except pymysql.err.IntegrityError:
        return {
            "status": "error",
            "message": "Username already exists or invalid warehouse",
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
        return {"status": "error", "message": "Username and password are required"}, 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                u.*,
                w.warehouse_name
            FROM users u
            LEFT JOIN warehouses w ON u.warehouse_id = w.id
            WHERE u.username = %s
            """,
            (username,),
        )

        user = cursor.fetchone()

    finally:
        cursor.close()
        conn.close()

    if not user:
        return {"status": "error", "message": "Invalid username or password"}, 401

    if "status" in user and user["status"] == "Inactive":
        return {"status": "error", "message": "This account has been deactivated"}, 403

    if not check_password_hash(user["password_hash"], password):
        return {"status": "error", "message": "Invalid username or password"}, 401

    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={
            "username": user["username"],
            "role": user["role"],
            "warehouse_id": user["warehouse_id"],
            "warehouse_name": user["warehouse_name"],
        },
    )

    return {
        "status": "success",
        "message": "Login successful",
        "token": access_token,
        "access_token": access_token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "role": user["role"],
            "status": user["status"] if "status" in user else "Active",
            "warehouse_id": user["warehouse_id"],
            "warehouse_name": user["warehouse_name"],
        },
    }, 200


@user_bp.route("/users", methods=["GET"])
@staff_required
def get_users():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        if has_status_column():
            cursor.execute(
                """
                SELECT 
                    u.id,
                    u.username,
                    u.role,
                    u.status,
                    u.warehouse_id,
                    w.warehouse_name
                FROM users u
                LEFT JOIN warehouses w ON u.warehouse_id = w.id
                ORDER BY u.id ASC
                """
            )
        else:
            cursor.execute(
                """
                SELECT 
                    u.id,
                    u.username,
                    u.role,
                    u.warehouse_id,
                    w.warehouse_name
                FROM users u
                LEFT JOIN warehouses w ON u.warehouse_id = w.id
                ORDER BY u.id ASC
                """
            )

        users = cursor.fetchall()

        for user in users:
            if "status" not in user:
                user["status"] = "Active"

        return {"status": "success", "data": users}, 200

    finally:
        cursor.close()
        conn.close()


@user_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    data = request.get_json()

    claims = get_jwt()
    current_role = claims.get("role")
    current_user_id = int(get_jwt_identity())

    if current_role != "Admin" and current_user_id != user_id:
        return {
            "status": "error",
            "message": "You can only edit your own profile",
        }, 403

    username = data.get("username")
    role = data.get("role")
    password = data.get("password")
    warehouse_id = data.get("warehouse_id")

    if not username:
        return {"status": "error", "message": "Username is required"}, 400

    if current_role == "Admin":
        if not role:
            return {"status": "error", "message": "Role is required"}, 400

        if role not in ["Admin", "Staff"]:
            return {"status": "error", "message": "Role must be Admin or Staff"}, 400

        if role == "Admin":
            warehouse_id = None

        if role == "Staff" and not warehouse_id:
            return {"status": "error", "message": "Staff must be assigned to a warehouse"}, 400

    else:
        temp_conn = get_connection()
        temp_cursor = temp_conn.cursor()

        try:
            temp_cursor.execute(
                """
                SELECT role, warehouse_id
                FROM users
                WHERE id = %s
                """,
                (user_id,),
            )

            existing_user = temp_cursor.fetchone()

            if not existing_user:
                return {"status": "error", "message": "User not found"}, 404

            role = existing_user["role"]
            warehouse_id = existing_user["warehouse_id"]

        finally:
            temp_cursor.close()
            temp_conn.close()

    conn = get_connection()
    cursor = conn.cursor()

    try:
        if password:
            password_hash = generate_password_hash(password)

            cursor.execute(
                """
                UPDATE users
                SET username = %s,
                    role = %s,
                    password_hash = %s,
                    warehouse_id = %s
                WHERE id = %s
                """,
                (username, role, password_hash, warehouse_id, user_id),
            )
        else:
            cursor.execute(
                """
                UPDATE users
                SET username = %s,
                    role = %s,
                    warehouse_id = %s
                WHERE id = %s
                """,
                (username, role, warehouse_id, user_id),
            )

        conn.commit()

        cursor.execute(
            "SELECT id FROM users WHERE id = %s",
            (user_id,),
        )

        existing_user = cursor.fetchone()

        if not existing_user:
            return {"status": "error", "message": "User not found"}, 404

        return {
            "status": "success",
            "message": "User updated successfully",
        }, 200

    except pymysql.err.IntegrityError:
        return {"status": "error", "message": "Invalid warehouse selected"}, 409

    finally:
        cursor.close()
        conn.close()


@user_bp.route("/users/<int:user_id>/status", methods=["PUT"])
@admin_required
def update_user_status(user_id):
    data = request.get_json()

    status = data.get("status")

    if status not in ["Active", "Inactive"]:
        return {"status": "error", "message": "Status must be Active or Inactive"}, 400

    if not has_status_column():
        return {
            "status": "error",
            "message": "Database is missing status column. Add status column to users table first.",
        }, 500

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            UPDATE users
            SET status = %s
            WHERE id = %s
            """,
            (status, user_id),
        )

        conn.commit()

        return {
            "status": "success",
            "message": f"User marked as {status}",
        }, 200

    finally:
        cursor.close()
        conn.close()


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "DELETE FROM users WHERE id = %s",
            (user_id,),
        )

        conn.commit()

        return {"status": "success", "message": "User deleted successfully"}, 200

    finally:
        cursor.close()
        conn.close()