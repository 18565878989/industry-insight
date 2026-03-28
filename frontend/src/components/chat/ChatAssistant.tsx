import { useState } from 'react';
import { API_BASE_URL } from '../../config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WebSource {
  title: string;
  url: string;
  snippet: string;
  provider?: string;
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [searchProvider, setSearchProvider] = useState('duckduckgo');
  const [webSources, setWebSources] = useState<WebSource[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setWebSources([]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/llm/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input,
          use_ontology: true,
          use_web_search: webSearchEnabled,
          search_provider: searchProvider
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer 
        }]);
        if (data.web_sources && data.web_sources.length > 0) {
          setWebSources(data.web_sources);
        }
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleToggleSearch = async (enabled: boolean) => {
    setWebSearchEnabled(enabled);
    try {
      await fetch(`${API_BASE_URL}/api/llm/search/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
    } catch (e) {
      console.error('Failed to toggle search');
    }
  };

  const suggestedQuestions = [
    '什么是光刻工艺？',
    'TSMC和Intel的制程有什么区别？',
    'EUV光刻机的工作原理是什么？',
    '什么是Lot Genealogy？',
    '半导体供应链的主要风险有哪些？',
  ];

  const industryQuestions = [
    '武汉市半导体产业分布如何？',
    '长江存储最新发展情况？',
    '中国半导体设备国产化进展？',
    '全球芯片短缺原因分析？',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            🤖 半导体知识问答
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            基于 SemiKong 本体知识库 | MiniMax-M2.7
          </p>
        </div>
        
        {/* Search Config */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              {/* Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">🌐 网络搜索:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${webSearchEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                  {webSearchEnabled ? '已启用' : '已禁用'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={webSearchEnabled}
                  onChange={(e) => handleToggleSearch(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {/* Provider Selection */}
            {webSearchEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">搜索引擎:</span>
                <select
                  value={searchProvider}
                  onChange={(e) => setSearchProvider(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="duckduckgo">DuckDuckGo (免费)</option>
                  <option value="bing">Bing Search API</option>
                  <option value="google">Google Custom Search</option>
                </select>
              </div>
            )}
          </div>
          
          {webSearchEnabled && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">
                💡 启用网络搜索将抓取全网最新资讯。推荐使用 DuckDuckGo（无需配置），如需 Bing/Google 请在 Settings 配置 API Key。
              </p>
            </div>
          )}
        </div>
        
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔬</div>
              <p className="text-slate-500 mb-4">
                问我关于半导体行业的问题吧！
              </p>
              
              <div className="mb-6">
                <p className="text-xs font-medium text-slate-400 uppercase mb-2">常见问题</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase mb-2">产业分析</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {industryQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`
            }>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Web Sources */}
          {webSources.length > 0 && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">
                🌐 网络资讯来源 ({webSources[0]?.provider || 'search'}):
              </p>
              <div className="space-y-2">
                {webSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm hover:bg-slate-100 p-2 rounded transition-colors"
                  >
                    <div className="text-blue-600 font-medium">{source.title}</div>
                    <div className="text-slate-500 text-xs truncate">{source.url}</div>
                    {source.snippet && (
                      <div className="text-slate-600 text-xs mt-1 line-clamp-2">{source.snippet}</div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入你的问题..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
