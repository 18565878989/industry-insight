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

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Define gradients and filters
    const defs = svg.append('defs');
    
    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

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

    // Apple-inspired color palette with gradients
    const stageColors: Record<string, string> = {
      'Design': '#8b5cf6',
      'EDA Tools': '#a855f7',
      'Manufacturing': '#3b82f6',
      'Equipment': '#06b6d4',
      'Materials': '#10b981',
      'Packaging/Testing': '#f59e0b',
      'End Products': '#ef4444',
    };

    const edgeColors: Record<string, string> = {
      'SUPPLIES': '#3b82f6',
      'COMPETES': '#ef4444',
      'PARTNERS': '#10b981',
      'INVESTS': '#8b5cf6',
      'ACQUIRES': '#f59e0b',
      'USES': '#06b6d4',
    };

    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(filteredEdges)
        .id((d) => d.id)
        .distance(180))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Edges with gradient and glow
    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', (d) => edgeColors[d.relationship_type] || '#94a3b8')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => Math.max(2, (d.strength || 5) / 2))
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this)
          .attr('stroke-opacity', 0.9)
          .attr('stroke-width', 4)
          .attr('filter', 'url(#glow)');
      })
      .on('mouseout', function(_, d) {
        d3.select(this)
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', Math.max(2, (d.strength || 5) / 2))
          .attr('filter', null);
      });

    // Nodes with Apple style
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

    // Node outer glow circle
    node.append('circle')
      .attr('r', (d) => Math.min(55, Math.max(22, (d.revenue || 0) / 5e10 + 22)) + 5)
      .attr('fill', (d) => stageColors[d.supply_chain_stage || ''] || '#64748b')
      .attr('opacity', 0.2)
      .attr('filter', 'url(#glow)');

    // Node main circle
    node.append('circle')
      .attr('r', (d) => Math.min(50, Math.max(18, (d.revenue || 0) / 5e10 + 18)))
      .attr('fill', (d) => stageColors[d.supply_chain_stage || ''] || '#64748b')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 4)
      .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))')
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
          .attr('r', Math.min(55, Math.max(22, (d.revenue || 0) / 5e10 + 22)))
          .style('filter', 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))');
      })
      .on('mouseout', function(_, d) {
        setHoveredNode(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.min(50, Math.max(18, (d.revenue || 0) / 5e10 + 18)))
          .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))');
      });

    // Node labels
    node.append('text')
      .text((d) => d.name.length > 16 ? d.name.substring(0, 16) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => Math.min(50, Math.max(18, (d.revenue || 0) / 5e10 + 18)) + 24)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#374151')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 1px 2px rgba(255,255,255,0.8)');

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
  }, [graphData, selectedTypes, navigate]);

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
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 font-semibold text-lg">Loading knowledge graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-alert apple-alert-error max-w-2xl mx-auto">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Error</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Controls - Apple Glass Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-black/5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          {/* Relationship Type Filters */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <Filter size={18} className="text-violet-600" />
            </div>
            <span className="text-sm font-bold text-gray-700">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relationshipTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleRelationshipType(type)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                  selectedTypes.includes(type)
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleZoomIn}
              className="p-3 bg-white/95 backdrop-blur-xl rounded-xl border border-black/5 hover:bg-white hover:shadow-lg transition-all duration-200"
              title="Zoom In"
            >
              <ZoomIn size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-3 bg-white/95 backdrop-blur-xl rounded-xl border border-black/5 hover:bg-white hover:shadow-lg transition-all duration-200"
              title="Zoom Out"
            >
              <ZoomOut size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-white/95 backdrop-blur-xl rounded-xl border border-black/5 hover:bg-white hover:shadow-lg transition-all duration-200"
              title="Reset"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph Container - Apple Card */}
      <div
        ref={containerRef}
        className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-black/5 overflow-hidden"
        style={{ height: '650px' }}
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Node Info Tooltip - Apple Glass */}
        {hoveredNode && !selectedNode && (
          <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-black/5 max-w-xs">
            <h4 className="font-bold text-gray-900 text-lg">{hoveredNode.name}</h4>
            <p className="text-sm text-violet-600 font-bold mt-1">{hoveredNode.supply_chain_stage}</p>
            {hoveredNode.revenue && (
              <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                Revenue: ${(hoveredNode.revenue / 1e9).toFixed(1)}B
              </p>
            )}
          </div>
        )}

        {/* Selected Node Panel - Apple Floating Panel */}
        {selectedNode && (
          <div
            className="absolute bg-white/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-black/5 max-w-sm z-10 animate-fade-in-up"
            style={{ 
              left: Math.min(selectedNode.x + 10, (containerRef.current?.clientWidth || 800) - 320), 
              top: Math.min(selectedNode.y + 10, (containerRef.current?.clientHeight || 600) - 280) 
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-xl">{selectedNode.node.name}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-violet-600 font-bold mb-3">{selectedNode.node.supply_chain_stage}</p>
            {selectedNode.node.sector && (
              <p className="text-sm text-gray-600 mb-5">{selectedNode.node.sector}</p>
            )}
            <button
              onClick={() => navigate(`/companies/${selectedNode.node.id}`)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
            >
              View Details
              <ExternalLink size={14} />
            </button>
          </div>
        )}

        {/* Legend - Apple Glass Panel */}
        <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-black/5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Supply Chain Stage</p>
          <div className="space-y-2.5">
            {[
              { stage: 'Design', color: '#8b5cf6' },
              { stage: 'EDA Tools', color: '#a855f7' },
              { stage: 'Manufacturing', color: '#3b82f6' },
              { stage: 'Equipment', color: '#06b6d4' },
              { stage: 'Materials', color: '#10b981' },
              { stage: 'Packaging/Testing', color: '#f59e0b' },
              { stage: 'End Products', color: '#ef4444' },
            ].map(({ stage, color }) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-600 font-semibold">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Badge */}
        <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-xl rounded-xl px-4 py-2 shadow-lg border border-black/5">
          <span className="text-sm font-bold text-gray-700">
            {graphData?.nodes.length || 0} nodes • {graphData?.edges.length || 0} edges
          </span>
        </div>
      </div>

      {/* Instructions - Apple Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Info size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg mb-3">How to use the Knowledge Graph</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Click and drag to move
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Scroll to zoom
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Click node for details
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Double-click for company
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
