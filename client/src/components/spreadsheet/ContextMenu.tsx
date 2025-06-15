import { useState, useEffect } from "react";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onInsertColumnLeft: () => void;
  onInsertColumnRight: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onFormatCells: () => void;
}

export default function ContextMenu({
  visible,
  x,
  y,
  onClose,
  onCut,
  onCopy,
  onPaste,
  onInsertRowAbove,
  onInsertRowBelow,
  onInsertColumnLeft,
  onInsertColumnRight,
  onDeleteRow,
  onDeleteColumn,
  onFormatCells,
}: ContextMenuProps) {
  useEffect(() => {
    const handleClickOutside = () => {
      onClose();
    };

    if (visible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-48"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onCut}>
        <span>✂️</span> 切り取り
      </div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onCopy}>
        <span>📋</span> コピー
      </div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onPaste}>
        <span>📄</span> 貼り付け
      </div>
      <div className="border-t border-gray-200 my-1"></div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onInsertRowAbove}>
        <span>➕</span> 上に行を挿入
      </div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onInsertRowBelow}>
        <span>➕</span> 下に行を挿入
      </div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onInsertColumnLeft}>
        <span>➕</span> 左に列を挿入
      </div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onInsertColumnRight}>
        <span>➕</span> 右に列を挿入
      </div>
      <div className="border-t border-gray-200 my-1"></div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onDeleteRow}>
        <span>🗑️</span> 行を削除
      </div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onDeleteColumn}>
        <span>🗑️</span> 列を削除
      </div>
      <div className="border-t border-gray-200 my-1"></div>
      <div className="context-menu-item flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors" onClick={onFormatCells}>
        <span>🎨</span> セルの書式設定
      </div>
    </div>
  );
}
