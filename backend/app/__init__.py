from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')

    db.init_app(app)
    CORS(app)

    # 注册蓝图
    from app.routes import companies, products, relationships, analysis, configs, imports, llm
    app.register_blueprint(companies.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(relationships.bp)
    app.register_blueprint(analysis.bp)
    app.register_blueprint(configs.bp)
    app.register_blueprint(imports.bp)
    app.register_blueprint(llm.bp)

    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'service': 'industry-insight-api'}

    return app
