"""
数据导入路由 - 知识图谱和本体数据导入
"""
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from ..models import db, Company, Product, Relationship, KGConfig, OntologyConfig
from datetime import datetime
import json
import csv
import os

bp = Blueprint('imports', __name__, url_prefix='/api/imports')

ALLOWED_EXTENSIONS = {'csv', 'json', 'xlsx', 'owl', 'rdf', 'ttl'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ============== 知识图谱数据导入 ==============

@bp.route('/knowledge-graph', methods=['POST'])
def import_knowledge_graph():
    """
    批量导入知识图谱数据
    支持 CSV, JSON, Excel 格式
    """
    # 检查是否有文件上传
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        filename = secure_filename(file.filename)
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        # 保存临时文件
        upload_folder = current_app.config.get('UPLOAD_FOLDER', '/tmp/uploads')
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        try:
            if file_ext == 'csv':
                imported_count = import_from_csv(filepath)
            elif file_ext == 'json':
                imported_count = import_from_json(filepath)
            else:
                return jsonify({'error': f'Unsupported file type: {file_ext}'}), 400
            
            return jsonify({
                'message': 'Import successful',
                'imported': imported_count
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # 清理临时文件
            if os.path.exists(filepath):
                os.remove(filepath)
    
    # 检查是否是 API 数据源导入
    elif request.is_json:
        data = request.get_json()
        source_type = data.get('source_type')
        
        if source_type == 'api':
            return import_from_api(data)
        else:
            return jsonify({'error': 'Invalid source_type'}), 400
    else:
        return jsonify({'error': 'No file or data provided'}), 400

def import_from_csv(filepath):
    """从 CSV 导入"""
    count = 0
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 根据 CSV 列名自动识别
            if 'name' in row or 'company_name' in row:
                company = Company(
                    name=row.get('name') or row.get('company_name'),
                    name_cn=row.get('name_cn') or row.get('chinese_name'),
                    country=row.get('country') or row.get('region'),
                    website=row.get('website'),
                    level=row.get('level') or row.get('company_type')
                )
                db.session.add(company)
                count += 1
    
    db.session.commit()
    return count

def import_from_json(filepath):
    """从 JSON 导入"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    count = 0
    if isinstance(data, list):
        for item in data:
            company = Company(
                name=item.get('name'),
                name_cn=item.get('name_cn'),
                country=item.get('country'),
                website=item.get('website'),
                level=item.get('level')
            )
            db.session.add(company)
            count += 1
    elif isinstance(data, dict) and 'companies' in data:
        for item in data['companies']:
            company = Company(
                name=item.get('name'),
                name_cn=item.get('name_cn'),
                country=item.get('country'),
                website=item.get('website'),
                level=item.get('level')
            )
            db.session.add(company)
            count += 1
    
    db.session.commit()
    return count

def import_from_api(data):
    """从 API 数据源导入"""
    # 获取配置
    config_id = data.get('config_id')
    if config_id:
        config = KGConfig.query.get(config_id)
        if not config:
            return jsonify({'error': 'Config not found'}), 404
    
    # TODO: 实现从外部 API 获取数据的逻辑
    # 这需要根据具体的 API 接口实现
    return jsonify({
        'message': 'API import is not yet implemented',
        'config_id': config_id
    }), 501

@bp.route('/knowledge-graph/sync/<int:config_id>', methods=['POST'])
def sync_knowledge_graph(config_id):
    """
    同步知识图谱数据（根据配置）
    """
    config = KGConfig.query.get_or_404(config_id)
    
    # 更新配置状态
    config.last_sync = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': 'Sync initiated',
        'config_id': config_id,
        'last_sync': config.last_sync.isoformat()
    }), 200

# ============== 本体数据导入 ==============

@bp.route('/ontology', methods=['POST'])
def import_ontology():
    """
    导入本体数据
    支持 OWL, RDF, TTL, JSON 格式
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    filename = secure_filename(file.filename)
    file_ext = filename.rsplit('.', 1)[1].lower()
    
    # 保存文件
    upload_folder = current_app.config.get('UPLOAD_FOLDER', '/tmp/uploads')
    ontology_folder = os.path.join(upload_folder, 'ontology')
    os.makedirs(ontology_folder, exist_ok=True)
    filepath = os.path.join(ontology_folder, filename)
    file.save(filepath)
    
    try:
        # 创建配置记录
        config_data = request.form.to_dict() or {}
        config = OntologyConfig(
            name=config_data.get('name', filename),
            file_path=filepath,
            file_type=file_ext,
            ontology_uri=config_data.get('ontology_uri'),
            version=config_data.get('version'),
            description=config_data.get('description'),
            is_active=False
        )
        db.session.add(config)
        db.session.commit()
        
        # 解析本体数据
        concepts_count = parse_ontology_file(filepath, file_ext)
        
        return jsonify({
            'message': 'Ontology imported successfully',
            'config_id': config.id,
            'concepts_parsed': concepts_count
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def parse_ontology_file(filepath, file_type):
    """
    解析本体文件
    返回解析的概念数量
    """
    # 对于 JSON 格式的本体，直接解析
    if file_type == 'json':
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 假设 JSON 格式: {"concepts": [...], "relations": [...]}
        concepts = data.get('concepts', [])
        
        # TODO: 将概念存储到数据库
        # 这里只是一个占位实现
        
        return len(concepts)
    
    # 对于 OWL/RDF/TTL 格式，需要更复杂的解析器
    # 这里暂时返回占位值
    return 0

# ============== 导入状态查询 ==============

@bp.route('/status', methods=['GET'])
def get_import_status():
    """获取导入状态"""
    # 返回最近的导入记录
    return jsonify({
        'message': 'Import status endpoint',
        'todo': 'Implement import history tracking'
    }), 200
