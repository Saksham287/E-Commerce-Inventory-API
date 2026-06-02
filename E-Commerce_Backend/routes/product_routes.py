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
        return {"status": "error", "message": "All fields are required"}, 400

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
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    category_id = request.args.get("category_id")
    search = request.args.get("search")

    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT * FROM products
        WHERE is_active = TRUE
    """

    values = []

    if min_price:
        query += " AND price >= %s"
        values.append(min_price)

    if max_price:
        query += " AND price <= %s"
        values.append(max_price)

    if category_id:
        query += " AND category_id = %s"
        values.append(category_id)

    if search:
        query += " AND name LIKE %s"
        values.append(f"%{search}%")

    count_query = query.replace("SELECT *", "SELECT COUNT(*) as total")

    cursor.execute(count_query, tuple(values))
    total_records = cursor.fetchone()["total"]

    query += " LIMIT %s OFFSET %s"
    values.extend([limit, offset])

    cursor.execute(query, tuple(values))
    products = cursor.fetchall()

    cursor.close()
    conn.close()

    total_pages = (total_records + limit - 1) // limit

    return {
        "data": products,
        "pagination": {
            "total_records": total_records,
            "current_page": page,
            "total_pages": total_pages,
            "limit": limit
        }
    }, 200


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

    return {"message": "Product updated successfully"}, 200


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

    return {"message": "Product soft deleted successfully"}, 200


@product_bp.route("/products/<int:product_id>/order", methods=["POST"])
@staff_required
def order_product(product_id):
    data = request.get_json()
    quantity = data.get("quantity")

    if not quantity or quantity <= 0:
        return {"status": "error", "message": "Quantity must be greater than 0"}, 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT * FROM products WHERE id = %s AND is_active = TRUE",
            (product_id,)
        )
        product = cursor.fetchone()

        if not product:
            return {"status": "error", "message": "Product not found"}, 404

        if quantity > product["stock_quantity"]:
            return {
                "status": "error",
                "message": f"Insufficient stock. Only {product['stock_quantity']} item(s) remaining."
            }, 400

        new_stock = product["stock_quantity"] - quantity

        cursor.execute(
            "UPDATE products SET stock_quantity = %s WHERE id = %s",
            (new_stock, product_id)
        )

        conn.commit()

        return {
            "message": "Order processed successfully",
            "product_id": product_id,
            "quantity_ordered": quantity,
            "remaining_stock": new_stock
        }, 200

    finally:
        cursor.close()
        conn.close()


@product_bp.route("/products/<int:product_id>/restock", methods=["POST"])
@admin_required
def restock_product(product_id):
    data = request.get_json()
    quantity = data.get("quantity")

    if not quantity or quantity <= 0:
        return {"status": "error", "message": "Quantity must be greater than 0"}, 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT * FROM products WHERE id = %s AND is_active = TRUE",
            (product_id,)
        )
        product = cursor.fetchone()

        if not product:
            return {"status": "error", "message": "Product not found"}, 404

        new_stock = product["stock_quantity"] + quantity

        cursor.execute(
            "UPDATE products SET stock_quantity = %s WHERE id = %s",
            (new_stock, product_id)
        )

        conn.commit()

        return {
            "message": "Product restocked successfully",
            "product_id": product_id,
            "quantity_added": quantity,
            "current_stock": new_stock
        }, 200

    finally:
        cursor.close()
        conn.close()