from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    CORS(app)

    from app.routes import companies, products, relationships, analysis
    app.register_blueprint(companies.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(relationships.bp)
    app.register_blueprint(analysis.bp)

    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'service': 'industry-insight-api'}

    return app
