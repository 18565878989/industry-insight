from app import create_app, db
from app.seed_data import seed_semiconductor_industry

app = create_app()

@app.cli.command('seed')
def seed():
    """Seed the database with semiconductor industry data"""
    seed_semiconductor_industry()

@app.cli.command('init-db')
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_semiconductor_industry()
    app.run(debug=True, port=5000)
