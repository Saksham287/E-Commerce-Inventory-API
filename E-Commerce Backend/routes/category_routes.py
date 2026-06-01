from flask import Blueprint, request
from utils.auth import admin_required, staff_required
from routes.user_routes import get_connection

category_bp = Blueprint("category_bp", __name__)

@category_bp.route("/categories", methods=["POST"])
@admin_required
def create_category():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if not name:
        return {"status": "error", "message": "Category name is required"}, 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO categories (name, description) VALUES (%s, %s)",
            (name, description)
        )
        conn.commit()

        return {
            "id": cursor.lastrowid,
            "name": name,
            "description": description
        }, 201

    finally:
        cursor.close()
        conn.close()


@category_bp.route("/categories", methods=["GET"])
@staff_required
def get_categories():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()

    cursor.close()
    conn.close()

    return {"data": categories}, 200