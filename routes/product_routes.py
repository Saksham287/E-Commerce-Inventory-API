from flask import Blueprint, request
from utils.auth import admin_required, staff_required
from routes.user_routes import get_connection

product_bp = Blueprint("product_bp", __name__)

@product_bp.route("/products", methods=["POST"])
@admin_required
def create_product():

    data = request.get_json()

    name = data.get("name")
    sku = data.get("sku")
    price = data.get("price")
    stock_quantity = data.get("stock_quantity")
    category_id = data.get("category_id")

    if not all([name, sku, price, stock_quantity, category_id]):
        return {
            "status": "error",
            "message": "All fields are required"
        }, 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO products
            (name, sku, price, stock_quantity, category_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, sku, price, stock_quantity, category_id))

        conn.commit()

        return {
            "message": "Product created successfully",
            "product_id": cursor.lastrowid
        }, 201

    finally:
        cursor.close()
        conn.close()

@product_bp.route("/products", methods=["GET"])
@staff_required
def get_products():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM products
        WHERE is_active = TRUE
    """)

    products = cursor.fetchall()

    cursor.close()
    conn.close()

    return {"data": products}, 200

@product_bp.route("/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):

    data = request.get_json()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE products
        SET name=%s,
            sku=%s,
            price=%s,
            stock_quantity=%s,
            category_id=%s
        WHERE id=%s
    """, (
        data.get("name"),
        data.get("sku"),
        data.get("price"),
        data.get("stock_quantity"),
        data.get("category_id"),
        product_id
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Product updated successfully"
    }, 200

@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE products
        SET is_active = FALSE
        WHERE id = %s
    """, (product_id,))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Product soft deleted successfully"
    }, 200