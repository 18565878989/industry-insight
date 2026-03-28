"""
配置管理路由 - 系统配置模块
"""
from flask import Blueprint, request, jsonify
from ..models import db, ModelConfig, KGConfig, OntologyConfig
import json

bp = Blueprint('configs', __name__, url_prefix='/api/configs')

# ============== 模型配置 API ==============

@bp.route('/models', methods=['GET'])
def get_model_configs():
    """获取所有模型配置"""
    configs = ModelConfig.query.all()
    return jsonify([c.to_dict() for c in configs])

@bp.route('/models/<int:id>', methods=['GET'])
def get_model_config(id):
    """获取单个模型配置"""
    config = ModelConfig.query.get_or_404(id)
    return jsonify(config.to_dict())

@bp.route('/models', methods=['POST'])
def create_model_config():
    """创建模型配置"""
    data = request.get_json()
    config = ModelConfig(
        name=data['name'],
        provider=data['provider'],
        api_key=data.get('api_key'),
        endpoint=data.get('endpoint'),
        model_name=data['model_name'],
        temperature=data.get('temperature', 0.7),
        max_tokens=data.get('max_tokens', 4000),
        is_active=data.get('is_active', False)
    )
    db.session.add(config)
    db.session.commit()
    return jsonify(config.to_dict()), 201

@bp.route('/models/<int:id>', methods=['PUT'])
def update_model_config(id):
    """更新模型配置"""
    config = ModelConfig.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        config.name = data['name']
    if 'provider' in data:
        config.provider = data['provider']
    if 'api_key' in data:
        config.api_key = data['api_key']
    if 'endpoint' in data:
        config.endpoint = data['endpoint']
    if 'model_name' in data:
        config.model_name = data['model_name']
    if 'temperature' in data:
        config.temperature = data['temperature']
    if 'max_tokens' in data:
        config.max_tokens = data['max_tokens']
    if 'is_active' in data:
        config.is_active = data['is_active']
    
    db.session.commit()
    return jsonify(config.to_dict())

@bp.route('/models/<int:id>', methods=['DELETE'])
def delete_model_config(id):
    """删除模型配置"""
    config = ModelConfig.query.get_or_404(id)
    db.session.delete(config)
    db.session.commit()
    return jsonify({'message': 'Deleted successfully'}), 200

# ============== 知识图谱配置 API ==============

@bp.route('/kg', methods=['GET'])
def get_kg_configs():
    """获取所有知识图谱配置"""
    configs = KGConfig.query.all()
    return jsonify([c.to_dict() for c in configs])

@bp.route('/kg/<int:id>', methods=['GET'])
def get_kg_config(id):
    """获取单个知识图谱配置"""
    config = KGConfig.query.get_or_404(id)
    return jsonify(config.to_dict())

@bp.route('/kg', methods=['POST'])
def create_kg_config():
    """创建知识图谱配置"""
    data = request.get_json()
    config = KGConfig(
        name=data['name'],
        data_source=data.get('data_source'),
        source_type=data.get('source_type', 'api'),
        refresh_interval=data.get('refresh_interval', 3600),
        batch_size=data.get('batch_size', 100),
        mapping_rules=json.dumps(data.get('mapping_rules', {})) if data.get('mapping_rules') else None,
        is_active=data.get('is_active', False)
    )
    db.session.add(config)
    db.session.commit()
    return jsonify(config.to_dict()), 201

@bp.route('/kg/<int:id>', methods=['PUT'])
def update_kg_config(id):
    """更新知识图谱配置"""
    config = KGConfig.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        config.name = data['name']
    if 'data_source' in data:
        config.data_source = data['data_source']
    if 'source_type' in data:
        config.source_type = data['source_type']
    if 'refresh_interval' in data:
        config.refresh_interval = data['refresh_interval']
    if 'batch_size' in data:
        config.batch_size = data['batch_size']
    if 'mapping_rules' in data:
        config.mapping_rules = json.dumps(data['mapping_rules'])
    if 'is_active' in data:
        config.is_active = data['is_active']
    
    db.session.commit()
    return jsonify(config.to_dict())

@bp.route('/kg/<int:id>', methods=['DELETE'])
def delete_kg_config(id):
    """删除知识图谱配置"""
    config = KGConfig.query.get_or_404(id)
    db.session.delete(config)
    db.session.commit()
    return jsonify({'message': 'Deleted successfully'}), 200

# ============== 本体配置 API ==============

@bp.route('/ontology', methods=['GET'])
def get_ontology_configs():
    """获取所有本体配置"""
    configs = OntologyConfig.query.all()
    return jsonify([c.to_dict() for c in configs])

@bp.route('/ontology/<int:id>', methods=['GET'])
def get_ontology_config(id):
    """获取单个本体配置"""
    config = OntologyConfig.query.get_or_404(id)
    return jsonify(config.to_dict())

@bp.route('/ontology', methods=['POST'])
def create_ontology_config():
    """创建本体配置"""
    data = request.get_json()
    config = OntologyConfig(
        name=data['name'],
        file_path=data.get('file_path'),
        file_type=data.get('file_type', 'json'),
        ontology_uri=data.get('ontology_uri'),
        version=data.get('version'),
        description=data.get('description'),
        is_active=data.get('is_active', False)
    )
    db.session.add(config)
    db.session.commit()
    return jsonify(config.to_dict()), 201

@bp.route('/ontology/<int:id>', methods=['PUT'])
def update_ontology_config(id):
    """更新本体配置"""
    config = OntologyConfig.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        config.name = data['name']
    if 'file_path' in data:
        config.file_path = data['file_path']
    if 'file_type' in data:
        config.file_type = data['file_type']
    if 'ontology_uri' in data:
        config.ontology_uri = data['ontology_uri']
    if 'version' in data:
        config.version = data['version']
    if 'description' in data:
        config.description = data['description']
    if 'is_active' in data:
        config.is_active = data['is_active']
    
    db.session.commit()
    return jsonify(config.to_dict())

@bp.route('/ontology/<int:id>', methods=['DELETE'])
def delete_ontology_config(id):
    """删除本体配置"""
    config = OntologyConfig.query.get_or_404(id)
    db.session.delete(config)
    db.session.commit()
    return jsonify({'message': 'Deleted successfully'}), 200
