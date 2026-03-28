"""
LLM + Search 路由 - 半导体知识问答 + 全网搜索
支持 Bing/Google/DuckDuckGo 搜索引擎接口
"""
from flask import Blueprint, request, jsonify
from ..services.llm_service import get_llm_service, SEMIKONG_SYSTEM_PROMPT
from ..services.search_api import get_search_api

bp = Blueprint('llm', __name__, url_prefix='/api/llm')

# ==================== LLM Chat ====================

@bp.route('/chat', methods=['POST'])
def chat():
    """
    发送问答请求
    
    Request Body:
    {
        "question": "什么是光刻工艺？",
        "use_ontology": true,        // 是否使用SemiKong本体知识
        "use_web_search": true,      // 是否启用网络搜索
        "search_provider": "bing"    // 搜索引擎: bing/google/duckduckgo
    }
    """
    data = request.get_json()
    
    if not data or 'question' not in data:
        return jsonify({'error': 'question is required'}), 400
    
    question = data['question']
    use_ontology = data.get('use_ontology', True)
    use_web_search = data.get('use_web_search', True)
    search_provider = data.get('search_provider', 'duckduckgo')
    
    llm = get_llm_service()
    search_api = get_search_api()
    
    # 根据开关设置
    if not use_web_search:
        search_api.disable()
    else:
        search_api.enable()
        search_api.set_provider(search_provider)
    
    # 如果启用网络搜索，先获取最新信息
    web_context = ""
    web_sources = []
    
    if use_web_search and search_api.is_enabled():
        results = search_api.search(question, max_results=5, provider=search_provider)
        if results:
            web_context = "\n\n## 最新网络资讯:\n"
            for i, r in enumerate(results[:5], 1):
                web_context += f"\n{i}. [{r['title']}]({r['url']})\n   {r['snippet']}\n"
            web_context += "\n\n请结合以上最新网络信息回答问题。"
            web_sources = results
    
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
        'web_search': {
            'enabled': use_web_search and search_api.is_enabled(),
            'provider': search_provider if use_web_search else None
        }
    }
    
    if web_sources:
        response_data['web_sources'] = web_sources
    
    if result['success']:
        return jsonify(response_data)
    else:
        return jsonify({
            'success': False,
            'error': result.get('error', 'Unknown error')
        }), 500


# ==================== Search API Endpoints (Bing/Google Format) ====================

@bp.route('/search/bing', methods=['GET'])
def search_bing():
    """
    Bing Search API v7 格式接口
    
    GET /api/llm/search/bing?q=keyword&count=10&offset=0&mkt=zh-CN
    
    Response: Bing Search API v7 格式
    """
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'q (query) is required'}), 400
    
    count = int(request.args.get('count', 10))
    offset = int(request.args.get('offset', 0))
    market = request.args.get('mkt', 'zh-CN')
    safe_search = request.args.get('safesearch', 'Moderate')
    response_filter = request.args.get('responseFilter', '')
    
    search_api = get_search_api()
    
    if not search_api.is_enabled():
        return jsonify({'error': 'Search disabled'}), 403
    
    # 调用 Bing API
    result = search_api.bing_search(
        query=query,
        count=count,
        offset=offset,
        market=market,
        safeSearch=safe_search,
        responseFilter=response_filter
    )
    
    if 'error' in result:
        return jsonify({'error': result['error']}), 500
    
    return jsonify(result)


@bp.route('/search/google', methods=['GET'])
def search_google():
    """
    Google Custom Search API 格式接口
    
    GET /api/llm/search/google?q=keyword&num=10&start=1&gl=cn&hl=zh-CN
    
    Response: Google Custom Search API 格式
    """
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'q (query) is required'}), 400
    
    num = int(request.args.get('num', 10))
    start = int(request.args.get('start', 1))
    gl = request.args.get('gl', 'cn')
    hl = request.args.get('hl', 'zh-CN')
    cr = request.args.get('cr', 'CN')
    filetype = request.args.get('filetype', '')
    
    search_api = get_search_api()
    
    if not search_api.is_enabled():
        return jsonify({'error': 'Search disabled'}), 403
    
    # 调用 Google API
    result = search_api.google_search(
        query=query,
        num=num,
        start=start,
        gl=gl,
        hl=hl,
        cr=cr,
        filetype=filetype
    )
    
    if 'error' in result:
        return jsonify({'error': result['error']}), 500
    
    return jsonify(result)


