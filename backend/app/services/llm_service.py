"""
MiniMax LLM Service - 半导体行业知识问答
使用 urllib 替代 requests
"""
import json
import os
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from typing import Dict, Any

class MiniMaxLLM:
    """MiniMax LLM 服务"""
    
    def __init__(self, api_key: str = None, model: str = "MiniMax-M2.7"):
        self.api_key = api_key or os.environ.get('MINIMAX_API_KEY', '')
        self.model = model
        self.base_url = "https://api.minimaxi.com/v1"
        
    def chat(self, prompt: str, system_prompt: str = None, temperature: float = 0.7, max_tokens: int = 4000) -> Dict[str, Any]:
        """
        发送聊天请求到 MiniMax
        
        Args:
            prompt: 用户输入
            system_prompt: 系统提示词
            temperature: 温度参数
            max_tokens: 最大token数
            
        Returns:
            {'success': bool, 'content': str, 'error': str}
        """
        if not self.api_key:
            return {
                'success': False,
                'error': 'MiniMax API Key 未配置。请在 Settings 页面配置 API Key。'
            }
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        messages = []
        if system_prompt:
            messages.append({'role': 'system', 'content': system_prompt})
        messages.append({'role': 'user', 'content': prompt})
        
        payload = {
            'model': self.model,
            'messages': messages,
            'temperature': temperature,
            'max_tokens': max_tokens
        }
        
        try:
            req = Request(
                f'{self.base_url}/text/chatcompletion_v2',
                data=json.dumps(payload).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            
            with urlopen(req, timeout=60) as response:
                result = json.loads(response.read().decode('utf-8'))
                return {
                    'success': True,
                    'content': result.get('choices', [{}])[0].get('message', {}).get('content', ''),
                    'usage': result.get('usage', {})
                }
        except HTTPError as e:
            return {
                'success': False,
                'error': f"API Error: {e.code} - {e.read().decode('utf-8')}"
            }
        except URLError as e:
            return {
                'success': False,
                'error': f"Network Error: {str(e)}"
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def is_configured(self) -> bool:
        """检查是否已配置"""
        return bool(self.api_key)


# Semiconductor domain system prompt
SEMIKONG_SYSTEM_PROMPT = """你是一个专业的半导体行业知识助手，基于SemiKong半导体本体知识库。

你可以回答关于半导体产业链各个环节的问题：
- 半导体物理（能带结构、载流子、掺杂等）
- 芯片设计（Fabless、EDA工具、设计流程）
- 晶圆制造（Foundry、IDM工艺制程）
- 封装测试（OSAT、封装类型、测试服务）
- 设备材料（WFE设备、材料供应商）
- 供应链管理（风险评估、物流、追溯系统）

请用专业且易懂的方式回答问题。如果涉及具体公司或数据，请说明信息来源。
"""


def get_llm_service() -> MiniMaxLLM:
    """获取 LLM 服务实例"""
    from ..models import db, ModelConfig
    
    # 尝试从数据库获取配置 (没有provider字段，改用name过滤)
    active_config = ModelConfig.query.filter_by(is_active=True, name='MiniMax-M2.7').first()
    
    if active_config and active_config.api_key:
        return MiniMaxLLM(
            api_key=active_config.api_key,
            model=active_config.model_name or "MiniMax-M2.7"
        )
    
    # 从环境变量获取
    api_key = os.environ.get('MINIMAX_API_KEY', '')
    return MiniMaxLLM(api_key=api_key)
