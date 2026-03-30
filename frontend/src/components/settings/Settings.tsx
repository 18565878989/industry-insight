import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { Bot, Brain, Database, Save, Check, Settings2, ExternalLink, Info } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('model');
  const [modelConfig, setModelConfig] = useState({
    provider: 'openai',
    model: 'gpt-4',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/configs/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelConfig),
      });
      if (response.ok) {
        setMessage('Settings saved successfully!');
      }
    } catch (error) {
      setMessage('Error saving settings');
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'model', label: 'Model Config', icon: Bot },
    { id: 'ontology', label: 'Ontology', icon: Brain },
    { id: 'data', label: 'Data Sources', icon: Database },
  ];

  const ontologyCategories = [
    { name: 'PHYSICS', classes: 15, desc: '半导体物理基础', color: 'from-blue-500 to-cyan-500' },
    { name: 'SHARED', classes: 42, desc: '跨领域共享概念', color: 'from-gray-500 to-gray-600' },
    { name: 'DEVICES', classes: 15, desc: '半导体器件', color: 'from-purple-500 to-violet-500' },
    { name: 'INTEGRATORS', classes: 31, desc: '系统集成商', color: 'from-indigo-500 to-blue-500' },
    { name: 'IP_PROVIDERS', classes: 32, desc: 'IP提供商', color: 'from-violet-500 to-purple-500' },
    { name: 'FABLESS', classes: 26, desc: '无晶圆厂设计', color: 'from-fuchsia-500 to-pink-500' },
    { name: 'EDA', classes: 19, desc: '设计工具', color: 'from-cyan-500 to-teal-500' },
    { name: 'FOUNDRY_IDM', classes: 76, desc: '晶圆厂/IDM', color: 'from-teal-500 to-green-500' },
    { name: 'OSAT', classes: 41, desc: '封装测试', color: 'from-green-500 to-emerald-500' },
    { name: 'WFE', classes: 250, desc: '设备', color: 'from-amber-500 to-orange-500' },
    { name: 'MATERIALS', classes: 125, desc: '材料', color: 'from-orange-500 to-red-500' },
    { name: 'SUPPLY_CHAIN', classes: 21, desc: '供应链', color: 'from-red-500 to-rose-500' },
    { name: 'STANDARDS', classes: 5, desc: '标准参考', color: 'from-rose-500 to-pink-500' },
  ];

  const dataSources = [
    { source: 'SemiKong', format: 'TTL/JSON', status: '✅ Active', desc: 'aitomatic/semikong ⭐404', color: 'from-violet-500 to-purple-600', link: 'https://github.com/aitomatic/semikong' },
    { source: 'DBpedia', format: 'RDF', status: '✅ Imported', desc: 'SPARQL endpoint', color: 'from-blue-500 to-cyan-500', link: 'https://dbpedia.org' },
    { source: 'SemicONTO', format: 'TTL/RDF', status: '✅ Imported', desc: 'Academic physics', color: 'from-green-500 to-emerald-500', link: '' },
    { source: 'Digital Reference', format: 'TTL', status: '✅ Imported', desc: 'Infineon industrial', color: 'from-orange-500 to-amber-500', link: '' },
    { source: 'IOF Core', format: 'RDF', status: '✅ Imported', desc: 'Industrial standards', color: 'from-red-500 to-rose-500', link: '' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPBlVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
        </div>
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gray-600/40 rounded-full blur-3xl" />
        
        <div className="relative flex items-center gap-5">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <Settings2 className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
            <p className="text-gray-400 mt-1">配置模型、本体与数据源</p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden">
        {/* Tab Bar - Apple Style */}
        <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100/50 p-2">
          <div className="flex gap-2 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-lg shadow-black/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }
                `}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'model' && (
            <div className="space-y-6">
              {/* Info Alert */}
              <div className="apple-alert apple-alert-info">
                <Info size={20} className="flex-shrink-0" />
                <p className="text-sm">配置您的语言模型设置以启用 AI 问答功能。</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Provider</label>
                  <select
                    value={modelConfig.provider}
                    onChange={(e) => setModelConfig({ ...modelConfig, provider: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 transition-all cursor-pointer"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="minimax">MiniMax</option>
                    <option value="deepseek">DeepSeek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Model</label>
                  <input
                    type="text"
                    value={modelConfig.model}
                    onChange={(e) => setModelConfig({ ...modelConfig, model: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 transition-all"
                    placeholder="e.g., gpt-4, claude-3, MiniMax-M2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">API Key</label>
                <input
                  type="password"
                  value={modelConfig.apiKey}
                  onChange={(e) => setModelConfig({ ...modelConfig, apiKey: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 transition-all"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Base URL</label>
                <input
                  type="text"
                  value={modelConfig.baseUrl}
                  onChange={(e) => setModelConfig({ ...modelConfig, baseUrl: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 transition-all"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
            </div>
          )}

          {activeTab === 'ontology' && (
            <div className="space-y-6">
              {/* Ontology Stats */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 border border-violet-100">
                <h3 className="font-bold text-gray-900 text-xl mb-3">SemiKong Full Ontology</h3>
                <p className="text-sm text-gray-600 mb-6">完整的半导体产业链本体 | Complete semiconductor industry ontology</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-violet-100 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="text-3xl font-bold text-violet-600">712</div>
                    <div className="text-xs text-gray-500 mt-2 font-semibold">Total Classes</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-green-100 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="text-3xl font-bold text-green-600">90</div>
                    <div className="text-xs text-gray-500 mt-2 font-semibold">Properties</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-purple-100 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="text-3xl font-bold text-purple-600">712</div>
                    <div className="text-xs text-gray-500 mt-2 font-semibold">KG Nodes</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-orange-100 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="text-3xl font-bold text-orange-600">13</div>
                    <div className="text-xs text-gray-500 mt-2 font-semibold">Categories</div>
                  </div>
                </div>
              </div>
              
              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ontologyCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${cat.color}`} />
                      <div>
                        <span className="font-bold text-gray-800">{cat.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({cat.desc})</span>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-sm">
                      {cat.classes}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              {dataSources.map((ds) => (
                <div 
                  key={ds.source} 
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 bg-gradient-to-br ${ds.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Database size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{ds.source}</div>
                        <div className="text-sm text-gray-500 mt-1">{ds.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{ds.format}</span>
                      <span className="text-sm font-bold text-green-600">{ds.status}</span>
                      {ds.link && (
                        <a
                          href={ds.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                          <ExternalLink size={16} className="text-gray-500" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          {activeTab === 'model' && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 transition-all duration-200"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Settings
                  </>
                )}
              </button>
              {message && (
                <span className={`text-sm font-bold flex items-center gap-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message.includes('Error') ? '' : <Check size={18} />}
                  {message}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
