import { useState, useCallback, useEffect } from "react";
import { Spreadsheet, Cell } from "@shared/schema";
import { createEmptySpreadsheet, getCell, setCell, getCellReference, exportToJSON, importFromJSON, exportToCSV } from "@/lib/spreadsheet";
import { evaluateFormula } from "@/lib/formulas";
import { useElectron } from "./useElectron";

export function useSpreadsheet() {
  const { saveFileToSystem } = useElectron();
  
  const [spreadsheet, setSpreadsheet] = useState<Spreadsheet>(() => {
    const saved = localStorage.getItem('spreadsheet');
    return saved ? importFromJSON(saved) : createEmptySpreadsheet();
  });
  
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [clipboard, setClipboard] = useState<Cell | null>(null);
  const [history, setHistory] = useState<Spreadsheet[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Save to localStorage whenever spreadsheet changes
  useEffect(() => {
    localStorage.setItem('spreadsheet', exportToJSON(spreadsheet));
  }, [spreadsheet]);
  
  const addToHistory = useCallback((newSpreadsheet: Spreadsheet) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(spreadsheet);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
    setSpreadsheet(newSpreadsheet);
  }, [spreadsheet, historyIndex]);
  
  const selectCell = useCallback((row: number, col: number) => {
    setSpreadsheet(prev => ({
      ...prev,
      selectedCell: { row, col }
    }));
    setEditingCell(null);
  }, []);
  
  const startEditing = useCallback((row: number, col: number) => {
    setEditingCell({ row, col });
  }, []);
  
  const updateCell = useCallback((row: number, col: number, value: string, isFormula = false) => {
    const newSpreadsheet = setCell(spreadsheet, row, col, {
      value: isFormula ? "" : value,
      formula: isFormula ? value : "",
      displayValue: isFormula ? evaluateFormula(value, spreadsheet) : value,
    });
    
    // Recalculate all formulas
    const updatedSpreadsheet = recalculateFormulas(newSpreadsheet);
    addToHistory(updatedSpreadsheet);
  }, [spreadsheet, addToHistory]);
  
  const recalculateFormulas = useCallback((sheet: Spreadsheet): Spreadsheet => {
    const updatedCells = sheet.cells.map(cell => {
      if (cell.formula) {
        return {
          ...cell,
          displayValue: evaluateFormula(cell.formula, sheet)
        };
      }
      return cell;
    });
    
    return { ...sheet, cells: updatedCells };
  }, []);
  
  const finishEditing = useCallback(() => {
    setEditingCell(null);
  }, []);
  
  const copyCell = useCallback(() => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      const cell = getCell(spreadsheet, row, col);
      if (cell) {
        setClipboard(cell);
      }
    }
  }, [spreadsheet]);
  
  const pasteCell = useCallback(() => {
    if (clipboard && spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      const newSpreadsheet = setCell(spreadsheet, row, col, {
        value: clipboard.value,
        formula: clipboard.formula,
        displayValue: clipboard.displayValue,
        style: clipboard.style,
      });
      addToHistory(newSpreadsheet);
    }
  }, [clipboard, spreadsheet, addToHistory]);
  
  const formatCell = useCallback((row: number, col: number, style: Partial<Cell['style']>) => {
    const cell = getCell(spreadsheet, row, col);
    const currentStyle = cell?.style || {
      backgroundColor: "#ffffff",
      color: "#000000",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
    };
    
    const newSpreadsheet = setCell(spreadsheet, row, col, {
      style: { ...currentStyle, ...style }
    });
    addToHistory(newSpreadsheet);
  }, [spreadsheet, addToHistory]);
  
  const insertRow = useCallback((index: number) => {
    const newSpreadsheet = {
      ...spreadsheet,
      rowCount: spreadsheet.rowCount + 1,
      cells: spreadsheet.cells.map(cell => 
        cell.row >= index ? { ...cell, row: cell.row + 1 } : cell
      )
    };
    addToHistory(newSpreadsheet);
  }, [spreadsheet, addToHistory]);
  
  const insertColumn = useCallback((index: number) => {
    const newSpreadsheet = {
      ...spreadsheet,
      colCount: spreadsheet.colCount + 1,
      cells: spreadsheet.cells.map(cell => 
        cell.col >= index ? { ...cell, col: cell.col + 1 } : cell
      )
    };
    addToHistory(newSpreadsheet);
  }, [spreadsheet, addToHistory]);
  
  const deleteRow = useCallback((index: number) => {
    const newSpreadsheet = {
      ...spreadsheet,
      rowCount: Math.max(1, spreadsheet.rowCount - 1),
      cells: spreadsheet.cells
        .filter(cell => cell.row !== index)
        .map(cell => cell.row > index ? { ...cell, row: cell.row - 1 } : cell)
    };
    addToHistory(newSpreadsheet);
  }, [spreadsheet, addToHistory]);
  
  const deleteColumn = useCallback((index: number) => {
    const newSpreadsheet = {
      ...spreadsheet,
      colCount: Math.max(1, spreadsheet.colCount - 1),
      cells: spreadsheet.cells
        .filter(cell => cell.col !== index)
        .map(cell => cell.col > index ? { ...cell, col: cell.col - 1 } : cell)
    };
    addToHistory(newSpreadsheet);
  }, [spreadsheet, addToHistory]);
  
  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      setSpreadsheet(history[historyIndex]);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setSpreadsheet(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);
  
  const saveFile = useCallback(async () => {
    const json = exportToJSON(spreadsheet);
    await saveFileToSystem(json, `${spreadsheet.name}.json`, false);
  }, [spreadsheet, saveFileToSystem]);
  
  const saveAsCSV = useCallback(async () => {
    const csv = exportToCSV(spreadsheet);
    await saveFileToSystem(csv, `${spreadsheet.name}.csv`, true);
  }, [spreadsheet, saveFileToSystem]);
  
  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const loaded = importFromJSON(content);
        setSpreadsheet(loaded);
      } catch (error) {
        console.error('Failed to load file:', error);
      }
    };
    reader.readAsText(file);
  }, []);
  
  const newSpreadsheet = useCallback(() => {
    const newSheet = createEmptySpreadsheet();
    setSpreadsheet(newSheet);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);
  
  const getCurrentCellReference = useCallback(() => {
    if (spreadsheet.selectedCell) {
      return getCellReference(spreadsheet.selectedCell.row, spreadsheet.selectedCell.col);
    }
    return "A1";
  }, [spreadsheet.selectedCell]);
  
  const getCurrentCell = useCallback((): Cell | null => {
    if (spreadsheet.selectedCell) {
      return getCell(spreadsheet, spreadsheet.selectedCell.row, spreadsheet.selectedCell.col) || null;
    }
    return null;
  }, [spreadsheet]);
  
  return {
    spreadsheet,
    editingCell,
    selectCell,
    startEditing,
    updateCell,
    finishEditing,
    copyCell,
    pasteCell,
    formatCell,
    insertRow,
    insertColumn,
    deleteRow,
    deleteColumn,
    undo,
    redo,
    saveFile,
    saveAsCSV,
    loadFile,
    newSpreadsheet,
    getCurrentCellReference,
    getCurrentCell,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
  };
}
