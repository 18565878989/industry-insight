import { useState } from 'react';
import { API_BASE_URL } from '../../config';

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
    { source: 'SemiKong', format: 'TTL/JSON', status: '✅ Active', desc: 'aitomatic/semikong ⭐404' },
    { source: 'DBpedia', format: 'RDF', status: '✅ Imported', desc: 'SPARQL endpoint' },
    { source: 'SemicONTO', format: 'TTL/RDF', status: '✅ Imported', desc: 'Academic physics' },
    { source: 'Digital Reference', format: 'TTL', status: '✅ Imported', desc: 'Infineon industrial' },
    { source: 'IOF Core', format: 'RDF', status: '✅ Imported', desc: 'Industrial standards' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            {['model', 'ontology', 'data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'model' && '🤖 Model Config'}
                {tab === 'ontology' && '🧠 Ontology'}
                {tab === 'data' && '📊 Data Sources'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'model' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Provider</label>
                <select
                  value={modelConfig.provider}
                  onChange={(e) => setModelConfig({ ...modelConfig, provider: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="minimax">MiniMax</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                <input
                  type="text"
                  value={modelConfig.model}
                  onChange={(e) => setModelConfig({ ...modelConfig, model: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., gpt-4, claude-3, MiniMax-M2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={modelConfig.apiKey}
                  onChange={(e) => setModelConfig({ ...modelConfig, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
                <input
                  type="text"
                  value={modelConfig.baseUrl}
                  onChange={(e) => setModelConfig({ ...modelConfig, baseUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
            </div>
          )}

          {activeTab === 'ontology' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">SemiKong Full Ontology</h3>
                <p className="text-sm text-slate-600 mb-3">完整的半导体产业链本体 | Complete semiconductor industry ontology</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded border border-slate-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">712</div>
                    <div className="text-xs text-slate-500">Total Classes</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200 text-center">
                    <div className="text-2xl font-bold text-green-600">90</div>
                    <div className="text-xs text-slate-500">Properties</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">712</div>
                    <div className="text-xs text-slate-500">KG Nodes</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200 text-center">
                    <div className="text-2xl font-bold text-orange-600">13</div>
                    <div className="text-xs text-slate-500">Categories</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Ontology Categories | 本体分类</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ontologyCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <span className="font-medium text-slate-800">{cat.name}</span>
                        <span className="text-xs text-slate-500 ml-2">({cat.desc})</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {cat.classes}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Source</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Format</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dataSources.map((ds) => (
                      <tr key={ds.source}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{ds.source}</div>
                          <div className="text-xs text-slate-500">{ds.desc}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{ds.format}</td>
                        <td className="px-4 py-3">
                          <span className="text-green-600">{ds.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {message && (
              <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
