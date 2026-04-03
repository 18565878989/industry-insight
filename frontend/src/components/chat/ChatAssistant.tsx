import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { Send, Globe, Brain, ExternalLink, MessageCircle, Loader2 } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-px">
      {/* Hero Header */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[var(--bg-hover)] rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-[var(--text-secondary)]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">AI Assistant</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-2">基于 SemiKong 本体知识库 | MiniMax-M2.7</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Config */}
      <div className="bg-[var(--bg-secondary)] px-8 py-6 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-5">
          {/* Model Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
                <Brain size={16} className="text-[var(--text-secondary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">模型挖掘:</span>
            </div>
            <button
              onClick={() => setUseOntology(!useOntology)}
              className={`w-12 h-6 rounded-full transition-colors relative ${useOntology ? 'bg-[var(--text-primary)]' : 'bg-[var(--bg-hover)]'}`}
              aria-label="Toggle ontology search"
            >
              <span className={`absolute top-1 w-4 h-4 bg-[var(--bg-primary)] rounded-full transition-transform ${useOntology ? 'left-7' : 'left-1'}`} />
            </button>
            <span className={`text-xs px-3 py-1.5 font-medium ${useOntology ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'}`}>
              {useOntology ? '已启用' : '已禁用'}
            </span>
          </div>

          {/* Web Search Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
                <Globe size={16} className="text-[var(--text-secondary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">网络搜索:</span>
            </div>
            <button
              onClick={() => handleToggleSearch(!webSearchEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${webSearchEnabled ? 'bg-[var(--text-primary)]' : 'bg-[var(--bg-hover)]'}`}
              aria-label="Toggle web search"
            >
              <span className={`absolute top-1 w-4 h-4 bg-[var(--bg-primary)] rounded-full transition-transform ${webSearchEnabled ? 'left-7' : 'left-1'}`} />
            </button>
            <span className={`text-xs px-3 py-1.5 font-medium ${webSearchEnabled ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'}`}>
              {webSearchEnabled ? '已启用' : '已禁用'}
            </span>
          </div>
          
          {/* Provider Selection */}
          {webSearchEnabled && (
            <select
              value={searchProvider}
              onChange={(e) => setSearchProvider(e.target.value)}
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm px-4 py-2.5 cursor-pointer"
            >
              <option value="duckduckgo">DuckDuckGo (免费)</option>
              <option value="bing">Bing Search API</option>
              <option value="google">Google Custom Search</option>
            </select>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="bg-[var(--bg-primary)] min-h-[500px] p-8">
        <div className="max-w-6xl mx-auto">
          {messages.length === 0 && showSuggestions && (
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)] text-lg font-medium mb-10">
                问我关于半导体行业的问题吧！
              </p>
              
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)] mb-5">常见问题</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-4 py-2.5 bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-lg text-sm font-medium transition-colors border border-[var(--border-color)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)] mb-5">产业分析</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {industryQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-4 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 rounded-lg text-sm font-semibold transition-colors"
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
              className={`flex mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-5 py-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="px-5 py-4 rounded-2xl border border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[var(--text-secondary)] animate-spin" />
                  <span className="text-sm text-[var(--text-secondary)] font-medium">正在思考...</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="border px-5 py-4 rounded-lg" style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent)' }}>
              <p className="font-medium" style={{ color: 'var(--accent)' }}>{error}</p>
            </div>
          )}
          
          {/* Web Sources */}
          {webSources.length > 0 && (
            <div className="mt-6 p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg">
              <p className="text-sm font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                <Globe size={16} className="text-[var(--text-secondary)]" />
                网络资讯来源 ({webSources[0]?.provider || 'search'})
              </p>
              <div className="space-y-3">
                {webSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink size={14} className="text-[var(--text-faint)] flex-shrink-0" />
                      <div className="text-sm font-semibold text-[var(--text-secondary)] truncate">{source.title}</div>
                    </div>
                    {source.snippet && (
                      <div className="text-xs text-[var(--text-secondary)] mt-2 ml-6 line-clamp-2 leading-relaxed">{source.snippet}</div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input */}
      <div className="bg-[var(--bg-secondary)] px-8 py-6 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--border-color-hover)] transition-colors placeholder:text-[var(--text-secondary)]"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
          >
            <Send size={16} />
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
