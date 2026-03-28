"""
Export API Routes - 报告导出 API
"""
from flask import Blueprint, request, jsonify, send_file
from ..services.export_service import get_export_service

bp = Blueprint('exports', __name__, url_prefix='/api/exports')

@bp.route('/formats', methods=['GET'])
def get_formats():
    """获取支持的导出格式"""
    export_service = get_export_service()
    return jsonify({
        'success': True,
        'formats': export_service.get_export_formats()
    })


@bp.route('/report', methods=['POST'])
def export_report():
    """
    导出报告
    
    Request Body:
    {
        "title": "报告标题",
        "sections": [
            {"title": "章节1", "content": "<p>内容</p>"},
            ...
        ],
        "stats": [
            {"label": "公司数", "value": "100"},
            ...
        ],
        "format": "html"  // html/json/csv
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    
    export_service = get_export_service()
    export_format = data.get('format', 'html')
    
    try:
        if export_format == 'json':
            filepath = export_service.export_to_json(data)
            return send_file(filepath, as_attachment=True, download_name=filepath.split('/')[-1])
        
        elif export_format == 'csv':
            items = data.get('items', [])
            if not items:
                return jsonify({'error': 'No items to export'}), 400
            filepath = export_service.export_to_csv(items)
            return send_file(filepath, as_attachment=True, download_name=filepath.split('/')[-1])
        
        else:  # html
            filepath = export_service.export_to_html(data)
            return send_file(filepath, as_attachment=True, download_name=filepath.split('/')[-1])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/companies', methods=['GET'])
def export_companies():
    """
    导出公司数据
    
    Query Params:
        format: html/json/csv (默认 html)
    """
    from ..services.company_service import get_company_service
    
    export_format = request.args.get('format', 'html')
    
    company_service = get_company_service()
    companies = company_service.get_all_companies()
    
    export_service = get_export_service()
    
    # 转换数据
    data = {
        'title': '半导体企业名录',
        'sections': [
            {
                'title': '企业列表',
                'content': f'<p>共计 {len(companies)} 家企业</p>'
            }
        ],
        'stats': [
            {'label': '企业总数', 'value': str(len(companies))}
        ]
    }
    
    if export_format == 'csv':
        # 展平公司数据
        items = []
        for c in companies:
            items.append({
                'name': c.get('name', ''),
                'name_cn': c.get('name_cn', ''),
                'category': c.get('category', ''),
                'region': c.get('region', ''),
                'country': c.get('country', ''),
                'website': c.get('website', '')
            })
        filepath = export_service.export_to_csv(items, 'companies.csv')
        return send_file(filepath, as_attachment=True, download_name='companies.csv')
    
    elif export_format == 'json':
        filepath = export_service.export_to_json({'companies': companies})
        return send_file(filepath, as_attachment=True, download_name='companies.json')
    
    else:  # html
        # 生成表格 HTML
        table_html = f'''
        <table>
            <thead>
                <tr>
                    <th>企业名称</th>
                    <th>中文名</th>
                    <th>类别</th>
                    <th>地区</th>
                    <th>国家</th>
                </tr>
            </thead>
            <tbody>
        '''
        for c in companies[:100]:  # 限制前100条
            table_html += f'''
                <tr>
                    <td>{c.get('name', '')}</td>
                    <td>{c.get('name_cn', '')}</td>
                    <td>{c.get('category', '')}</td>
                    <td>{c.get('region', '')}</td>
                    <td>{c.get('country', '')}</td>
                </tr>
            '''
        table_html += '</tbody></table>'
        
        if len(companies) > 100:
            table_html += f'<p>... 共 {len(companies)} 家企业，仅显示前100条</p>'
        
        data['sections'][0]['content'] = table_html
        filepath = export_service.export_to_html(data)
        return send_file(filepath, as_attachment=True, download_name='companies.html')


@bp.route('/knowledge-graph', methods=['GET'])
def export_knowledge_graph():
    """导出知识图谱数据"""
    from ..services.ontology_service import get_ontology_service
    
    ontology = get_ontology_service()
    
    data = {
        'title': '半导体知识图谱',
        'sections': [
            {
                'title': '节点统计',
                'content': f'<p>节点总数: {len(ontology.nodes)}</p><p>关系总数: {len(ontology.edges)}</p>'
            }
        ],
        'stats': [
            {'label': '节点数', 'value': str(len(ontology.nodes))},
            {'label': '边数', 'value': str(len(ontology.edges))}
        ]
    }
    
    export_service = get_export_service()
    filepath = export_service.export_to_json({
        'nodes': ontology.nodes,
        'edges': ontology.edges
    })
    
    return send_file(filepath, as_attachment=True, download_name='knowledge_graph.json')


@bp.route('/news', methods=['GET'])
def export_news():
    """导出资讯"""
    from ..services.news_service import get_news_service
    
    news_service = get_news_service()
    news = news_service.get_news(limit=100)
    
    export_format = request.args.get('format', 'json')
    
    export_service = get_export_service()
    
    if export_format == 'csv':
        items = [{
            'title': n.get('title', ''),
            'url': n.get('url', ''),
            'source': n.get('source', ''),
            'published_at': n.get('published_at', ''),
            'snippet': n.get('snippet', '')
        } for n in news]
        filepath = export_service.export_to_csv(items, 'news.csv')
        return send_file(filepath, as_attachment=True, download_name='news.csv')
    
    else:
        filepath = export_service.export_to_json({'news': news})
        return send_file(filepath, as_attachment=True, download_name='news.json')
