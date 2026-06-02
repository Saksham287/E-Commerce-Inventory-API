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
            (name, description),
        )
        conn.commit()

        return {
            "id": cursor.lastrowid,
            "name": name,
            "description": description,
        }, 201

    finally:
        cursor.close()
        conn.close()


@category_bp.route("/categories", methods=["GET"])
@staff_required
def get_categories():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM categories")
        categories = cursor.fetchall()

        return {"data": categories}, 200

    finally:
        cursor.close()
        conn.close()


@category_bp.route("/categories/<int:id>", methods=["PUT"])
@admin_required
def update_category(id):
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if not name:
        return {"status": "error", "message": "Category name is required"}, 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            UPDATE categories
            SET name = %s,
                description = %s
            WHERE id = %s
            """,
            (name, description, id),
        )

        conn.commit()

        if cursor.rowcount == 0:
            return {"status": "error", "message": "Category not found"}, 404

        return {
            "status": "success",
            "message": "Category updated successfully",
        }, 200

    finally:
        cursor.close()
        conn.close()


@category_bp.route("/categories/<int:id>", methods=["DELETE"])
@admin_required
def delete_category(id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "DELETE FROM categories WHERE id = %s",
            (id,),
        )

        conn.commit()

        if cursor.rowcount == 0:
            return {"status": "error", "message": "Category not found"}, 404

        return {
            "status": "success",
            "message": "Category deleted successfully",
        }, 200

    finally:
        cursor.close()
        conn.close()