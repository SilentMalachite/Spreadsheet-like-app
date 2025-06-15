import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FunctionDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (formula: string) => void;
}

const FUNCTION_CATEGORIES = {
  "数学と三角関数": [
    { name: "SUM", description: "範囲内の数値の合計を計算します。構文: SUM(数値1, [数値2], ...)", syntax: "SUM(" },
    { name: "AVERAGE", description: "範囲内の数値の平均を計算します。構文: AVERAGE(数値1, [数値2], ...)", syntax: "AVERAGE(" },
    { name: "MAX", description: "範囲内の最大値を返します。構文: MAX(数値1, [数値2], ...)", syntax: "MAX(" },
    { name: "MIN", description: "範囲内の最小値を返します。構文: MIN(数値1, [数値2], ...)", syntax: "MIN(" },
    { name: "COUNT", description: "範囲内の数値の個数を計算します。構文: COUNT(値1, [値2], ...)", syntax: "COUNT(" },
  ],
  "論理関数": [
    { name: "IF", description: "条件に応じて異なる値を返します。構文: IF(条件, 真の場合, 偽の場合)", syntax: "IF(" },
  ],
};

export default function FunctionDialog({
  open,
  onClose,
  onInsert,
}: FunctionDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("数学と三角関数");
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const currentFunctions = FUNCTION_CATEGORIES[selectedCategory as keyof typeof FUNCTION_CATEGORIES] || [];
  const currentFunctionData = currentFunctions.find(f => f.name === selectedFunction);

  const handleInsert = () => {
    if (selectedFunction && currentFunctionData) {
      onInsert(`=${currentFunctionData.syntax}`);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>関数の挿入</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">関数カテゴリ</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(FUNCTION_CATEGORIES).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">関数一覧</Label>
            <div className="border border-gray-300 rounded max-h-40 overflow-y-auto">
              {currentFunctions.map((func) => (
                <div
                  key={func.name}
                  className={`p-2 cursor-pointer border-b border-gray-200 transition-colors ${
                    selectedFunction === func.name ? "bg-blue-50" : "hover:bg-blue-50"
                  }`}
                  onClick={() => setSelectedFunction(func.name)}
                >
                  <strong>{func.name}</strong> - {func.description.split('.')[0]}
                </div>
              ))}
            </div>
          </div>

          {currentFunctionData && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">関数の説明</Label>
              <div className="bg-gray-50 p-3 rounded text-sm">
                {currentFunctionData.description}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleInsert} disabled={!selectedFunction}>
            挿入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
