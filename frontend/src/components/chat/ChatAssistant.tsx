import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { Send, Sparkles, Globe, Brain, ExternalLink, MessageCircle, Loader2 } from 'lucide-react';

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
  const [useOntology, setUseOntology] = useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [searchProvider, setSearchProvider] = useState('duckduckgo');
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setWebSources([]);
    setShowSuggestions(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/llm/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input,
          use_ontology: useOntology,
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
      <div className="apple-card-interactive overflow-hidden">
        {/* Hero Header - Apple Premium */}
        <div className="apple-hero-mesh p-10 text-white relative overflow-hidden">
          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-8 left-8 w-2 h-2 bg-white/20 rounded-full animate-float" />
            <div className="absolute top-16 right-16 w-3 h-3 bg-white/15 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-400/30 rounded-full animate-breathe-glow" />
          </div>
          
          <div className="relative flex items-center gap-5">
            <div className="p-5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl">
              <Sparkles className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">半导体知识问答</h2>
              <p className="text-indigo-200/80 text-sm mt-2">基于 SemiKong 本体知识库 | MiniMax-M2.7</p>
            </div>
          </div>
        </div>
        
        {/* Search Config - Apple Glass */}
        <div className="p-6 bg-gradient-to-br from-gray-50/80 to-gray-100/50 border-b border-gray-100/50">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Model Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-50 rounded-xl">
                  <Brain size={20} className="text-violet-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">模型挖掘:</span>
              </div>
              <button
                onClick={() => setUseOntology(!useOntology)}
                className={`apple-toggle ${useOntology ? 'active' : ''}`}
                aria-label="Toggle ontology search"
              />
              <span className={`text-xs px-4 py-2 rounded-xl font-bold transition-colors ${useOntology ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'}`}>
                {useOntology ? '已启用' : '已禁用'}
              </span>
            </div>

            {/* Web Search Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Globe size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">网络搜索:</span>
              </div>
              <button
                onClick={() => handleToggleSearch(!webSearchEnabled)}
                className={`apple-toggle ${webSearchEnabled ? 'active' : ''}`}
                aria-label="Toggle web search"
              />
              <span className={`text-xs px-4 py-2 rounded-xl font-bold transition-colors ${webSearchEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                {webSearchEnabled ? '已启用' : '已禁用'}
              </span>
            </div>
            
            {/* Provider Selection */}
            {webSearchEnabled && (
              <select
                value={searchProvider}
                onChange={(e) => setSearchProvider(e.target.value)}
                className="apple-select max-w-[200px]"
              >
                <option value="duckduckgo">DuckDuckGo (免费)</option>
                <option value="bing">Bing Search API</option>
                <option value="google">Google Custom Search</option>
              </select>
            )}
          </div>
          
          {webSearchEnabled && (
            <div className="mt-5 p-4 bg-blue-50/80 rounded-2xl border border-blue-100/50">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <Globe size={14} />
                启用网络搜索将抓取全网最新资讯。推荐使用 DuckDuckGo（无需配置），如需 Bing/Google 请在 Settings 配置 API Key。
              </p>
            </div>
          )}

          {useOntology && (
            <div className="mt-5 p-4 bg-violet-50/80 rounded-2xl border border-violet-100/50">
              <p className="text-xs text-violet-700 flex items-center gap-2">
                <Brain size={14} />
                模型挖掘已启用，将结合 SemiKong 本体知识库 + MiniMax-M2.7 模型进行深度洞察分析。
              </p>
            </div>
          )}
        </div>
        
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-8 space-y-6">
          {messages.length === 0 && showSuggestions && (
            <div className="text-center py-12">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl animate-float">
                <MessageCircle className="w-14 h-14 text-indigo-500" />
              </div>
              <p className="text-gray-600 mb-10 font-semibold text-xl tracking-wide">
                问我关于半导体行业的问题吧！
              </p>
              
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">常见问题</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-5 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">产业分析</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {industryQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-5 py-3.5 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 text-indigo-700 rounded-2xl text-sm font-bold transition-all duration-200 border border-indigo-100 hover:shadow-lg hover:-translate-y-1"
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
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] px-7 py-5 rounded-3xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-md shadow-xl shadow-indigo-500/25'
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800 rounded-bl-md border border-gray-100/50'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 px-7 py-5 rounded-3xl rounded-bl-md border border-gray-100/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-violet-500 animate-apple-spin" />
                  <span className="text-sm text-gray-500 font-medium">正在思考...</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="apple-alert apple-alert-error animate-spring-in">
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          )}
          
          {/* Web Sources - Apple Card */}
          {webSources.length > 0 && (
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-2xl border border-blue-100/50 shadow-lg animate-scale-in">
              <p className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Globe size={18} className="text-blue-500" />
                </div>
                网络资讯来源 ({webSources[0]?.provider || 'search'})
              </p>
              <div className="space-y-3">
                {webSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-white/80 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-200 border border-transparent hover:border-blue-100/50"
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-blue-500 flex-shrink-0" />
                      <div className="text-sm font-bold text-blue-600 truncate">{source.title}</div>
                    </div>
                    {source.snippet && (
                      <div className="text-xs text-gray-600 mt-2 ml-7 line-clamp-2 leading-relaxed">{source.snippet}</div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Input - Apple Style v3 */}
        <div className="border-t border-gray-100/50 p-6 bg-gradient-to-br from-gray-50/50 to-white">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入你的问题..."
              className="flex-1 px-6 py-4.5 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 transition-all shadow-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="group px-10 py-4.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center gap-3"
            >
              <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