@bp.route('/search', methods=['GET'])
def search_unified():
    """
    统一搜索接口
    
    GET /api/llm/search?q=keyword&provider=duckduckgo&max_results=10
    
    Query Params:
        q: 搜索关键词 (必填)
        provider: bing | google | duckduckgo (默认 duckduckgo)
        max_results: 最大结果数 (默认 10)
    """
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'q (query) is required'}), 400
    
    provider = request.args.get('provider', 'duckduckgo')
    max_results = int(request.args.get('max_results', 10))
    
    search_api = get_search_api()
    
    if not search_api.is_enabled():
        return jsonify({'error': 'Search disabled'}), 403
    
    results = search_api.search(query, max_results=max_results, provider=provider)
    
    return jsonify({
        'success': True,
        'query': query,
        'provider': provider,
        'count': len(results),
        'results': results
    })


# ==================== Search Toggle & Config ====================

@bp.route('/search/config', methods=['GET', 'POST'])
def search_config():
    """
    搜索功能配置
    
    GET: 获取当前配置
    POST: 设置配置
        {
            "enabled": true/false,
            "provider": "bing" | "google" | "duckduckgo",
            "bing_api_key": "xxx",
            "google_api_key": "xxx",
            "google_cx": "xxx"
        }
    """
    search_api = get_search_api()
    
    if request.method == 'GET':
        return jsonify({
            'enabled': search_api.is_enabled(),
            'provider': search_api.get_provider(),
            'has_bing_key': bool(search_api.api_keys.get('bing')),
            'has_google_key': bool(search_api.api_keys.get('google')),
            'available_providers': ['duckduckgo', 'bing', 'google']
        })
    
    # POST
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    
    if 'enabled' in data:
        if data['enabled']:
            search_api.enable()
        else:
            search_api.disable()
    
    if 'provider' in data:
        search_api.set_provider(data['provider'])
    
    if 'bing_api_key' in data:
        search_api.api_keys['bing'] = data['bing_api_key']
    
    if 'google_api_key' in data:
        search_api.api_keys['google'] = data['google_api_key']
    
    if 'google_cx' in data:
        import os
        os.environ['GOOGLE_CX'] = data['google_cx']
    
    return jsonify({
        'success': True,
        'enabled': search_api.is_enabled(),
        'provider': search_api.get_provider()
    })


@bp.route('/search/toggle', methods=['POST'])
def toggle_search():
    """快速开关网络搜索"""
    data = request.get_json()
    search_api = get_search_api()
    
    if data and 'enabled' in data:
        if data['enabled']:
            search_api.enable()
        else:
            search_api.disable()
        return jsonify({
            'success': True,
            'enabled': search_api.is_enabled()
        })
    
    return jsonify({'error': 'enabled field required'}), 400


# ==================== Status ====================

@bp.route('/status', methods=['GET'])
def status():
    """检查 LLM + Search 服务状态"""
    llm = get_llm_service()
    search_api = get_search_api()
    return jsonify({
        'llm': {
            'configured': llm.is_configured(),
            'model': llm.model,
            'provider': 'minimax'
        },
        'search': {
            'enabled': search_api.is_enabled(),
            'provider': search_api.get_provider(),
            'has_bing_key': bool(search_api.api_keys.get('bing')),
            'has_google_key': bool(search_api.api_keys.get('google'))
        }
    })


@bp.route('/capabilities', methods=['GET'])
def capabilities():
    """获取服务能力描述"""
    search_api = get_search_api()
    return jsonify({
        'llm': {
            'provider': 'MiniMax',
            'model': 'MiniMax-M2.7',
            'features': [
                '半导体物理知识问答',
                '芯片设计与制程咨询',
                '设备材料选型建议',
                '供应链风险管理',
                '封装测试工艺解释',
                '行业术语解释',
                '全网最新资讯抓取'
            ]
        },
        'search': {
            'enabled': search_api.is_enabled(),
            'provider': search_api.get_provider(),
            'apis': {
                'bing': {
                    'endpoint': 'GET /api/llm/search/bing',
                    'format': 'Bing Search API v7',
                    'params': ['q', 'count', 'offset', 'mkt', 'safesearch']
                },
                'google': {
                    'endpoint': 'GET /api/llm/search/google',
                    'format': 'Google Custom Search API',
                    'params': ['q', 'num', 'start', 'gl', 'hl', 'cr', 'filetype']
                },
                'unified': {
                    'endpoint': 'GET /api/llm/search',
                    'format': 'Unified response',
                    'params': ['q', 'provider', 'max_results']
                }
            }
        },
        'ontology': 'SemiKong Full Ontology (712 classes, 13 categories)'
    })
