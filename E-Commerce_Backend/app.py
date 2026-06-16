from flask import Flask
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from routes.user_routes import user_bp
from routes.category_routes import category_bp
from routes.product_routes import product_bp
from routes.warehouse_routes import warehouse_bp

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(category_bp)
app.register_blueprint(product_bp)
app.register_blueprint(warehouse_bp)


@app.route("/")
def home():
    return {
        "message": "E-Commerce Inventory API is running"
    }


@app.errorhandler(400)
def bad_request(error):
    return {
        "status": "error",
        "message": "Bad request"
    }, 400


@app.errorhandler(401)
def unauthorized(error):
    return {
        "status": "error",
        "message": "Unauthorized"
    }, 401


@app.errorhandler(403)
def forbidden(error):
    return {
        "status": "error",
        "message": "Forbidden"
    }, 403


@app.errorhandler(404)
def not_found(error):
    return {
        "status": "error",
        "message": "Route not found"
    }, 404


@app.errorhandler(500)
def internal_error(error):
    return {
        "status": "error",
        "message": "Internal server error"
    }, 500


if __name__ == "__main__":
    app.run(debug=True)