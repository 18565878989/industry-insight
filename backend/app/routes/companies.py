from flask import Blueprint, request, jsonify
from app import db
from app.models import Company, Product, Relationship

bp = Blueprint('companies', __name__, url_prefix='/api/companies')

@bp.route('', methods=['GET'])
def get_companies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    sector = request.args.get('sector')
    supply_chain_stage = request.args.get('supply_chain_stage')
    search = request.args.get('search')

    query = Company.query

    if sector:
        query = query.filter(Company.sector == sector)
    if supply_chain_stage:
        query = query.filter(Company.supply_chain_stage == supply_chain_stage)
    if search:
        query = query.filter(Company.name.ilike(f'%{search}%'))

    pagination = query.order_by(Company.name).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'companies': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    })


@bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    return jsonify(company.to_dict())


@bp.route('/<int:company_id>/products', methods=['GET'])
def get_company_products(company_id):
    company = Company.query.get_or_404(company_id)
    products = company.products.all()
    return jsonify({
        'products': [p.to_dict() for p in products]
    })


@bp.route('/<int:company_id>/relationships', methods=['GET'])
def get_company_relationships(company_id):
    company = Company.query.get_or_404(company_id)
    rel_type = request.args.get('type')

    relationships = Relationship.query.filter(
        (Relationship.source_id == company_id) | (Relationship.target_id == company_id)
    )

    if rel_type:
        relationships = relationships.filter(Relationship.relationship_type == rel_type)

    return jsonify({
        'relationships': [r.to_dict() for r in relationships.all()]
    })


@bp.route('/<int:company_id>/competitors', methods=['GET'])
def get_company_competitors(company_id):
    company = Company.query.get_or_404(company_id)

    # Find companies in the same sub_sector that compete
    competitors = Company.query.filter(
        Company.sub_sector == company.sub_sector,
        Company.id != company_id
    ).all()

    # Also find companies with COMPETES relationship
    competing_relationships = Relationship.query.filter(
        ((Relationship.source_id == company_id) | (Relationship.target_id == company_id)),
        Relationship.relationship_type == 'COMPETES'
    ).all()

    competitor_ids = {c.id for c in competitors}
    for rel in competing_relationships:
        if rel.source_id == company_id:
            competitor_ids.add(rel.target_id)
        else:
            competitor_ids.add(rel.source_id)

    all_competitors = Company.query.filter(Company.id.in_(competitor_ids)).all() if competitor_ids else []

    return jsonify({
        'competitors': [c.to_dict() for c in all_competitors]
    })


@bp.route('/sectors', methods=['GET'])
def get_sectors():
    sectors = db.session.query(Company.sector).distinct().all()
    return jsonify({
        'sectors': [s[0] for s in sectors if s[0]]
    })


@bp.route('/supply-chain-stages', methods=['GET'])
def get_supply_chain_stages():
    stages = db.session.query(Company.supply_chain_stage).distinct().all()
    return jsonify({
        'stages': [s[0] for s in stages if s[0]]
    })
