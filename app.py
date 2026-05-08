from flask import Flask
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os

from routes.user_routes import user_bp
from routes.category_routes import category_bp
from routes.product_routes import product_bp

load_dotenv()

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

app.register_blueprint(user_bp)
app.register_blueprint(category_bp)
app.register_blueprint(product_bp)

@app.route("/")
def home():
    return {"message": "E-Commerce Inventory API is running"}

if __name__ == "__main__":
    app.run(debug=True)