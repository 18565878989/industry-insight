"""
Export Service - 报告导出服务 (PDF/Word/HTML)
"""
import os
import json
from datetime import datetime
from typing import Dict, Any, List
from io import BytesIO

class ExportService:
    """导出服务"""
    
    def __init__(self):
        self.export_dir = os.path.join(os.path.dirname(__file__), '../../exports')
        os.makedirs(self.export_dir, exist_ok=True)
    
    def export_to_pdf(self, data: Dict[str, Any], template: str = 'default') -> str:
        """
        导出为 PDF
        
        Args:
            data: 报告数据
            template: 模板名称
        
        Returns:
            文件路径
        """
        # 生成 HTML 内容
        html_content = self._generate_html_report(data, template)
        
        # 保存 HTML 文件（实际PDF转换需要额外工具）
        filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        filepath = os.path.join(self.export_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        return filepath
    
    def export_to_html(self, data: Dict[str, Any], template: str = 'default') -> str:
        """导出为 HTML"""
        html_content = self._generate_html_report(data, template)
        
        filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        filepath = os.path.join(self.export_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        return filepath
    
    def export_to_json(self, data: Dict[str, Any]) -> str:
        """导出为 JSON"""
        filename = f"data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(self.export_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        return filepath
    
    def export_to_csv(self, items: List[Dict], filename: str = None) -> str:
        """导出为 CSV"""
        if not items:
            return None
        
        if filename is None:
            filename = f"export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        filepath = os.path.join(self.export_dir, filename)
        
        # 获取所有列名
        columns = list(items[0].keys())
        
        with open(filepath, 'w', encoding='utf-8-sig') as f:
            # 写入表头
            f.write(','.join(columns) + '\n')
            
            # 写入数据
            for item in items:
                values = [str(item.get(col, '')).replace(',', ';') for col in columns]
                f.write(','.join(values) + '\n')
        
        return filepath
    
    def _generate_html_report(self, data: Dict[str, Any], template: str) -> str:
        """生成 HTML 报告"""
        title = data.get('title', '产业分析报告')
        sections = data.get('sections', [])
        
        html = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 1000px; margin: 0 auto; padding: 40px 20px; }}
        .header {{ text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #1E3A5F; }}
        .header h1 {{ color: #1E3A5F; font-size: 28px; margin-bottom: 10px; }}
        .header .date {{ color: #666; font-size: 14px; }}
        .section {{ margin-bottom: 30px; }}
        .section h2 {{ color: #1E3A5F; font-size: 20px; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #007AFF; }}
        .section p {{ margin-bottom: 10px; text-align: justify; }}
        .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }}
        .stat-card {{ background: #f5f5f7; padding: 20px; border-radius: 10px; text-align: center; }}
        .stat-card .value {{ font-size: 32px; font-weight: bold; color: #1E3A5F; }}
        .stat-card .label {{ color: #666; font-size: 14px; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #eee; }}
        th {{ background: #f5f5f7; font-weight: 600; }}
        tr:hover {{ background: #f9f9f9; }}
        .footer {{ text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }}
        @media print {{ .no-print {{ display: none; }} }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{title}</h1>
            <p class="date">生成时间: {datetime.now().strftime('%Y年%m月%d日 %H:%M')}</p>
        </div>
"""
        
        # 添加统计卡片
        if 'stats' in data:
            html += '<div class="stats">'
            for stat in data['stats']:
                html += f'''
                <div class="stat-card">
                    <div class="value">{stat.get('value', '-')}</div>
                    <div class="label">{stat.get('label', '')}</div>
                </div>
                '''
            html += '</div>'
        
        # 添加章节
        for section in sections:
            html += f'''
        <div class="section">
            <h2>{section.get('title', '')}</h2>
            {section.get('content', '')}
        </div>
            '''
        
        html += f"""
        <div class="footer">
            <p>产业洞察系统 | Semiconductor Industry Insight</p>
            <p>Generated by Industry Insight System</p>
        </div>
    </div>
</body>
</html>
"""
        return html
    
    def get_export_formats(self) -> List[Dict[str, str]]:
        """获取支持的导出格式"""
        return [
            {'format': 'html', 'name': 'HTML', 'description': '网页格式，可直接浏览器打开'},
            {'format': 'json', 'name': 'JSON', 'description': '数据格式，适合程序处理'},
            {'format': 'csv', 'name': 'CSV', 'description': '表格格式，Excel可打开'}
        ]


# 全局实例
_export_service = None

def get_export_service() -> ExportService:
    global _export_service
    if _export_service is None:
        _export_service = ExportService()
    return _export_service
