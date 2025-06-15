import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  FolderOpen, 
  Save, 
  Undo, 
  Redo, 
  Copy, 
  Clipboard, 
  Bold, 
  Italic, 
  Underline, 
  Plus, 
  Trash2 
} from "lucide-react";

interface ToolbarProps {
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
  onInsertRow: () => void;
  onInsertColumn: () => void;
  onDeleteRowColumn: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Toolbar({
  onNewFile,
  onOpenFile,
  onSaveFile,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onInsertRow,
  onInsertColumn,
  onDeleteRowColumn,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <div className="bg-white p-3 border-b border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        {/* File Operations */}
        <div className="flex gap-2">
          <Button
            onClick={onNewFile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <FileText size={16} /> 新規
          </Button>
          <Button
            onClick={onOpenFile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <FolderOpen size={16} /> 開く
          </Button>
          <Button
            onClick={onSaveFile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Save size={16} /> 保存
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Edit Operations */}
        <div className="flex gap-2">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo size={16} /> 元に戻す
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo size={16} /> やり直し
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Clipboard Operations */}
        <div className="flex gap-2">
          <Button
            onClick={onCopy}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Copy size={16} /> コピー
          </Button>
          <Button
            onClick={onPaste}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Clipboard size={16} /> 貼り付け
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Formatting */}
        <div className="flex gap-2">
          <Button
            onClick={onToggleBold}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5"
            title="太字"
          >
            <Bold size={16} />
          </Button>
          <Button
            onClick={onToggleItalic}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5"
            title="斜体"
          >
            <Italic size={16} />
          </Button>
          <Button
            onClick={onToggleUnderline}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5"
            title="下線"
          >
            <Underline size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Row/Column Operations */}
        <div className="flex gap-2">
          <Button
            onClick={onInsertRow}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={16} /> 行追加
          </Button>
          <Button
            onClick={onInsertColumn}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={16} /> 列追加
          </Button>
          <Button
            onClick={onDeleteRowColumn}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Trash2 size={16} /> 削除
          </Button>
        </div>
      </div>
    </div>
  );
}
