from datetime import datetime
from app import db

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    sector = db.Column(db.String(100))
    sub_sector = db.Column(db.String(100))
    headquarters = db.Column(db.String(255))
    founded_year = db.Column(db.Integer)
    revenue = db.Column(db.Float)
    employees = db.Column(db.Integer)
    market_cap = db.Column(db.Float)
    description = db.Column(db.Text)
    supply_chain_stage = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    products = db.relationship('Product', backref='company', lazy='dynamic')
    relationships = db.relationship('Relationship', foreign_keys='Relationship.source_id', backref='source_company', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sector': self.sector,
            'sub_sector': self.sub_sector,
            'headquarters': self.headquarters,
            'founded_year': self.founded_year,
            'revenue': self.revenue,
            'employees': self.employees,
            'market_cap': self.market_cap,
            'description': self.description,
            'supply_chain_stage': self.supply_chain_stage,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100))
    sub_category = db.Column(db.String(100))
    description = db.Column(db.Text)
    technology_node = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'name': self.name,
            'category': self.category,
            'sub_category': self.sub_category,
            'description': self.description,
            'technology_node': self.technology_node,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Relationship(db.Model):
    __tablename__ = 'relationships'

    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    relationship_type = db.Column(db.String(50), nullable=False)
    strength = db.Column(db.Integer)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    target_company = db.relationship('Company', foreign_keys=[target_id])

    def to_dict(self):
        return {
            'id': self.id,
            'source_id': self.source_id,
            'target_id': self.target_id,
            'relationship_type': self.relationship_type,
            'strength': self.strength,
            'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'source_name': self.source_company.name if self.source_company else None,
            'target_name': self.target_company.name if self.target_company else None,
        }
