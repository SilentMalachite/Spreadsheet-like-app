import { Cell } from "@shared/schema";

interface StatusBarProps {
  currentCellReference: string;
  currentCell: Cell | null;
  editMode: boolean;
}

export default function StatusBar({
  currentCellReference,
  currentCell,
  editMode,
}: StatusBarProps) {
  return (
    <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 flex justify-between items-center text-sm text-gray-600">
      <div className="flex items-center gap-5">
        <span>準備完了</span>
        <span>
          選択中: <strong>{currentCellReference}</strong>
        </span>
        {currentCell?.formula && (
          <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
            数式: {currentCell.formula}
          </span>
        )}
        {editMode && (
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            編集中
          </span>
        )}
      </div>
      <div className="flex items-center gap-5">
        <span>計算: 自動</span>
        <span>ズーム: 100%</span>
      </div>
    </div>
  );
}
