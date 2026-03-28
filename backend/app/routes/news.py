"""
News API Routes - 产业资讯 API
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
from ..services.news_service import get_news_service

bp = Blueprint('news', __name__, url_prefix='/api/news')

@bp.route('', methods=['GET'])
def get_news():
    """
    获取产业资讯列表
    
    Query Params:
        keyword: 过滤关键词 (可选)
        limit: 返回数量 (默认 50)
        refresh: 是否强制刷新 (true/false)
    """
    news_service = get_news_service()
    
    keyword = request.args.get('keyword')
    limit = int(request.args.get('limit', 50))
    refresh = request.args.get('refresh', 'false').lower() == 'true'
    
    # 检查是否需要抓取新数据
    if refresh or news_service.should_fetch():
        keywords = request.args.get('keywords', '半导体,芯片,长江存储,光刻机').split(',')
        news_service.fetch_industry_news(keywords=keywords)
    
    # 获取数据
    if keyword:
        news = news_service.get_news_by_keyword(keyword)
    else:
        news = news_service.get_news(limit=limit)
    
    return jsonify({
        'success': True,
        'count': len(news),
        'last_fetch': news_service.last_fetch.isoformat() if news_service.last_fetch else None,
        'news': news
    })


@bp.route('/refresh', methods=['POST'])
def refresh_news():
    """强制刷新资讯"""
    news_service = get_news_service()
    
    keywords = request.get_json() or {}
    kw_list = keywords.get('keywords', [
        '半导体', '芯片', '长江存储', '台积电', '光刻机'
    ])
    
    if isinstance(kw_list, str):
        kw_list = kw_list.split(',')
    
    news = news_service.fetch_industry_news(keywords=kw_list)
    
    return jsonify({
        'success': True,
        'count': len(news),
        'fetched_at': datetime.now().isoformat(),
        'news': news
    })


@bp.route('/config', methods=['GET', 'POST'])
def config_news():
    """资讯服务配置"""
    news_service = get_news_service()
    
    if request.method == 'GET':
        return jsonify({
            'enabled': news_service.is_enabled(),
            'fetch_interval_hours': news_service.fetch_interval_hours,
            'last_fetch': news_service.last_fetch.isoformat() if news_service.last_fetch else None,
            'news_count': len(news_service.news_data)
        })
    
    # POST
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    
    if 'enabled' in data:
        if data['enabled']:
            news_service.enable()
        else:
            news_service.disable()
    
    if 'interval_hours' in data:
        news_service.set_interval(int(data['interval_hours']))
    
    return jsonify({
        'success': True,
        'enabled': news_service.is_enabled(),
        'fetch_interval_hours': news_service.fetch_interval_hours
    })


@bp.route('/latest', methods=['GET'])
def latest_news():
    """获取最新资讯 (简短版本)"""
    news_service = get_news_service()
    limit = int(request.args.get('limit', 10))
    
    if not news_service.news_data or news_service.should_fetch():
        news_service.fetch_industry_news()
    
    latest = news_service.get_news(limit=limit)
    
    # 简化返回
    simplified = [{
        'title': n['title'][:50] + '...' if len(n['title']) > 50 else n['title'],
        'source': n['source'],
        'url': n['url']
    } for n in latest]
    
    return jsonify({
        'success': True,
        'count': len(simplified),
        'news': simplified
    })


@bp.route('/sources', methods=['GET'])
def news_sources():
    """获取资讯来源统计"""
    news_service = get_news_service()
    
    sources = {}
    for n in news_service.news_data:
        source = n['source']
        if source not in sources:
            sources[source] = 0
        sources[source] += 1
    
    sorted_sources = sorted(sources.items(), key=lambda x: x[1], reverse=True)
    
    return jsonify({
        'success': True,
        'total_sources': len(sources),
        'sources': [{'name': k, 'count': v} for k, v in sorted_sources]
    })
