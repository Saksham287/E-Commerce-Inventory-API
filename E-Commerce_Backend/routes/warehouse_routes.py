from flask import Blueprint
from utils.auth import staff_required
from routes.user_routes import get_connection

warehouse_bp = Blueprint("warehouse_bp", __name__)


@warehouse_bp.route("/warehouses", methods=["GET"])
@staff_required
def get_warehouses():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT 
                w.id,
                w.warehouse_name,
                w.category_id,
                c.name AS category_name
            FROM warehouses w
            LEFT JOIN categories c ON w.category_id = c.id
            ORDER BY w.id ASC
            """
        )

        warehouses = cursor.fetchall()

        return {
            "status": "success",
            "data": warehouses
        }, 200

    finally:
        cursor.close()
        conn.close()
        