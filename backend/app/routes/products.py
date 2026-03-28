from flask import Blueprint, request, jsonify
from app import db
from app.models import Product

bp = Blueprint('products', __name__, url_prefix='/api/products')

@bp.route('', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    category = request.args.get('category')
    company_id = request.args.get('company_id', type=int)

    query = Product.query

    if category:
        query = query.filter(Product.category == category)
    if company_id:
        query = query.filter(Product.company_id == company_id)

    pagination = query.order_by(Product.name).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'products': [p.to_dict() for p in pagination.items],
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    })


@bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())


@bp.route('/category/<category>', methods=['GET'])
def get_products_by_category(category):
    products = Product.query.filter(Product.category == category).all()
    return jsonify({
        'products': [p.to_dict() for p in products],
        'category': category
    })


@bp.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    return jsonify({
        'categories': [c[0] for c in categories if c[0]]
    })
