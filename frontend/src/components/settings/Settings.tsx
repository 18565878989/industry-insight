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
  const [_kgConfig, _setKgConfig] = useState({
    refreshInterval: 3600,
    batchSize: 100,
    dataSource: 'semiKong',
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Provider
                </label>
                <select
                  value={modelConfig.provider}
                  onChange={(e) => setModelConfig({ ...modelConfig, provider: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="minimax">MiniMax</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={modelConfig.model}
                  onChange={(e) => setModelConfig({ ...modelConfig, model: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., gpt-4, claude-3, MiniMax-M2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={modelConfig.apiKey}
                  onChange={(e) => setModelConfig({ ...modelConfig, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Base URL
                </label>
                <input
                  type="text"
                  value={modelConfig.baseUrl}
                  onChange={(e) => setModelConfig({ ...modelConfig, baseUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
            </div>
          )}

          {activeTab === 'ontology' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">SemiKong Ontology</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <div className="text-slate-500">Classes</div>
                    <div className="text-2xl font-bold text-blue-600">699</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <div className="text-slate-500">Properties</div>
                    <div className="text-2xl font-bold text-blue-600">87</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <div className="text-slate-500">KG Nodes</div>
                    <div className="text-2xl font-bold text-green-600">710</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <div className="text-slate-500">KG Edges</div>
                    <div className="text-2xl font-bold text-green-600">699</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {['Physics', 'WFE', 'Materials', 'OSAT', 'Fabless', 'EDA', 'Foundry-IDM', 'Supply Chain'].map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {cat}
                    </span>
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
                    <tr>
                      <td className="px-4 py-3 font-medium">SemiKong</td>
                      <td className="px-4 py-3 text-slate-500">TTL/JSON</td>
                      <td className="px-4 py-3"><span className="text-green-600">✅ Active</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">DBpedia</td>
                      <td className="px-4 py-3 text-slate-500">RDF</td>
                      <td className="px-4 py-3"><span className="text-green-600">✅ Imported</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">SemicONTO</td>
                      <td className="px-4 py-3 text-slate-500">TTL/RDF</td>
                      <td className="px-4 py-3"><span className="text-green-600">✅ Imported</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Digital Reference</td>
                      <td className="px-4 py-3 text-slate-500">TTL</td>
                      <td className="px-4 py-3"><span className="text-green-600">✅ Imported</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">IOF Core</td>
                      <td className="px-4 py-3 text-slate-500">RDF</td>
                      <td className="px-4 py-3"><span className="text-green-600">✅ Imported</span></td>
                    </tr>
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
