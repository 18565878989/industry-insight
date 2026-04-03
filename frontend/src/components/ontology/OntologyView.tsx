import { useState } from 'react';
import { ChevronRight, ChevronDown, Database, Layers, Network, GitBranch, Circle } from 'lucide-react';

interface OntologyNode {
  name: string;
  type: 'class' | 'property';
  count?: number;
  children?: OntologyNode[];
  description?: string;
  // 额外信息
  examples?: string[];      // 示例实体
  properties?: string[];    // 相关属性
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
          { 
            name: 'SemiconductorPhysics', 
            type: 'class', 
            count: 5, 
            description: '基础物理理论',
            children: [
              { name: 'BandTheory', type: 'class', count: 2, description: '能带理论' },
              { name: 'CarrierTransport', type: 'class', count: 3, description: '载流子传输' },
            ]
          },
          { 
            name: 'MaterialProperties', 
            type: 'class', 
            count: 4, 
            description: '材料特性',
            children: [
              { name: 'ElectricalProperties', type: 'class', count: 2, description: '电学特性' },
              { name: 'OpticalProperties', type: 'class', count: 2, description: '光学特性' },
            ]
          },
          { 
            name: 'QuantumEffects', 
            type: 'class', 
            count: 3, 
            description: '量子效应',
            children: [
              { name: 'TunnelingEffect', type: 'class', count: 1, description: '隧穿效应' },
              { name: 'QuantumConfinement', type: 'class', count: 2, description: '量子限域' },
            ]
          },
          { 
            name: 'DevicePhysics', 
            type: 'class', 
            count: 3, 
            description: '器件物理',
            children: [
              { name: 'PNJunction', type: 'class', count: 1, description: 'PN结' },
              { name: 'MOSPhysics', type: 'class', count: 2, description: 'MOS物理' },
            ]
          },
        ],
      },
      {
        name: 'DEVICES',
        type: 'class',
        count: 15,
        description: '半导体器件',
        children: [
          { 
            name: 'MOSFET', 
            type: 'class', 
            count: 4, 
            description: 'MOS晶体管',
            children: [
              { name: 'NMOS', type: 'class', count: 1, description: 'N型MOS' },
              { name: 'PMOS', type: 'class', count: 1, description: 'P型MOS' },
              { name: 'CMOS', type: 'class', count: 2, description: 'CMOS器件' },
            ]
          },
          { 
            name: 'BJT', 
            type: 'class', 
            count: 3, 
            description: '双极晶体管',
            children: [
              { name: 'NPN', type: 'class', count: 1, description: 'NPN型' },
              { name: 'PNP', type: 'class', count: 1, description: 'PNP型' },
              { name: 'HBT', type: 'class', count: 1, description: '异质结' },
            ]
          },
          { 
            name: 'MemoryDevices', 
            type: 'class', 
            count: 4, 
            description: '存储器件',
            children: [
              { name: 'SRAM', type: 'class', count: 1, description: '静态随机存取' },
              { name: 'DRAM', type: 'class', count: 1, description: '动态随机存取' },
              { name: 'Flash', type: 'class', count: 2, description: '闪存' },
            ]
          },
          { 
            name: 'PowerDevices', 
            type: 'class', 
            count: 4, 
            description: '功率器件',
            children: [
              { name: 'IGBT', type: 'class', count: 1, description: '绝缘栅双极' },
              { name: 'MOSFET_Power', type: 'class', count: 1, description: '功率MOS' },
              { name: 'SiC_Device', type: 'class', count: 2, description: '碳化硅器件' },
            ]
          },
        ],
      },
      {
        name: 'WFE',
        type: 'class',
        count: 250,
        description: '设备',
        children: [
          { 
            name: 'Lithography', 
            type: 'class', 
            count: 45, 
            description: '光刻机',
            children: [
              { 
                name: 'EUVL', 
                type: 'class', 
                count: 15, 
                description: '极紫外光刻',
                children: [
                  { name: 'EUVSource', type: 'class', count: 5, description: 'EUV光源' },
                  { name: 'EUVOptics', type: 'class', count: 5, description: 'EUV光学系统' },
                  { name: 'EUVMask', type: 'class', count: 5, description: 'EUV掩模' },
                ]
              },
              { 
                name: 'DUVL', 
                type: 'class', 
                count: 30, 
                description: '深紫外光刻',
                children: [
                  { name: 'ArFi', type: 'class', count: 10, description: '浸没式ArF' },
                  { name: 'KrF', type: 'class', count: 10, description: 'KrF激光' },
                  { name: 'iLine', type: 'class', count: 10, description: 'i线光刻' },
                ]
              },
            ]
          },
          { 
            name: 'Etch', 
            type: 'class', 
            count: 38, 
            description: '刻蚀机',
            children: [
              { 
                name: 'DryEtch', 
                type: 'class', 
                count: 28, 
                description: '干法刻蚀',
                children: [
                  { name: 'RIE', type: 'class', count: 10, description: '反应离子刻蚀' },
                  { name: 'ICP', type: 'class', count: 10, description: '电感耦合等离子体' },
                  { name: 'CCP', type: 'class', count: 8, description: '电容耦合等离子体' },
                ]
              },
              { name: 'WetEtch', type: 'class', count: 10, description: '湿法刻蚀' },
            ]
          },
          { 
            name: 'Deposition', 
            type: 'class', 
            count: 42, 
            description: '沉积设备',
            children: [
              { 
                name: 'CVD', 
                type: 'class', 
                count: 22, 
                description: '化学气相沉积',
                children: [
                  { name: 'PECVD', type: 'class', count: 8, description: '等离子体CVD' },
                  { name: 'LPCVD', type: 'class', count: 7, description: '低压CVD' },
                  { name: 'APCVD', type: 'class', count: 7, description: '常压CVD' },
                ]
              },
              { 
                name: 'PVD', 
                type: 'class', 
                count: 20, 
                description: '物理气相沉积',
                children: [
                  { name: 'Sputtering', type: 'class', count: 8, description: '磁控溅射' },
                  { name: 'Evaporation', type: 'class', count: 6, description: '热蒸发' },
                  { name: 'ALD', type: 'class', count: 6, description: '原子层沉积' },
                ]
              },
            ]
          },
          { 
            name: 'Inspection', 
            type: 'class', 
            count: 35, 
            description: '检测设备',
            children: [
              { name: 'OpticalInspection', type: 'class', count: 15, description: '光学检测' },
              { name: 'ElectronInspection', type: 'class', count: 12, description: '电子束检测' },
              { name: 'XrayInspection', type: 'class', count: 8, description: 'X射线检测' },
            ]
          },
          { 
            name: 'Packaging', 
            type: 'class', 
            count: 28, 
            description: '封装设备',
            children: [
              { name: 'WireBonding', type: 'class', count: 10, description: '引线键合' },
              { name: 'FlipChip', type: 'class', count: 10, description: '倒装芯片' },
              { name: 'DieAttach', type: 'class', count: 8, description: '芯片贴装' },
            ]
          },
        ],
      },
      {
        name: 'MATERIALS',
        type: 'class',
        count: 125,
        description: '材料',
        children: [
          { 
            name: 'Silicon', 
            type: 'class', 
            count: 18, 
            description: '硅材料',
            children: [
              { name: 'MonocrystallineSi', type: 'class', count: 6, description: '单晶硅' },
              { name: 'PolycrystallineSi', type: 'class', count: 6, description: '多晶硅' },
              { name: 'SiliconWafer', type: 'class', count: 6, description: '硅晶圆' },
            ]
          },
          { 
            name: 'CompoundSemiconductor', 
            type: 'class', 
            count: 25, 
            description: '化合物半导体',
            children: [
              { 
                name: 'III-V', 
                type: 'class', 
                count: 15, 
                description: 'III-V族化合物',
                children: [
                  { name: 'GaAs', type: 'class', count: 5, description: '砷化镓' },
                  { name: 'InP', type: 'class', count: 5, description: '磷化铟' },
                  { name: 'GaN', type: 'class', count: 5, description: '氮化镓' },
                ]
              },
              { 
                name: 'II-VI', 
                type: 'class', 
                count: 10, 
                description: 'II-VI族化合物',
                children: [
                  { name: 'ZnSe', type: 'class', count: 5, description: '硒化锌' },
                  { name: 'CdTe', type: 'class', count: 5, description: '碲化镉' },
                ]
              },
            ]
          },
          { 
            name: 'WideBandgap', 
            type: 'class', 
            count: 20, 
            description: '宽禁带半导体',
            children: [
              { name: 'SiC', type: 'class', count: 10, description: '碳化硅' },
              { name: 'GaN', type: 'class', count: 10, description: '氮化镓' },
            ]
          },
          { 
            name: 'Photoresist', 
            type: 'class', 
            count: 22, 
            description: '光刻胶',
            children: [
              { name: 'PositivePR', type: 'class', count: 8, description: '正性光刻胶' },
              { name: 'NegativePR', type: 'class', count: 8, description: '负性光刻胶' },
              { name: 'EUVPR', type: 'class', count: 6, description: 'EUV光刻胶' },
            ]
          },
          { 
            name: 'DopingMaterials', 
            type: 'class', 
            count: 16, 
            description: '掺杂材料',
            children: [
              { name: 'NTypeDopants', type: 'class', count: 8, description: 'N型掺杂剂' },
              { name: 'PTypeDopants', type: 'class', count: 8, description: 'P型掺杂剂' },
            ]
          },
        ],
      },
      {
        name: 'FOUNDRY_IDM',
        type: 'class',
        count: 76,
        description: '晶圆厂/IDM',
        children: [
          { 
            name: 'Foundry', 
            type: 'class', 
            count: 40, 
            description: '代工厂',
            children: [
              { 
                name: 'TSMC', 
                type: 'class', 
                count: 12, 
                description: '台积电',
                children: [
                  { name: 'TSMC_5nm', type: 'class', count: 3, description: '5nm产线' },
                  { name: 'TSMC_3nm', type: 'class', count: 3, description: '3nm产线' },
                  { name: 'TSMC_2nm', type: 'class', count: 3, description: '2nm产线' },
                  { name: 'TSMC_CoWoS', type: 'class', count: 3, description: '先进封装' },
                ]
              },
              { 
                name: 'Samsung_Foundry', 
                type: 'class', 
                count: 10, 
                description: '三星代工',
                children: [
                  { name: 'Samsung_3nm', type: 'class', count: 5, description: '3nm GAA' },
                  { name: 'Samsung_4nm', type: 'class', count: 5, description: '4nm FinFET' },
                ]
              },
              { 
                name: 'GlobalFoundries', 
                type: 'class', 
                count: 9, 
                description: '格芯',
                children: [
                  { name: 'GF_14nm', type: 'class', count: 3, description: '14nm' },
                  { name: 'GF_22nm', type: 'class', count: 3, description: '22nm FD-SOI' },
                  { name: 'GF_28nm', type: 'class', count: 3, description: '28nm' },
                ]
              },
              { 
                name: 'SMIC', 
                type: 'class', 
                count: 9, 
                description: '中芯国际',
                children: [
                  { name: 'SMIC_14nm', type: 'class', count: 3, description: '14nm' },
                  { name: 'SMIC_28nm', type: 'class', count: 3, description: '28nm' },
                  { name: 'SMIC_28nm_HK', type: 'class', count: 3, description: '28nm HKMG' },
                ]
              },
            ]
          },
          { 
            name: 'IDM', 
            type: 'class', 
            count: 36, 
            description: '集成器件制造商',
            children: [
              { 
                name: 'Intel', 
                type: 'class', 
                count: 11, 
                description: '英特尔',
                children: [
                  { name: 'Intel_Process', type: 'class', count: 5, description: '制程技术' },
                  { name: 'Intel_Products', type: 'class', count: 6, description: '产品线' },
                ]
              },
              { 
                name: 'Samsung_IDM', 
                type: 'class', 
                count: 10, 
                description: '三星电子',
                children: [
                  { name: 'Samsung_Memory', type: 'class', count: 5, description: '存储芯片' },
                  { name: 'Samsung_Logic', type: 'class', count: 5, description: '逻辑芯片' },
                ]
              },
              { 
                name: 'Micron', 
                type: 'class', 
                count: 8, 
                description: '美光',
                children: [
                  { name: 'DRAM_Products', type: 'class', count: 4, description: 'DRAM产品' },
                  { name: 'NAND_Products', type: 'class', count: 4, description: 'NAND产品' },
                ]
              },
              { 
                name: 'SK_Hynix', 
                type: 'class', 
                count: 7, 
                description: 'SK海力士',
                children: [
                  { name: 'Hynix_DRAM', type: 'class', count: 4, description: 'DRAM' },
                  { name: 'Hynix_NAND', type: 'class', count: 3, description: 'NAND' },
                ]
              },
            ]
          },
        ],
      },
      {
        name: 'FABLESS',
        type: 'class',
        count: 26,
        description: '无晶圆厂设计',
        children: [
          { 
            name: 'AI_Chips', 
            type: 'class', 
            count: 8, 
            description: 'AI芯片',
            children: [
              { 
                name: 'Training', 
                type: 'class', 
                count: 4, 
                description: '训练芯片',
                children: [
                  { name: 'Nvidia_A100', type: 'class', count: 2, description: 'A100' },
                  { name: 'Nvidia_H100', type: 'class', count: 2, description: 'H100' },
                ]
              },
              { 
                name: 'Inference', 
                type: 'class', 
                count: 4, 
                description: '推理芯片',
                children: [
                  { name: 'Infer_Chip_1', type: 'class', count: 2, description: '推理芯片A' },
                  { name: 'Infer_Chip_2', type: 'class', count: 2, description: '推理芯片B' },
                ]
              },
            ]
          },
          { 
            name: 'GPU_Designs', 
            type: 'class', 
            count: 6, 
            description: 'GPU设计',
            children: [
              { name: 'Gaming_GPU', type: 'class', count: 3, description: '游戏GPU' },
              { name: 'Professional_GPU', type: 'class', count: 3, description: '专业GPU' },
            ]
          },
          { 
            name: 'CPU_Cores', 
            type: 'class', 
            count: 7, 
            description: 'CPU核心',
            children: [
              { name: 'x86_Design', type: 'class', count: 4, description: 'x86架构' },
              { name: 'ARM_Design', type: 'class', count: 3, description: 'ARM架构' },
            ]
          },
          { 
            name: 'FPGA', 
            type: 'class', 
            count: 5, 
            description: '可编程逻辑',
            children: [
              { name: 'High-End_FPGA', type: 'class', count: 3, description: '高端FPGA' },
              { name: 'Mid-Range_FPGA', type: 'class', count: 2, description: '中端FPGA' },
            ]
          },
        ],
      },
      {
        name: 'EDA',
        type: 'class',
        count: 19,
        description: '设计工具',
        children: [
          { 
            name: 'Synthesis', 
            type: 'class', 
            count: 4, 
            description: '逻辑综合',
            children: [
              { name: 'LogicSynthesis', type: 'class', count: 2, description: '逻辑综合' },
              { name: 'DFT_Synthesis', type: 'class', count: 2, description: '可测性设计' },
            ]
          },
          { 
            name: 'PlaceRoute', 
            type: 'class', 
            count: 5, 
            description: '布局布线',
            children: [
              { name: 'Floorplanning', type: 'class', count: 2, description: '布局规划' },
              { name: 'Placement', type: 'class', count: 1, description: '布局' },
              { name: 'Routing', type: 'class', count: 2, description: '布线' },
            ]
          },
          { 
            name: 'Verification', 
            type: 'class', 
            count: 6, 
            description: '验证工具',
            children: [
              { name: 'Formal_Verification', type: 'class', count: 2, description: '形式验证' },
              { name: 'Timing_Verification', type: 'class', count: 2, description: '时序验证' },
              { name: 'Power_Verification', type: 'class', count: 2, description: '功耗验证' },
            ]
          },
          { 
            name: 'Simulation', 
            type: 'class', 
            count: 4, 
            description: '仿真工具',
            children: [
              { name: 'Circuit_Simulation', type: 'class', count: 2, description: '电路仿真' },
              { name: 'Timing_Simulation', type: 'class', count: 2, description: '时序仿真' },
            ]
          },
        ],
      },
      {
        name: 'SUPPLY_CHAIN',
        type: 'class',
        count: 21,
        description: '供应链',
        children: [
          { 
            name: 'RawMaterials', 
            type: 'class', 
            count: 6, 
            description: '原材料',
            children: [
              { name: 'Silicon_Material', type: 'class', count: 2, description: '硅原料' },
              { name: 'Chemical_Materials', type: 'class', count: 2, description: '化学材料' },
              { name: 'Gas_Materials', type: 'class', count: 2, description: '气体材料' },
            ]
          },
          { 
            name: 'Equipment', 
            type: 'class', 
            count: 8, 
            description: '设备供应',
            children: [
              { name: 'Equipment_Maintenance', type: 'class', count: 4, description: '设备维护' },
              { name: 'Equipment_Parts', type: 'class', count: 4, description: '备件供应' },
            ]
          },
          { 
            name: 'Logistics', 
            type: 'class', 
            count: 7, 
            description: '物流',
            children: [
              { name: 'Wafer_Logistics', type: 'class', count: 3, description: '晶圆物流' },
              { name: 'Chemical_Logistics', type: 'class', count: 4, description: '化学品物流' },
            ]
          },
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
