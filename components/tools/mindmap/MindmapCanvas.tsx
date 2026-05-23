'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { MindmapContent, MindmapBranch, MindmapChild } from '@/types';

interface Props {
  content: MindmapContent;
  onContentChange?: (content: MindmapContent) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

export function MindmapCanvas({ content, onContentChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -600, y: -400, w: 1200, h: 800 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<{ branch: MindmapBranch; child?: MindmapChild } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const branches = content.branches;
  const angleStep = (2 * Math.PI) / branches.length;
  const branchRadius = 220;
  const childRadius = 140;

  function branchPosition(index: number): NodePosition {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: Math.cos(angle) * branchRadius,
      y: Math.sin(angle) * branchRadius,
    };
  }

  function childPosition(branchIndex: number, childIndex: number, totalChildren: number): NodePosition {
    const branchAngle = branchIndex * angleStep - Math.PI / 2;
    const spreadAngle = (totalChildren === 1) ? 0 : (Math.PI / 3) * (childIndex / (totalChildren - 1) - 0.5);
    const childAngle = branchAngle + spreadAngle;
    const bp = branchPosition(branchIndex);
    return {
      x: bp.x + Math.cos(childAngle) * childRadius,
      y: bp.y + Math.sin(childAngle) * childRadius,
    };
  }

  function handleMouseDown(e: React.MouseEvent) {
    if ((e.target as Element).closest('.node')) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    const dx = (e.clientX - dragStart.x) * (viewBox.w / (svgRef.current?.clientWidth || 1));
    const dy = (e.clientY - dragStart.y) * (viewBox.h / (svgRef.current?.clientHeight || 1));
    setViewBox((v) => ({ ...v, x: v.x - dx, y: v.y - dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox((v) => ({
      x: v.x + (v.w * (1 - scale)) / 2,
      y: v.y + (v.h * (1 - scale)) / 2,
      w: v.w * scale,
      h: v.h * scale,
    }));
  }

  function startEdit(id: string, currentLabel: string, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(currentLabel);
  }

  function saveEdit(branchIndex: number, childIndex?: number) {
    if (!onContentChange || editingId === null) return;
    const updated = JSON.parse(JSON.stringify(content)) as MindmapContent;
    if (childIndex !== undefined) {
      updated.branches[branchIndex].children[childIndex].label = editValue;
    } else {
      updated.branches[branchIndex].label = editValue;
    }
    onContentChange(updated);
    setEditingId(null);
  }

  return (
    <div className="relative w-full" style={{ height: '500px' }}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-[#F5F5F7] rounded-2xl select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onWheel={handleWheel}
      >
        {/* Lines from center to branches */}
        {branches.map((branch, bi) => {
          const bp = branchPosition(bi);
          return (
            <line key={`line-${bi}`} x1={0} y1={0} x2={bp.x} y2={bp.y} stroke={branch.color} strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />
          );
        })}

        {/* Lines from branches to children */}
        {branches.map((branch, bi) =>
          branch.children.map((child, ci) => {
            const bp = branchPosition(bi);
            const cp = childPosition(bi, ci, branch.children.length);
            return (
              <line key={`cline-${bi}-${ci}`} x1={bp.x} y1={bp.y} x2={cp.x} y2={cp.y} stroke={branch.color} strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" strokeDasharray="4 2" />
            );
          })
        )}

        {/* Branch nodes */}
        {branches.map((branch, bi) => {
          const bp = branchPosition(bi);
          const isEditing = editingId === branch.id;
          return (
            <g key={branch.id} className="node" transform={`translate(${bp.x}, ${bp.y})`} onClick={() => setSelectedNode({ branch })} style={{ cursor: 'pointer' }}>
              <ellipse rx={70} ry={24} fill={branch.color} fillOpacity="0.15" stroke={branch.color} strokeWidth="2" />
              {isEditing ? (
                <foreignObject x={-65} y={-18} width={130} height={36}>
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(bi)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(bi); if (e.key === 'Escape') setEditingId(null); }}
                    className="w-full text-center text-xs bg-white border border-gray-300 rounded px-1 py-1 outline-none"
                  />
                </foreignObject>
              ) : (
                <text textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={600} fill={branch.color} onDoubleClick={(e) => startEdit(branch.id, branch.label, e)}>
                  {branch.label.length > 14 ? branch.label.substring(0, 14) + '…' : branch.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Child nodes */}
        {branches.map((branch, bi) =>
          branch.children.map((child, ci) => {
            const cp = childPosition(bi, ci, branch.children.length);
            const isEditing = editingId === child.id;
            return (
              <g key={child.id} className="node" transform={`translate(${cp.x}, ${cp.y})`} onClick={() => setSelectedNode({ branch, child })} style={{ cursor: 'pointer' }}>
                <ellipse rx={54} ry={18} fill="white" stroke={branch.color} strokeWidth="1.5" strokeOpacity="0.6" />
                {isEditing ? (
                  <foreignObject x={-50} y={-14} width={100} height={28}>
                    <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit(bi, ci)} onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(bi, ci); if (e.key === 'Escape') setEditingId(null); }} className="w-full text-center text-[10px] bg-white border border-gray-300 rounded outline-none" />
                  </foreignObject>
                ) : (
                  <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#374151" onDoubleClick={(e) => startEdit(child.id, child.label, e)}>
                    {child.label.length > 12 ? child.label.substring(0, 12) + '…' : child.label}
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Central Node */}
        <g className="node">
          <ellipse rx={80} ry={30} className="brand-gradient" fill="#E85D1E" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill="white">
            {content.central_node.length > 14 ? content.central_node.substring(0, 14) + '…' : content.central_node}
          </text>
        </g>
      </svg>

      {/* Details panel */}
      {selectedNode && (
        <div className="absolute right-3 top-3 bg-white rounded-xl border border-[#E0E0EC] shadow-lg p-4 max-w-xs w-full">
          <button onClick={() => setSelectedNode(null)} className="float-right text-[#6B6B8A] hover:text-[#0F0F1A] text-xs">✕</button>
          {selectedNode.child ? (
            <>
              <p className="font-jakarta font-semibold text-sm text-[#0F0F1A] mb-1">{selectedNode.child.label}</p>
              <p className="text-xs text-[#6B6B8A]">{selectedNode.child.detail}</p>
            </>
          ) : (
            <>
              <p className="font-jakarta font-semibold text-sm mb-1" style={{ color: selectedNode.branch.color }}>{selectedNode.branch.label}</p>
              <p className="text-xs text-[#6B6B8A]">{selectedNode.branch.children.length} sub-concepts</p>
            </>
          )}
        </div>
      )}
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#6B6B8A]">Scroll to zoom · Drag to pan · Double-click node to edit</p>
    </div>
  );
}
