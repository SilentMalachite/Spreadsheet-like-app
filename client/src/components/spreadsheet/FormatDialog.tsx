import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CellStyle } from "@shared/schema";

interface FormatDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (style: Partial<CellStyle>) => void;
  currentStyle?: CellStyle;
}

const BACKGROUND_COLORS = [
  "#ffffff", "#ffeb3b", "#4caf50", "#2196f3", "#ff5722", "#9c27b0"
];

const TEXT_COLORS = [
  "#000000", "#f44336", "#4caf50", "#2196f3", "#ff9800", "#9c27b0"
];

export default function FormatDialog({
  open,
  onClose,
  onApply,
  currentStyle,
}: FormatDialogProps) {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [color, setColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("none");

  useEffect(() => {
    if (currentStyle) {
      setBackgroundColor(currentStyle.backgroundColor || "#ffffff");
      setColor(currentStyle.color || "#000000");
      setFontWeight(currentStyle.fontWeight || "normal");
      setFontStyle(currentStyle.fontStyle || "normal");
      setTextDecoration(currentStyle.textDecoration || "none");
    }
  }, [currentStyle, open]);

  const handleApply = () => {
    onApply({
      backgroundColor,
      color,
      fontWeight,
      fontStyle,
      textDecoration,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>セルの書式設定</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">背景色</Label>
            <div className="flex gap-2 flex-wrap">
              {BACKGROUND_COLORS.map((bgColor) => (
                <div
                  key={bgColor}
                  className={`w-8 h-8 border-2 rounded cursor-pointer hover:border-blue-500 transition-colors ${
                    backgroundColor === bgColor ? "border-blue-500" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: bgColor }}
                  onClick={() => setBackgroundColor(bgColor)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">文字色</Label>
            <div className="flex gap-2 flex-wrap">
              {TEXT_COLORS.map((textColor) => (
                <div
                  key={textColor}
                  className={`w-8 h-8 border-2 rounded cursor-pointer hover:border-blue-500 transition-colors ${
                    color === textColor ? "border-blue-500" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: textColor }}
                  onClick={() => setColor(textColor)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">文字スタイル</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bold"
                  checked={fontWeight === "bold"}
                  onCheckedChange={(checked) => setFontWeight(checked ? "bold" : "normal")}
                />
                <Label htmlFor="bold" className="font-bold">太字</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="italic"
                  checked={fontStyle === "italic"}
                  onCheckedChange={(checked) => setFontStyle(checked ? "italic" : "normal")}
                />
                <Label htmlFor="italic" className="italic">斜体</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="underline"
                  checked={textDecoration === "underline"}
                  onCheckedChange={(checked) => setTextDecoration(checked ? "underline" : "none")}
                />
                <Label htmlFor="underline" className="underline">下線</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleApply}>
            適用
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
