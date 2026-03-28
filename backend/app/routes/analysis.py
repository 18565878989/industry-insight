from flask import Blueprint, jsonify
from app import db
from app.models import Company, Product, Relationship

bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')

@bp.route('/supply-chain', methods=['GET'])
def get_supply_chain_overview():
    """Get supply chain overview with stage distribution"""
    stages = ['EDA Tools', 'Design', 'Manufacturing', 'Equipment', 'Materials', 'Packaging/Testing', 'End Products']

    stage_data = []
    for stage in stages:
        companies = Company.query.filter(Company.supply_chain_stage == stage).all()
        total_revenue = sum(c.revenue or 0 for c in companies)
        total_employees = sum(c.employees or 0 for c in companies)

        stage_data.append({
            'stage': stage,
            'company_count': len(companies),
            'total_revenue': total_revenue,
            'total_employees': total_employees,
            'companies': [c.to_dict() for c in companies]
        })

    return jsonify({
        'supply_chain': stage_data
    })


@bp.route('/market-share', methods=['GET'])
def get_market_share():
    """Get market share by supply chain stage"""
    stages = db.session.query(Company.supply_chain_stage).distinct().all()

    market_share = []
    for stage_tuple in stages:
        stage = stage_tuple[0]
        if not stage:
            continue

        companies = Company.query.filter(Company.supply_chain_stage == stage).all()
        total_revenue = sum(c.revenue or 0 for c in companies)
        total_market_cap = sum(c.market_cap or 0 for c in companies)

        market_share.append({
            'stage': stage,
            'total_revenue': total_revenue,
            'total_market_cap': total_market_cap,
            'company_count': len(companies)
        })

    return jsonify({
        'market_share': market_share
    })


@bp.route('/trends', methods=['GET'])
def get_trends():
    """Get trend analysis data"""
    # Revenue by sector
    sectors = db.session.query(Company.sector).distinct().all()

    sector_revenue = []
    for sector_tuple in sectors:
        sector = sector_tuple[0]
        if not sector:
            continue

        companies = Company.query.filter(Company.sector == sector).all()
        total_revenue = sum(c.revenue or 0 for c in companies)
        avg_revenue = total_revenue / len(companies) if companies else 0

        sector_revenue.append({
            'sector': sector,
            'total_revenue': total_revenue,
            'avg_revenue': avg_revenue,
            'company_count': len(companies)
        })

    # Relationship type distribution
    rel_types = db.session.query(Relationship.relationship_type, db.func.count(Relationship.id)).group_by(Relationship.relationship_type).all()

    relationship_distribution = [
        {'type': rt[0], 'count': rt[1]} for rt in rel_types
    ]

    return jsonify({
        'revenue_by_sector': sector_revenue,
        'relationship_distribution': relationship_distribution
    })


@bp.route('/summary', methods=['GET'])
def get_summary():
    """Get overall industry summary"""
    total_companies = Company.query.count()
    total_products = Product.query.count()
    total_relationships = Relationship.query.count()

    total_revenue = sum(c.revenue or 0 for c in Company.query.all())
    total_employees = sum(c.employees or 0 for c in Company.query.all())

    return jsonify({
        'summary': {
            'total_companies': total_companies,
            'total_products': total_products,
            'total_relationships': total_relationships,
            'total_revenue': total_revenue,
            'total_employees': total_employees
        }
    })
