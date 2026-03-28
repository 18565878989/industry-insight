"""
LLM 路由 - 半导体知识问答 API
"""
from flask import Blueprint, request, jsonify
from ..services.llm_service import get_llm_service, SEMIKONG_SYSTEM_PROMPT

bp = Blueprint('llm', __name__, url_prefix='/api/llm')

@bp.route('/chat', methods=['POST'])
def chat():
    """
    发送问答请求
    
    Request Body:
    {
        "question": "什么是光刻工艺？",
        "use_ontology": true  // 是否使用SemiKong本体知识
    }
    """
    data = request.get_json()
    
    if not data or 'question' not in data:
        return jsonify({'error': 'question is required'}), 400
    
    question = data['question']
    use_ontology = data.get('use_ontology', True)
    
    llm = get_llm_service()
    
    if not llm.is_configured():
        return jsonify({
            'error': 'MiniMax API Key 未配置',
            'code': 'API_KEY_NOT_SET',
            'hint': '请在 Settings > Model Config 页面配置 MiniMax API Key'
        }), 400
    
    system_prompt = SEMIKONG_SYSTEM_PROMPT if use_ontology else None
    
    result = llm.chat(
        prompt=question,
        system_prompt=system_prompt,
        temperature=0.7,
        max_tokens=4000
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'answer': result['content'],
            'usage': result.get('usage', {})
        })
    else:
        return jsonify({
            'success': False,
            'error': result.get('error', 'Unknown error')
        }), 500


@bp.route('/status', methods=['GET'])
def status():
    """检查 LLM 服务状态"""
    llm = get_llm_service()
    return jsonify({
        'configured': llm.is_configured(),
        'model': llm.model,
        'provider': 'minimax'
    })


@bp.route('/capabilities', methods=['GET'])
def capabilities():
    """获取 LLM 能力描述"""
    return jsonify({
        'provider': 'MiniMax',
        'model': 'MiniMax-M2.7',
        'features': [
            '半导体物理知识问答',
            '芯片设计与制程咨询',
            '设备材料选型建议',
            '供应链风险管理',
            '封装测试工艺解释',
            '行业术语解释'
        ],
        'ontology': 'SemiKong Full Ontology (712 classes, 13 categories)'
    })
