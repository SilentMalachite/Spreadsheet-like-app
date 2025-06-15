import { useState, useRef, useEffect } from "react";
import { Spreadsheet, Cell } from "@shared/schema";
import { getCell, COLUMNS, getCellId } from "@/lib/spreadsheet";

interface SpreadsheetGridProps {
  spreadsheet: Spreadsheet;
  editingCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
  onStartEditing: (row: number, col: number) => void;
  onUpdateCell: (row: number, col: number, value: string, isFormula?: boolean) => void;
  onFinishEditing: () => void;
  onContextMenu: (event: React.MouseEvent, row: number, col: number) => void;
}

export default function SpreadsheetGrid({
  spreadsheet,
  editingCell,
  onSelectCell,
  onStartEditing,
  onUpdateCell,
  onFinishEditing,
  onContextMenu,
}: SpreadsheetGridProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      const cell = getCell(spreadsheet, editingCell.row, editingCell.col);
      const value = cell?.formula || cell?.value || "";
      setInputValue(value);
      
      // Use setTimeout to ensure proper focus and selection behavior
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // If the cell has existing content, select it all
          // If it's empty (new input), position cursor at end
          if (value) {
            inputRef.current.select();
          } else {
            inputRef.current.setSelectionRange(0, 0);
          }
        }
      }, 0);
    }
  }, [editingCell, spreadsheet]);

  const handleCellClick = (row: number, col: number) => {
    onSelectCell(row, col);
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    onStartEditing(row, col);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (editingCell) {
        const isFormula = inputValue.startsWith("=");
        onUpdateCell(editingCell.row, editingCell.col, inputValue, isFormula);
        onFinishEditing();
        
        // Move to next row
        onSelectCell(editingCell.row + 1, editingCell.col);
      }
    } else if (e.key === "Escape") {
      onFinishEditing();
    }
  };

  const handleInputBlur = () => {
    if (editingCell) {
      const isFormula = inputValue.startsWith("=");
      onUpdateCell(editingCell.row, editingCell.col, inputValue, isFormula);
      onFinishEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!spreadsheet.selectedCell || editingCell) return;

    const { row, col } = spreadsheet.selectedCell;
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(0, row - 1);
        e.preventDefault();
        break;
      case "ArrowDown":
        newRow = Math.min(spreadsheet.rowCount - 1, row + 1);
        e.preventDefault();
        break;
      case "ArrowLeft":
        newCol = Math.max(0, col - 1);
        e.preventDefault();
        break;
      case "ArrowRight":
        newCol = Math.min(spreadsheet.colCount - 1, col + 1);
        e.preventDefault();
        break;
      case "Enter":
        onStartEditing(row, col);
        e.preventDefault();
        break;
      case "Delete":
        onUpdateCell(row, col, "", false);
        e.preventDefault();
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          onStartEditing(row, col);
          setInputValue(e.key);
        }
        break;
    }

    if (newRow !== row || newCol !== col) {
      onSelectCell(newRow, newCol);
    }
  };

  const getCellStyle = (cell: Cell | undefined) => {
    if (!cell?.style) return {};
    
    return {
      backgroundColor: cell.style.backgroundColor,
      color: cell.style.color,
      fontWeight: cell.style.fontWeight,
      fontStyle: cell.style.fontStyle,
      textDecoration: cell.style.textDecoration,
    };
  };

  const isSelected = (row: number, col: number) => {
    return spreadsheet.selectedCell?.row === row && spreadsheet.selectedCell?.col === col;
  };

  const isEditing = (row: number, col: number) => {
    return editingCell?.row === row && editingCell?.col === col;
  };

  return (
    <div 
      className="flex-1 bg-white border border-gray-200 overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={gridRef}
    >
      <div className="overflow-auto h-full" style={{ height: "calc(100vh - 280px)" }}>
        <div className="relative">
          {/* Column Headers */}
          <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 flex">
            <div className="w-12 h-8 border-r border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200"></div>
            {COLUMNS.slice(0, spreadsheet.colCount).map((col, colIndex) => (
              <div
                key={col}
                className="min-w-24 h-8 border-r border-gray-300 flex items-center justify-center font-bold text-gray-700 cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => {
                  // Select entire column
                  onSelectCell(0, colIndex);
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Spreadsheet Rows */}
          {Array.from({ length: spreadsheet.rowCount }, (_, rowIndex) => (
            <div key={rowIndex} className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
              {/* Row Header */}
              <div
                className="w-12 h-8 bg-gradient-to-r from-gray-100 to-gray-200 border-r border-gray-300 flex items-center justify-center font-bold text-gray-700 cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => {
                  // Select entire row
                  onSelectCell(rowIndex, 0);
                }}
              >
                {rowIndex + 1}
              </div>

              {/* Row Cells */}
              {Array.from({ length: spreadsheet.colCount }, (_, colIndex) => {
                const cell = getCell(spreadsheet, rowIndex, colIndex);
                const selected = isSelected(rowIndex, colIndex);
                const editing = isEditing(rowIndex, colIndex);

                return (
                  <div
                    key={colIndex}
                    className={`relative min-w-24 h-8 border-r border-gray-200 group ${
                      selected ? "bg-blue-100 border-2 border-blue-500" : ""
                    } ${editing ? "bg-white border-2 border-green-500" : ""}`}
                    data-cell={getCellId(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                    onContextMenu={(e) => onContextMenu(e, rowIndex, colIndex)}
                  >
                    {editing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={handleInputBlur}
                        className="absolute inset-0 p-1 text-sm border-2 border-green-500 rounded-sm bg-white w-full h-full outline-none"
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 p-1 flex items-center cursor-cell transition-colors ${
                          !selected ? "hover:bg-blue-50" : ""
                        }`}
                        style={getCellStyle(cell)}
                      >
                        <span className="text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap w-full">
                          {cell?.displayValue || cell?.value || ""}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
