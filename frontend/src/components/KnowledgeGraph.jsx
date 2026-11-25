import React, { useState, useMemo } from 'react';
import { Share2, Info } from 'lucide-react';

export default function KnowledgeGraph({ paper }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'authors', 'topics'

  // Dimensions
  const width = 740;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;

  // Build Graph Nodes & Links
  const { nodes, links } = useMemo(() => {
    const nodeList = [];
    const linkList = [];

    // 1. Center Paper Node
    const paperNode = {
      id: 'paper-root',
      type: 'paper',
      label: paper?.title ? (paper.title.length > 28 ? paper.title.slice(0, 26) + '...' : paper.title) : 'Preprint',
      fullLabel: paper?.title || 'Academic Preprint',
      sub: `arXiv:${paper?.arxiv_id}`,
      x: centerX,
      y: centerY,
      radius: 28,
      color: '#2563eb',
      textColor: '#ffffff',
    };
    nodeList.push(paperNode);

    // 2. Author Nodes (up to 6)
    const authors = (paper?.authors || []).slice(0, 6);
    const authorRadius = 135;
    const authorAngleStep = authors.length > 1 ? (Math.PI * 1.1) / (authors.length - 1) : 0;
    const authorAngleStart = -Math.PI * 1.05;

    if (filterMode === 'all' || filterMode === 'authors') {
      authors.forEach((author, i) => {
        const angle = authors.length === 1 ? -Math.PI / 2 : authorAngleStart + i * authorAngleStep;
        const x = centerX + Math.cos(angle) * authorRadius;
        const y = centerY + Math.sin(angle) * (authorRadius * 0.75);

        const aNode = {
          id: `author-${i}`,
          type: 'author',
          label: author.name.length > 15 ? author.name.slice(0, 14) + '...' : author.name,
          fullLabel: author.name,
          sub: author.affiliation || 'Researcher',
          x,
          y,
          radius: 18,
          color: '#7c3aed',
          textColor: '#ffffff',
        };
        nodeList.push(aNode);
        linkList.push({ source: paperNode, target: aNode, type: 'author' });
      });
    }

    // 3. Category / Domain Taxonomy Node
    if (paper?.category && (filterMode === 'all' || filterMode === 'topics')) {
      const catNode = {
        id: 'category-root',
        type: 'category',
        label: paper.category,
        fullLabel: `Domain: ${paper.category}`,
        sub: 'Primary arXiv Taxonomy',
        x: centerX + 180,
        y: centerY - 65,
        radius: 22,
        color: '#059669',
        textColor: '#ffffff',
      };
      nodeList.push(catNode);
      linkList.push({ source: paperNode, target: catNode, type: 'category' });
    }

    // 4. Extracted Keywords / Concept Nodes (up to 4)
    const keywords = (paper?.summary?.keywords || []).slice(0, 4);
    if (keywords.length > 0 && (filterMode === 'all' || filterMode === 'topics')) {
      const kwRadius = 145;
      const kwAngleStep = keywords.length > 1 ? (Math.PI * 0.9) / (keywords.length - 1) : 0;
      const kwAngleStart = Math.PI * 0.1;

      keywords.forEach((kw, i) => {
        const angle = keywords.length === 1 ? Math.PI / 2 : kwAngleStart + i * kwAngleStep;
        const x = centerX + Math.cos(angle) * kwRadius;
        const y = centerY + Math.sin(angle) * (kwRadius * 0.72);

        const kwNode = {
          id: `kw-${i}`,
          type: 'keyword',
          label: `#${kw}`,
          fullLabel: `Taxonomy Theme: ${kw}`,
          sub: 'Extracted Scientific Concept',
          x,
          y,
          radius: 17,
          color: '#d97706',
          textColor: '#ffffff',
        };
        nodeList.push(kwNode);
        linkList.push({ source: paperNode, target: kwNode, type: 'keyword' });
      });
    }

    return { nodes: nodeList, links: linkList };
  }, [paper, filterMode, centerX, centerY]);

  return (
    <div className="academic-card" style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
      {/* Header Bar */}
      <div style={{ padding: '1.25rem 1.75rem', backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Citation & Co-Author Knowledge Graph
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Interactive relational topology connecting authors, preprints, and domain concepts
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#ffffff', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterMode === 'all' ? 'var(--accent-primary-light)' : 'transparent',
              color: filterMode === 'all' ? 'var(--accent-primary)' : 'var(--text-muted)',
            }}
          >
            All Connections
          </button>
          <button
            onClick={() => setFilterMode('authors')}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterMode === 'authors' ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
              color: filterMode === 'authors' ? '#7c3aed' : 'var(--text-muted)',
            }}
          >
            Authors Only
          </button>
          <button
            onClick={() => setFilterMode('topics')}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterMode === 'topics' ? 'rgba(217, 119, 6, 0.12)' : 'transparent',
              color: filterMode === 'topics' ? '#d97706' : 'var(--text-muted)',
            }}
          >
            Taxonomy & Concepts
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div style={{ position: 'relative', backgroundColor: '#fafbfc', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', maxWidth: `${width}px`, height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Subtle Grid Pattern */}
            <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.75" fill="#cbd5e1" />
            </pattern>
            {/* Glow Filter */}
            <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width={width} height={height} fill="url(#graph-grid)" />

          {/* Connection Lines */}
          {links.map((link, idx) => {
            const isHighlighted = hoveredNode && (hoveredNode.id === link.source.id || hoveredNode.id === link.target.id);
            return (
              <line
                key={`link-${idx}`}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke={isHighlighted ? link.target.color : '#cbd5e1'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={link.type === 'keyword' ? '4 3' : undefined}
                style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
              >
                {/* Node Outer Circle */}
                <circle
                  r={isHovered ? node.radius + 4 : node.radius}
                  fill={node.color}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  filter="url(#node-shadow)"
                  style={{ transition: 'r 0.2s ease' }}
                />

                {/* Node Inner Icon / Initial */}
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fill={node.textColor}
                  fontSize={node.radius > 20 ? '11px' : '9px'}
                  fontWeight={700}
                  fontFamily="sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.type === 'paper' ? 'DOC' : node.type === 'author' ? '👤' : node.type === 'category' ? 'TAG' : '#'}
                </text>

                {/* Node Label Below */}
                <text
                  textAnchor="middle"
                  y={node.radius + 14}
                  fill="var(--text-main)"
                  fontSize="11px"
                  fontWeight={node.type === 'paper' ? 700 : 500}
                  fontFamily="var(--font-sans)"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Information Tooltip Card */}
        {hoveredNode && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              backgroundColor: '#ffffff',
              padding: '0.65rem 1rem',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: `1px solid ${hoveredNode.color}`,
              fontSize: '0.8125rem',
              maxWidth: '320px',
              pointerEvents: 'none',
              animation: 'fadeIn 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: hoveredNode.color }}>
              <Info size={14} />
              <span>{hoveredNode.fullLabel}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {hoveredNode.sub}
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div style={{ padding: '0.85rem 1.75rem', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'inline-block' }} />
            <span>Target Paper</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'inline-block' }} />
            <span>Co-Authors ({paper?.authors?.length || 0})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
            <span>arXiv Classification ({paper?.category || 'cs.AI'})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706', display: 'inline-block' }} />
            <span>Scientific Themes</span>
          </div>
        </div>
        <span style={{ fontStyle: 'italic', fontSize: '0.6875rem' }}>
          Hover nodes to inspect topology
        </span>
      </div>
    </div>
  );
}
