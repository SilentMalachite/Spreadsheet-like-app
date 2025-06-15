import { useState, useEffect } from "react";
import { Cell } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormulaBarProps {
  currentCell: Cell | null;
  currentCellReference: string;
  onUpdateCell: (value: string, isFormula?: boolean) => void;
  onShowFunctionDialog: () => void;
}

export default function FormulaBar({
  currentCell,
  currentCellReference,
  onUpdateCell,
  onShowFunctionDialog,
}: FormulaBarProps) {
  const [formulaValue, setFormulaValue] = useState("");

  useEffect(() => {
    const value = currentCell?.formula || currentCell?.value || "";
    setFormulaValue(value);
  }, [currentCell]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const isFormula = formulaValue.startsWith("=");
      onUpdateCell(formulaValue, isFormula);
    } else if (e.key === "Escape") {
      const value = currentCell?.formula || currentCell?.value || "";
      setFormulaValue(value);
    }
  };

  const handleBlur = () => {
    const isFormula = formulaValue.startsWith("=");
    onUpdateCell(formulaValue, isFormula);
  };

  return (
    <div className="bg-white p-3 border-b border-gray-200 flex items-center gap-3">
      <div className="bg-gray-100 px-3 py-2 border border-gray-300 rounded min-w-20 font-bold text-gray-700 text-center">
        {currentCellReference}
      </div>
      <Input
        type="text"
        value={formulaValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="数式を入力..."
        className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
      />
      <Button
        onClick={onShowFunctionDialog}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      >
        <span className="mr-2">ƒ</span> 関数
      </Button>
    </div>
  );
}
