"""
LLM 路由 - 半导体知识问答 API
支持开关控制是否抓取全网最新信息
"""
from flask import Blueprint, request, jsonify
from ..services.llm_service import get_llm_service, SEMIKONG_SYSTEM_PROMPT
from ..services.web_search import get_search_service

bp = Blueprint('llm', __name__, url_prefix='/api/llm')

@bp.route('/chat', methods=['POST'])
def chat():
    """
    发送问答请求
    
    Request Body:
    {
        "question": "什么是光刻工艺？",
        "use_ontology": true,        // 是否使用SemiKong本体知识
        "use_web_search": true      // 是否启用网络搜索获取最新信息
    }
    """
    data = request.get_json()
    
    if not data or 'question' not in data:
        return jsonify({'error': 'question is required'}), 400
    
    question = data['question']
    use_ontology = data.get('use_ontology', True)
    use_web_search = data.get('use_web_search', True)
    
    llm = get_llm_service()
    search_service = get_search_service()
    
    # 根据开关设置
    if not use_web_search:
        search_service.disable()
    else:
        search_service.enable()
    
    # 如果启用网络搜索，先获取最新信息
    web_context = ""
    if use_web_search and search_service.is_enabled():
        results = search_service.search(question, max_results=5)
        if results:
            web_context = "\n\n## 最新网络资讯:\n"
            for i, r in enumerate(results[:5], 1):
                web_context += f"\n{i}. [{r['title']}]({r['url']})\n   {r['snippet']}\n"
            web_context += "\n\n请结合以上最新网络信息回答问题。"
    
    # 构建完整提示词
    if web_context:
        full_prompt = f"""基于以下背景信息回答问题：

{web_context}

---
用户问题: {question}

请综合以上信息给出专业、准确的回答。如果网络信息与 SemiKong 本体知识有差异，请以最新信息为准并注明。"""
    else:
        full_prompt = question
    
    if not llm.is_configured():
        return jsonify({
            'error': 'MiniMax API Key 未配置',
            'code': 'API_KEY_NOT_SET',
            'hint': '请在 Settings > Model Config 页面配置 MiniMax API Key'
        }), 400
    
    system_prompt = SEMIKONG_SYSTEM_PROMPT if use_ontology else None
    
    result = llm.chat(
        prompt=full_prompt,
        system_prompt=system_prompt,
        temperature=0.7,
        max_tokens=4000
    )
    
    response_data = {
        'success': result['success'],
        'answer': result.get('content', ''),
        'usage': result.get('usage', {}),
        'web_search_enabled': use_web_search and search_service.is_enabled()
    }
    
    if use_web_search and search_service.is_enabled():
        results = search_service.search(question, max_results=5)
        response_data['web_sources'] = results
    
    if result['success']:
        return jsonify(response_data)
    else:
        return jsonify({
            'success': False,
            'error': result.get('error', 'Unknown error')
        }), 500


@bp.route('/web-search/toggle', methods=['POST'])
def toggle_web_search():
    """
    开关网络搜索功能
    
    Request Body:
    {
        "enabled": true/false
    }
    """
    data = request.get_json()
    
    if data and 'enabled' in data:
        search_service = get_search_service()
        if data['enabled']:
            search_service.enable()
        else:
            search_service.disable()
        
        return jsonify({
            'success': True,
            'web_search_enabled': search_service.is_enabled()
        })
    
    return jsonify({'error': 'enabled field required'}), 400


@bp.route('/web-search/status', methods=['GET'])
def web_search_status():
    """获取网络搜索状态"""
    search_service = get_search_service()
    return jsonify({
        'enabled': search_service.is_enabled(),
        'description': '网络搜索开关，控制是否抓取全网最新信息'
    })


@bp.route('/status', methods=['GET'])
def status():
    """检查 LLM 服务状态"""
    llm = get_llm_service()
    search_service = get_search_service()
    return jsonify({
        'configured': llm.is_configured(),
        'model': llm.model,
        'provider': 'minimax',
        'web_search': search_service.is_enabled()
    })


@bp.route('/capabilities', methods=['GET'])
def capabilities():
    """获取 LLM 能力描述"""
    search_service = get_search_service()
    return jsonify({
        'provider': 'MiniMax',
        'model': 'MiniMax-M2.7',
        'features': [
            '半导体物理知识问答',
            '芯片设计与制程咨询',
            '设备材料选型建议',
            '供应链风险管理',
            '封装测试工艺解释',
            '行业术语解释',
            '全网最新资讯抓取 (可开关)'
        ],
        'web_search': {
            'enabled': search_service.is_enabled(),
            'description': '启用后可抓取全网最新半导体产业资讯'
        },
        'ontology': 'SemiKong Full Ontology (712 classes, 13 categories)'
    })
