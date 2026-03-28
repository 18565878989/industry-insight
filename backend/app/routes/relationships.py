from flask import Blueprint, jsonify
from app import db
from app.models import Relationship, Company

bp = Blueprint('relationships', __name__, url_prefix='/api/relationships')

@bp.route('', methods=['GET'])
def get_relationships():
    rel_type = bp.args.get('type') if hasattr(bp, 'args') else None

    query = Relationship.query

    if rel_type:
        query = query.filter(Relationship.relationship_type == rel_type)

    relationships = query.all()
    return jsonify({
        'relationships': [r.to_dict() for r in relationships]
    })


@bp.route('/types', methods=['GET'])
def get_relationship_types():
    types = db.session.query(Relationship.relationship_type).distinct().all()
    return jsonify({
        'types': [t[0] for t in types if t[0]]
    })


@bp.route('/graph', methods=['GET'])
def get_graph_data():
    """Get all data needed for knowledge graph visualization"""
    companies = Company.query.all()
    relationships = Relationship.query.all()

    nodes = []
    for c in companies:
        nodes.append({
            'id': c.id,
            'name': c.name,
            'sector': c.sector,
            'sub_sector': c.sub_sector,
            'supply_chain_stage': c.supply_chain_stage,
            'revenue': c.revenue,
            'employees': c.employees,
            'type': 'company'
        })

    edges = []
    for r in relationships:
        edges.append({
            'id': r.id,
            'source': r.source_id,
            'target': r.target_id,
            'relationship_type': r.relationship_type,
            'strength': r.strength,
            'description': r.description
        })

    return jsonify({
        'nodes': nodes,
        'edges': edges
    })
