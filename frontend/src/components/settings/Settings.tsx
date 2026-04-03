import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { Bot, Brain, Database, Save, Check, Settings2, ExternalLink } from 'lucide-react';

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
    { name: 'PHYSICS', classes: 15, desc: '半导体物理基础' },
    { name: 'SHARED', classes: 42, desc: '跨领域共享概念' },
    { name: 'DEVICES', classes: 15, desc: '半导体器件' },
    { name: 'INTEGRATORS', classes: 31, desc: '系统集成商' },
    { name: 'IP_PROVIDERS', classes: 32, desc: 'IP提供商' },
    { name: 'FABLESS', classes: 26, desc: '无晶圆厂设计' },
    { name: 'EDA', classes: 19, desc: '设计工具' },
    { name: 'FOUNDRY_IDM', classes: 76, desc: '晶圆厂/IDM' },
    { name: 'OSAT', classes: 41, desc: '封装测试' },
    { name: 'WFE', classes: 250, desc: '设备' },
    { name: 'MATERIALS', classes: 125, desc: '材料' },
    { name: 'SUPPLY_CHAIN', classes: 21, desc: '供应链' },
    { name: 'STANDARDS', classes: 5, desc: '标准参考' },
  ];

  const dataSources = [
    { source: 'SemiKong', format: 'TTL/JSON', status: 'Active', desc: 'aitomatic/semikong ⭐404', link: 'https://github.com/aitomatic/semikong' },
    { source: 'DBpedia', format: 'RDF', status: 'Imported', desc: 'SPARQL endpoint', link: 'https://dbpedia.org' },
    { source: 'SemicONTO', format: 'TTL/RDF', status: 'Imported', desc: 'Academic physics', link: '' },
    { source: 'Digital Reference', format: 'TTL', status: 'Imported', desc: 'Infineon industrial', link: '' },
    { source: 'IOF Core', format: 'RDF', status: 'Imported', desc: 'Industrial standards', link: '' },
  ];

  return (
    <div className="space-y-px">
      {/* Hero Header */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bg-hover)] rounded-lg flex items-center justify-center">
              <Settings2 size={24} className="text-[var(--text-secondary)]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">Settings</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-2">配置模型、本体与数据源</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        {/* Tab Bar */}
        <div className="border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-8 pt-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'model' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-4">
                <p className="text-sm text-[var(--text-secondary)]">配置您的语言模型设置以启用 AI 问答功能。</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Provider</label>
                  <select
                    value={modelConfig.provider}
                    onChange={(e) => setModelConfig({ ...modelConfig, provider: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 text-sm cursor-pointer focus:outline-none focus:border-[var(--border-color-hover)]"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="minimax">MiniMax</option>
                    <option value="deepseek">DeepSeek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Model</label>
                  <input
                    type="text"
                    value={modelConfig.model}
                    onChange={(e) => setModelConfig({ ...modelConfig, model: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--border-color-hover)] placeholder:text-[var(--text-secondary)]"
                    placeholder="e.g., gpt-4, claude-3, MiniMax-M2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">API Key</label>
                <input
                  type="password"
                  value={modelConfig.apiKey}
                  onChange={(e) => setModelConfig({ ...modelConfig, apiKey: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--border-color-hover)] placeholder:text-[var(--text-secondary)]"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Base URL</label>
                <input
                  type="text"
                  value={modelConfig.baseUrl}
                  onChange={(e) => setModelConfig({ ...modelConfig, baseUrl: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--border-color-hover)] placeholder:text-[var(--text-secondary)]"
                  placeholder="https://api.openai.com/v1"
                />
              </div>

              {/* Save Button */}
              <div className="pt-5 flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Settings
                    </>
                  )}
                </button>
                {message && (
                  <span className={`text-sm font-medium flex items-center gap-2 ${message.includes('Error') ? 'text-[var(--accent)]' : 'text-green-500'}`}>
                    {!message.includes('Error') && <Check size={16} />}
                    {message}
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ontology' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-6">
                <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2">SemiKong Full Ontology</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-5">完整的半导体产业链本体 | Complete semiconductor industry ontology</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-4 text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">712</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Total Classes</div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-4 text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">90</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Properties</div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-4 text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">712</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">KG Nodes</div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-4 text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">13</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Categories</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ontologyCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full" />
                      <div>
                        <span className="font-semibold text-[var(--text-primary)] text-sm">{cat.name}</span>
                        <span className="text-xs text-[var(--text-secondary)] ml-2">({cat.desc})</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded text-xs font-semibold">
                      {cat.classes}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="max-w-4xl space-y-3">
              {dataSources.map((ds) => (
                <div 
                  key={ds.source} 
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--bg-hover)] rounded flex items-center justify-center">
                        <Database size={20} className="text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{ds.source}</div>
                        <div className="text-sm text-[var(--text-secondary)] mt-0.5">{ds.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-3 py-1.5 bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium">{ds.format}</span>
                      <span className="text-sm font-medium text-green-500">{ds.status}</span>
                      {ds.link && (
                        <a
                          href={ds.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                        >
                          <ExternalLink size={14} className="text-[var(--text-secondary)]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
