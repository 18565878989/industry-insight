import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { relationshipsApi } from '../../services/api';
import type { GraphData, GraphNode, GraphEdge } from '../../types';
import { Filter, ZoomIn, ZoomOut, RefreshCw, Info } from 'lucide-react';

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

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Filter edges based on selected relationship types
    const filteredEdges = selectedTypes.length === 0
      ? graphData.edges
      : graphData.edges.filter((e) => selectedTypes.includes(e.relationship_type));

    const filteredNodeIds = new Set<number>();
    filteredEdges.forEach((e) => {
      filteredNodeIds.add(e.source as number);
      filteredNodeIds.add(e.target as number);
    });

    const filteredNodes = graphData.nodes.filter((n) => filteredNodeIds.has(n.id));

    // Color scale for supply chain stages
    const stageColors: Record<string, string> = {
      'Design': '#8b5cf6',
      'EDA Tools': '#a855f7',
      'Manufacturing': '#3b82f6',
      'Equipment': '#06b6d4',
      'Materials': '#10b981',
      'Packaging/Testing': '#f59e0b',
      'End Products': '#ef4444',
    };

    // Edge color scale
    const edgeColors: Record<string, string> = {
      'SUPPLIES': '#3b82f6',
      'COMPETES': '#ef4444',
      'PARTNERS': '#10b981',
      'INVESTS': '#8b5cf6',
      'ACQUIRES': '#f59e0b',
      'USES': '#06b6d4',
    };

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(filteredEdges)
        .id((d) => d.id)
        .distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Draw edges
    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', (d) => edgeColors[d.relationship_type] || '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.max(1, (d.strength || 5) / 2))
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('stroke-opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-opacity', 0.6);
      });

    // Draw nodes
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

    // Node circles
    node.append('circle')
      .attr('r', (d) => Math.min(40, Math.max(15, (d.revenue || 0) / 5e10 + 15)))
      .attr('fill', (d) => stageColors[d.supply_chain_stage || ''] || '#64748b')
      .attr('stroke', '#fff')
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
      .on('mouseover', (_, d) => {
        setHoveredNode(d);
      })
      .on('mouseout', () => {
        setHoveredNode(null);
      });

    // Node labels
    node.append('text')
      .text((d) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => Math.min(40, Math.max(15, (d.revenue || 0) / 5e10 + 15)) + 15)
      .attr('font-size', '10px')
      .attr('fill', '#475569')
      .attr('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Zoom to fit
    const initialScale = 0.8;
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
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        1.3
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Relationship Type Filters */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm text-slate-600 font-medium">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relationshipTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleRelationshipType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} className="text-slate-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} className="text-slate-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset"
            >
              <RefreshCw size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        style={{ height: '600px' }}
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Node Info Tooltip */}
        {hoveredNode && !selectedNode && (
          <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg border border-slate-200 max-w-xs">
            <h4 className="font-semibold text-slate-800">{hoveredNode.name}</h4>
            <p className="text-sm text-slate-500">{hoveredNode.supply_chain_stage}</p>
            {hoveredNode.revenue && (
              <p className="text-sm text-slate-600 mt-1">
                Revenue: ${(hoveredNode.revenue / 1e9).toFixed(1)}B
              </p>
            )}
          </div>
        )}

        {/* Selected Node Panel */}
        {selectedNode && (
          <div
            className="absolute bg-white rounded-lg p-4 shadow-lg border border-slate-200 max-w-xs"
            style={{ left: Math.min(selectedNode.x + 10, containerRef.current!.clientWidth - 280), top: Math.min(selectedNode.y + 10, containerRef.current!.clientHeight - 200) }}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-slate-800">{selectedNode.node.name}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-slate-500">{selectedNode.node.supply_chain_stage}</p>
            {selectedNode.node.sector && (
              <p className="text-sm text-slate-600 mt-1">{selectedNode.node.sector}</p>
            )}
            <button
              onClick={() => navigate(`/companies/${selectedNode.node.id}`)}
              className="mt-3 w-full px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              View Details
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-2">Supply Chain Stage</p>
          <div className="space-y-1">
            {[
              { stage: 'Design', color: '#8b5cf6' },
              { stage: 'EDA Tools', color: '#a855f7' },
              { stage: 'Manufacturing', color: '#3b82f6' },
              { stage: 'Equipment', color: '#06b6d4' },
              { stage: 'Materials', color: '#10b981' },
              { stage: 'Packaging/Testing', color: '#f59e0b' },
              { stage: 'End Products', color: '#ef4444' },
            ].map(({ stage, color }) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-600">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-slate-400 mt-0.5" />
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">How to use the Knowledge Graph</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Click and drag nodes to move them</li>
              <li>Scroll to zoom in/out</li>
              <li>Click a node to see details</li>
              <li>Double-click a node to go to company page</li>
              <li>Use filters to show specific relationship types</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
