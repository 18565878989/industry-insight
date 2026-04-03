import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { relationshipsApi } from '../../services/api';
import type { GraphData, GraphNode, GraphEdge } from '../../types';
import { Filter, ZoomIn, ZoomOut, RefreshCw, Info, X, ExternalLink } from 'lucide-react';

interface SelectedNode {
  node: GraphNode;
  x: number;
  y: number;
}

// Theme-aware graph colors
const getGraphColors = () => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
    document.documentElement.getAttribute('data-theme') !== 'light';
  
  if (isDark) {
    return {
      background: '#000000',
      stageColors: {
        'Design': '#ffffff',
        'EDA Tools': '#b3b3b3',
        'Manufacturing': '#666666',
        'Equipment': '#888888',
        'Materials': '#E31937',
        'Packaging/Testing': '#1B9AF7',
        'End Products': '#b3b3b3',
      },
      edgeColors: {
        'SUPPLIES': '#666666',
        'SUPPLIES_TO': '#666666',
        'COMPETES': '#E31937',
        'COMPETES_WITH': '#E31937',
        'MANUFACTURES': '#ffffff',
        'PARTNERS': '#1B9AF7',
        'INVESTS': '#888888',
        'ACQUIRES': '#666666',
        'USES': '#b3b3b3',
      },
      textColor: '#ffffff',
      strokeColor: '#000000',
      legendBg: '#0a0a0a',
      tooltipBg: '#0a0a0a',
      tooltipBorder: 'rgba(255,255,255,0.06)',
    };
  } else {
    return {
      background: '#ffffff',
      stageColors: {
        'Design': '#1d1d1f',
        'EDA Tools': '#86868b',
        'Manufacturing': '#1d1d1f',
        'Equipment': '#86868b',
        'Materials': '#E31937',
        'Packaging/Testing': '#007AFF',
        'End Products': '#86868b',
      },
      edgeColors: {
        'SUPPLIES': '#86868b',
        'SUPPLIES_TO': '#86868b',
        'COMPETES': '#E31937',
        'COMPETES_WITH': '#E31937',
        'MANUFACTURES': '#1d1d1f',
        'PARTNERS': '#007AFF',
        'INVESTS': '#86868b',
        'ACQUIRES': '#86868b',
        'USES': '#86868b',
      },
      textColor: '#1d1d1f',
      strokeColor: '#ffffff',
      legendBg: '#f8fafc',
      tooltipBg: '#f8fafc',
      tooltipBorder: '#e5e7eb',
    };
  }
};

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [relationshipTypes, setRelationshipTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [graphColors, setGraphColorsState] = useState(getGraphColors);

  useEffect(() => {
    const handleThemeChange = () => setGraphColorsState(getGraphColors());
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, types] = await Promise.all([
          relationshipsApi.getGraphData(),
          relationshipsApi.getTypes(),
        ]);
        setGraphData(data);
        setRelationshipTypes(types);
      } catch (err) {
        setError('Failed to load graph data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!graphData || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const colors = getGraphColors();

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', colors.background);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    const filteredEdges = selectedTypes.length === 0
      ? graphData.edges
      : graphData.edges.filter((e) => selectedTypes.includes(e.relationship_type));

    const filteredNodeIds = new Set<number>();
    filteredEdges.forEach((e) => {
      filteredNodeIds.add(e.source as number);
      filteredNodeIds.add(e.target as number);
    });

    const filteredNodes = graphData.nodes.filter((n) => filteredNodeIds.has(n.id));

    const stageColors = colors.stageColors;
    const edgeColors = colors.edgeColors;

    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(filteredEdges)
        .id((d) => d.id)
        .distance(180))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', (d) => edgeColors[d.relationship_type as keyof typeof edgeColors] || '#666666')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d) => Math.max(1, (d.strength || 5) / 3))
      .style('cursor', 'pointer');

    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<any, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    node.append('circle')
      .attr('r', (d) => Math.min(50, Math.max(18, (d.revenue || 0) / 5e10 + 18)))
      .attr('fill', (d) => stageColors[(d.supply_chain_stage || '') as keyof typeof stageColors] || '#666666')
      .attr('stroke', colors.strokeColor)
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        const rect = container.getBoundingClientRect();
        setSelectedNode({
          node: d,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      })
      .on('dblclick', (_, d) => {
        navigate(`/companies/${d.id}`);
      })
      .on('mouseover', function(_, d) {
        setHoveredNode(d);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.min(55, Math.max(22, (d.revenue || 0) / 5e10 + 22)));
      })
      .on('mouseout', function(_, d) {
        setHoveredNode(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.min(50, Math.max(18, (d.revenue || 0) / 5e10 + 18)));
      });

    node.append('text')
      .text((d) => d.name.length > 16 ? d.name.substring(0, 16) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => Math.min(50, Math.max(18, (d.revenue || 0) / 5e10 + 18)) + 22)
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', colors.textColor);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    const initialScale = 0.75;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );

    return () => {
      simulation.stop();
    };
  }, [graphData, selectedTypes, navigate, graphColors]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        1.3
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        0.7
      );
    }
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedNode(null);
  };

  const toggleRelationshipType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border border-[var(--border-color)] border-t-[var(--text-primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm font-medium">Loading knowledge graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16 px-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
          <p className="text-[var(--text-primary)] font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-px">
      {/* Hero */}
      <div className="bg-[var(--bg-primary)] px-8 py-16 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">Network Visualization</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            Knowledge<br />Graph
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[var(--bg-secondary)] px-8 py-5 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center">
              <Filter size={16} className="text-[var(--text-secondary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relationshipTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleRelationshipType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleZoomIn}
              className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} className="text-[var(--text-secondary)]" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} className="text-[var(--text-secondary)]" />
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors"
              title="Reset"
            >
              <RefreshCw size={18} className="text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: '600px', backgroundColor: graphColors.background }}
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Node Info Tooltip */}
        {hoveredNode && !selectedNode && (
          <div 
            className="absolute top-4 left-4 px-4 py-3 max-w-xs"
            style={{ backgroundColor: graphColors.tooltipBg, border: `1px solid ${graphColors.tooltipBorder}` }}
          >
            <h4 className="font-bold text-[var(--text-primary)] text-sm">{hoveredNode.name}</h4>
            <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">{hoveredNode.supply_chain_stage}</p>
            {hoveredNode.revenue && (
              <p className="text-sm text-[var(--text-secondary)] mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                Revenue: ${(hoveredNode.revenue / 1e9).toFixed(1)}B
              </p>
            )}
          </div>
        )}

        {/* Selected Node Panel */}
        {selectedNode && (
          <div
            className="absolute px-5 py-4 max-w-sm z-10"
            style={{ 
              left: Math.min(selectedNode.x + 10, (containerRef.current?.clientWidth || 800) - 320), 
              top: Math.min(selectedNode.y + 10, (containerRef.current?.clientHeight || 600) - 280),
              backgroundColor: graphColors.tooltipBg,
              border: `1px solid ${graphColors.tooltipBorder}`
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-[var(--text-primary)] text-base">{selectedNode.node.name}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] rounded transition-colors"
              >
                <X size={14} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium mb-2">{selectedNode.node.supply_chain_stage}</p>
            {selectedNode.node.sector && (
              <p className="text-sm text-[var(--text-secondary)] mb-4">{selectedNode.node.sector}</p>
            )}
            <button
              onClick={() => navigate(`/companies/${selectedNode.node.id}`)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold rounded hover:opacity-90 transition-opacity"
            >
              View Details
              <ExternalLink size={14} />
            </button>
          </div>
        )}

        {/* Legend */}
        <div 
          className="absolute bottom-4 left-4 px-4 py-3"
          style={{ backgroundColor: graphColors.legendBg, border: `1px solid ${graphColors.tooltipBorder}` }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Supply Chain</p>
          <div className="space-y-2">
            {[
              { stage: 'Design', color: graphColors.stageColors['Design'] },
              { stage: 'EDA Tools', color: graphColors.stageColors['EDA Tools'] },
              { stage: 'Manufacturing', color: graphColors.stageColors['Manufacturing'] },
              { stage: 'Equipment', color: graphColors.stageColors['Equipment'] },
              { stage: 'Materials', color: graphColors.stageColors['Materials'] },
              { stage: 'Packaging/Testing', color: graphColors.stageColors['Packaging/Testing'] },
              { stage: 'End Products', color: graphColors.stageColors['End Products'] },
            ].map(({ stage, color }) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-[var(--text-secondary)] font-medium">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Badge */}
        <div 
          className="absolute top-4 right-4 px-3 py-1.5"
          style={{ backgroundColor: graphColors.legendBg, border: `1px solid ${graphColors.tooltipBorder}` }}
        >
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {graphData?.nodes.length || 0} nodes • {graphData?.edges.length || 0} edges
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[var(--bg-secondary)] px-8 py-6 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex items-start gap-4">
          <div className="w-8 h-8 bg-[var(--bg-hover)] rounded flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base mb-3">How to use the Knowledge Graph</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 bg-[var(--text-faint)] rounded-full" />
                Click and drag to move
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 bg-[var(--text-faint)] rounded-full" />
                Scroll to zoom
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 bg-[var(--text-faint)] rounded-full" />
                Click node for details
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 bg-[var(--text-faint)] rounded-full" />
                Double-click for company
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
