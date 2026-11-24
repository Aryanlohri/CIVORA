import React, { useState, useRef } from 'react';
import { 
  Network, Info, ExternalLink, ShieldAlert, CheckCircle2, 
  Sparkles, ZoomIn, ZoomOut, RotateCcw, Droplets, Banknote, ShieldCheck, Sprout
} from 'lucide-react';

export default function ConvergenceGraph({ graphData, onSelectScheme, onSelectEdge }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdgeData, setSelectedEdgeData] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [zoomLevel, setZoomLevel] = useState(1);

  const containerRef = useRef(null);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
        <Network className="w-12 h-12 text-slate-600 mb-2 animate-pulse" />
        <p className="text-sm font-medium">Select a development objective to render convergence graph</p>
      </div>
    );
  }

  const { nodes, edges } = graphData;

  // Filter edges based on relationship
  const filteredEdges = edges.filter(e => {
    if (activeFilter === 'ALL') return true;
    return e.data?.relationship === activeFilter;
  });

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSelectedEdgeData(null);
    if (node.data?.id && onSelectScheme) {
      onSelectScheme(node.data.id);
    }
  };

  const handleEdgeClick = (edge) => {
    setSelectedEdgeData(edge);
    setSelectedNode(null);
    if (onSelectEdge) {
      onSelectEdge(edge.data);
    }
  };

  const getRelationshipColor = (rel) => {
    switch (rel) {
      case 'Co-funding': return '#10B981'; // Emerald
      case 'Complementary': return '#3B82F6'; // Blue
      case 'Sequential': return '#8B5CF6'; // Purple
      case 'Risk-Mitigation': return '#F59E0B'; // Amber
      case 'Input-Output': return '#06B6D4'; // Cyan
      default: return '#64748B';
    }
  };

  // Node position lookup
  const nodeMap = {};
  nodes.forEach(n => {
    nodeMap[n.id] = n;
  });

  return (
    <div className="relative bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      
      {/* Visualizer Header & Toolbar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Interactive Scheme Convergence Network
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 font-mono border border-blue-700/50">
            {nodes.length} Nodes • {filteredEdges.length} Convergence Links
          </span>
        </div>

        {/* Relationship Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 text-xs mr-1 hidden sm:inline">Links:</span>
          {['ALL', 'Co-funding', 'Complementary', 'Risk-Mitigation', 'Sequential', 'Input-Output'].map(filterKey => (
            <button
              key={filterKey}
              onClick={() => setActiveFilter(filterKey)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeFilter === filterKey
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.65))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setZoomLevel(1)}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[540px] overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        <svg 
          viewBox="0 0 1200 620" 
          className="w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Arrow Marker for Directed Links */}
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
            </marker>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Edges */}
          {filteredEdges.map(edge => {
            const sourceNode = nodeMap[edge.source];
            const targetNode = nodeMap[edge.target];
            if (!sourceNode || !targetNode) return null;

            const isPillarLink = edge.type === 'pillarLink';
            const color = isPillarLink ? '#334155' : getRelationshipColor(edge.data?.relationship);
            const isHovered = hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target);
            const isSelected = selectedEdgeData && selectedEdgeData.id === edge.id;

            const midX = (sourceNode.position.x + targetNode.position.x) / 2;
            const midY = (sourceNode.position.y + targetNode.position.y) / 2;

            return (
              <g key={edge.id} className="cursor-pointer transition-opacity duration-200" onClick={() => !isPillarLink && handleEdgeClick(edge)}>
                <line
                  x1={sourceNode.position.x}
                  y1={sourceNode.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke={color}
                  strokeWidth={isSelected ? 4 : (isHovered ? 3.5 : (isPillarLink ? 1.5 : 2.5))}
                  strokeDasharray={isPillarLink ? "4 4" : (edge.animated ? "6 3" : "none")}
                  opacity={isHovered || isSelected ? 1 : (hoveredNode ? 0.25 : 0.85)}
                  filter={isSelected ? "url(#glow)" : "none"}
                />

                {/* Edge Label for Inter-scheme Convergence */}
                {!isPillarLink && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-42"
                      y="-11"
                      width="84"
                      height="20"
                      rx="10"
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth="1.2"
                      opacity="0.95"
                    />
                    <text
                      textAnchor="middle"
                      y="3.5"
                      fill={color}
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map(node => {
            const isPillar = node.type === 'pillarNode';
            const isSelected = selectedNode && selectedNode.id === node.id;
            const isHovered = hoveredNode && hoveredNode.id === node.id;
            const isDimmed = hoveredNode && !isHovered && !edges.some(e => 
              (e.source === hoveredNode.id && e.target === node.id) ||
              (e.target === hoveredNode.id && e.source === node.id)
            );

            if (isPillar) {
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.position.x}, ${node.position.y})`}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <rect
                    x="-80"
                    y="-22"
                    width="160"
                    height="44"
                    rx="12"
                    fill="#1e293b"
                    stroke={node.data.color}
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  <text
                    textAnchor="middle"
                    y="4"
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    {node.data.label}
                  </text>
                </g>
              );
            }

            // Scheme Node
            const color = node.data.color || '#3B82F6';
            return (
              <g
                key={node.id}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                opacity={isDimmed ? 0.35 : 1}
              >
                {/* Node Outer Circle / Glow */}
                <circle
                  r={isSelected ? "44" : "36"}
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth={isSelected ? "4" : "2.5"}
                  filter={isSelected || isHovered ? "url(#glow)" : "none"}
                />

                {/* Inner decorative ring */}
                <circle
                  r="30"
                  fill={`${color}15`}
                  stroke={`${color}40`}
                  strokeWidth="1"
                />

                {/* Scheme Code Text */}
                <text
                  textAnchor="middle"
                  y="-2"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  {node.data.code}
                </text>

                {/* Level Tag (Central/State) */}
                <text
                  textAnchor="middle"
                  y="12"
                  fill={color}
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {node.data.level}
                </text>

                {/* Tooltip on Hover */}
                {isHovered && (
                  <g transform="translate(0, -50)">
                    <rect
                      x="-90"
                      y="-18"
                      width="180"
                      height="26"
                      rx="6"
                      fill="#020617"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="-1"
                      fill="#e2e8f0"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {node.data.name.slice(0, 26)}...
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Node Details Card */}
        {selectedNode && selectedNode.type === 'schemeNode' && (
          <div className="absolute top-4 right-4 max-w-sm w-80 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase tracking-wide">
                  {selectedNode.data.level} Scheme
                </span>
                <h4 className="text-sm font-extrabold text-white mt-1">
                  {selectedNode.data.name}
                </h4>
                <p className="text-xs text-blue-400 font-mono">
                  {selectedNode.data.code} {selectedNode.data.hindi_name && `• ${selectedNode.data.hindi_name}`}
                </p>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <b>Primary Benefit:</b> {selectedNode.data.benefit_summary}
            </p>

            <div className="mt-2.5 space-y-1 text-[11px] text-slate-400">
              <p><b>Department:</b> {selectedNode.data.department}</p>
              <p><b>Target:</b> {selectedNode.data.target_beneficiary}</p>
            </div>

            <button
              onClick={() => onSelectScheme(selectedNode.data.id)}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Scheme Dossier</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Floating Edge / Synergy Detail Card */}
        {selectedEdgeData && (
          <div className="absolute bottom-4 left-4 max-w-md bg-slate-900/95 border border-emerald-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Convergence Link: {selectedEdgeData.label}
                </span>
              </div>
              <button 
                onClick={() => setSelectedEdgeData(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-200">
              <p className="font-semibold text-white"><b>Synergy Rationale:</b></p>
              <p className="mt-0.5 text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                {selectedEdgeData.data?.reason}
              </p>
            </div>

            {selectedEdgeData.data?.sop && (
              <div className="mt-2 text-[11px] text-slate-300">
                <p className="font-bold text-blue-300"><b>District Officer Implementation SOP:</b></p>
                <p className="mt-0.5 text-slate-400">{selectedEdgeData.data.sop}</p>
              </div>
            )}

            {selectedEdgeData.data?.conflicts && (
              <div className="mt-2 flex items-start gap-1.5 text-[11px] bg-amber-950/50 text-amber-200 p-2 rounded border border-amber-800/60">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><b>Safeguard:</b> {selectedEdgeData.data.conflicts}</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Legend Footer */}
      <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-300">Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Co-funding (Direct Stack)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Complementary (Liquidity to Capital)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Risk Shielding</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Input-to-Output</span>
        </div>
        <span className="text-[11px] text-slate-400">Click any node or link to inspect operational synergy</span>
      </div>

    </div>
  );
}
