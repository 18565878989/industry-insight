import { useState } from 'react';
import { ChevronRight, ChevronDown, Database, Layers, Network, GitBranch, Circle } from 'lucide-react';

interface OntologyNode {
  name: string;
  type: 'class' | 'property';
  count?: number;
  children?: OntologyNode[];
  description?: string;
}

interface OntologyTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  stats: { label: string; value: string | number }[];
  rootNodes: OntologyNode[];
}

const defaultOntologies: OntologyTab[] = [
  {
    id: 'semikong',
    name: 'SemiKong',
    icon: <Network size={16} />,
    stats: [
      { label: 'Classes', value: 712 },
      { label: 'Properties', value: 90 },
      { label: 'Categories', value: 13 },
    ],
    rootNodes: [
      {
        name: 'PHYSICS',
        type: 'class',
        count: 15,
        description: '半导体物理基础',
        children: [
          { name: 'SemiconductorPhysics', type: 'class', count: 5, description: '基础物理理论' },
          { name: 'MaterialProperties', type: 'class', count: 4, description: '材料特性' },
          { name: 'QuantumEffects', type: 'class', count: 3, description: '量子效应' },
          { name: 'DevicePhysics', type: 'class', count: 3, description: '器件物理' },
        ],
      },
      {
        name: 'DEVICES',
        type: 'class',
        count: 15,
        description: '半导体器件',
        children: [
          { name: 'MOSFET', type: 'class', count: 4, description: 'MOS晶体管' },
          { name: 'BJT', type: 'class', count: 3, description: '双极晶体管' },
          { name: 'CMOS', type: 'class', count: 4, description: 'CMOS器件' },
          { name: 'MemoryDevices', type: 'class', count: 4, description: '存储器件' },
        ],
      },
      {
        name: 'FABLESS',
        type: 'class',
        count: 26,
        description: '无晶圆厂设计',
        children: [
          { name: 'AI_Chips', type: 'class', count: 8, description: 'AI芯片' },
          { name: 'GPU_Designs', type: 'class', count: 6, description: 'GPU设计' },
          { name: 'CPU_Cores', type: 'class', count: 7, description: 'CPU核心' },
          { name: 'FPGA', type: 'class', count: 5, description: '可编程逻辑' },
        ],
      },
      {
        name: 'EDA',
        type: 'class',
        count: 19,
        description: '设计工具',
        children: [
          { name: 'Synthesis', type: 'class', count: 4, description: '逻辑综合' },
          { name: 'PlaceRoute', type: 'class', count: 5, description: '布局布线' },
          { name: 'Verification', type: 'class', count: 6, description: '验证工具' },
          { name: 'Simulation', type: 'class', count: 4, description: '仿真工具' },
        ],
      },
      {
        name: 'FOUNDRY_IDM',
        type: 'class',
        count: 76,
        description: '晶圆厂/IDM',
        children: [
          { name: 'TSMC', type: 'class', count: 12, description: '台积电' },
          { name: 'Samsung', type: 'class', count: 10, description: '三星' },
          { name: 'Intel', type: 'class', count: 11, description: '英特尔' },
          { name: 'SMIC', type: 'class', count: 8, description: '中芯国际' },
          { name: 'GlobalFoundries', type: 'class', count: 9, description: '格芯' },
        ],
      },
      {
        name: 'WFE',
        type: 'class',
        count: 250,
        description: '设备',
        children: [
          { name: 'Lithography', type: 'class', count: 45, description: '光刻机' },
          { name: 'Etch', type: 'class', count: 38, description: '刻蚀机' },
          { name: 'Deposition', type: 'class', count: 42, description: '沉积设备' },
          { name: 'Inspection', type: 'class', count: 35, description: '检测设备' },
          { name: 'Packaging', type: 'class', count: 28, description: '封装设备' },
        ],
      },
      {
        name: 'MATERIALS',
        type: 'class',
        count: 125,
        description: '材料',
        children: [
          { name: 'Silicon', type: 'class', count: 18, description: '硅材料' },
          { name: 'GaAs', type: 'class', count: 15, description: '砷化镓' },
          { name: 'SiC', type: 'class', count: 12, description: '碳化硅' },
          { name: 'Photoresist', type: 'class', count: 22, description: '光刻胶' },
          { name: 'DopingMaterials', type: 'class', count: 16, description: '掺杂材料' },
        ],
      },
      {
        name: 'SUPPLY_CHAIN',
        type: 'class',
        count: 21,
        description: '供应链',
        children: [
          { name: 'RawMaterials', type: 'class', count: 6, description: '原材料' },
          { name: 'Equipment', type: 'class', count: 8, description: '设备供应' },
          { name: 'Logistics', type: 'class', count: 7, description: '物流' },
        ],
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: <GitBranch size={16} />,
    stats: [
      { label: 'Classes', value: 0 },
      { label: 'Properties', value: 0 },
      { label: 'Relations', value: 0 },
    ],
    rootNodes: [],
  },
  {
    id: 'imported',
    name: 'Imported',
    icon: <Database size={16} />,
    stats: [
      { label: 'DBpedia', value: '✓' },
      { label: 'SemicONTO', value: '✓' },
      { label: 'IOF Core', value: '✓' },
    ],
    rootNodes: [],
  },
];

interface TreeNodeProps {
  node: OntologyNode;
  level: number;
  defaultExpanded?: boolean;
}

function TreeNode({ node, level, defaultExpanded = false }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
          hover:bg-[var(--bg-hover)] transition-colors group
        `}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-5 h-5 flex items-center justify-center">
          {hasChildren ? (
            expanded ? (
              <ChevronDown size={14} className="text-[var(--text-secondary)]" />
            ) : (
              <ChevronRight size={14} className="text-[var(--text-secondary)]" />
            )
          ) : (
            <Circle size={6} className="text-[var(--text-secondary)] opacity-50" />
          )}
        </div>

        {/* Node Icon */}
        <div className={`w-6 h-6 rounded flex items-center justify-center ${
          node.type === 'class' 
            ? 'bg-blue-500/10 text-blue-500' 
            : 'bg-purple-500/10 text-purple-500'
        }`}>
          {node.type === 'class' ? <Layers size={12} /> : <Circle size={8} />}
        </div>

        {/* Node Name */}
        <span className="font-medium text-[var(--text-primary)] text-sm flex-1">
          {node.name}
        </span>

        {/* Description */}
        {node.description && (
          <span className="text-xs text-[var(--text-secondary)] hidden group-hover:inline-block">
            {node.description}
          </span>
        )}

        {/* Count Badge */}
        {node.count !== undefined && (
          <span className="px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded text-xs font-medium">
            {node.count}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="border-l border-[var(--border-color)] ml-5">
          {node.children!.map((child, idx) => (
            <TreeNode key={`${child.name}-${idx}`} node={child} level={0} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OntologyView() {
  const [activeOntology, setActiveOntology] = useState('semikong');
  const currentOntology = defaultOntologies.find(o => o.id === activeOntology) || defaultOntologies[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Network size={24} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">Ontology</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-2">知识图谱本体结构 | Knowledge Graph Ontology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[var(--bg-secondary)] p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Ontology Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[var(--border-color)] pb-4">
            {defaultOntologies.map((ont) => (
              <button
                key={ont.id}
                onClick={() => setActiveOntology(ont.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeOntology === ont.id
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                  }
                `}
              >
                {ont.icon}
                {ont.name}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {currentOntology.stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-5 rounded-xl"
              >
                <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tree Structure */}
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
            {/* Tree Header */}
            <div className="px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <h3 className="font-bold text-[var(--text-primary)]">
                {currentOntology.name} Ontology Structure
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Click to expand categories • {currentOntology.rootNodes.length} top-level categories
              </p>
            </div>

            {/* Tree Content */}
            <div className="p-4">
              {currentOntology.rootNodes.length > 0 ? (
                currentOntology.rootNodes.map((node, idx) => (
                  <TreeNode 
                    key={`${node.name}-${idx}`} 
                    node={node} 
                    level={0} 
                    defaultExpanded={idx < 3}
                  />
                ))
              ) : (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                  <Layers size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No ontology data available</p>
                  <p className="text-sm mt-2">Import an ontology to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                <Layers size={10} className="text-blue-500" />
              </div>
              <span>Class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center">
                <Circle size={6} className="text-purple-500" />
              </div>
              <span>Property</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight size={14} className="text-[var(--text-secondary)]" />
              <span>Click to expand</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OntologyView;
