import { useState, useRef, useCallback, useEffect } from "react";
import { useSpreadsheet } from "@/hooks/useSpreadsheet";
import { useToast } from "@/hooks/use-toast";
import { useElectron } from "@/hooks/useElectron";
import { importFromJSON } from "@/lib/spreadsheet";
import SpreadsheetGrid from "@/components/spreadsheet/SpreadsheetGrid";
import FormulaBar from "@/components/spreadsheet/FormulaBar";
import Toolbar from "@/components/spreadsheet/Toolbar";
import ContextMenu from "@/components/spreadsheet/ContextMenu";
import StatusBar from "@/components/spreadsheet/StatusBar";
import FormatDialog from "@/components/spreadsheet/FormatDialog";
import FunctionDialog from "@/components/spreadsheet/FunctionDialog";

export default function SpreadsheetPage() {
  const {
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
    canUndo,
    canRedo,
  } = useSpreadsheet();

  const { setupMenuListeners } = useElectron();

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    row: number;
    col: number;
  }>({ visible: false, x: 0, y: 0, row: 0, col: 0 });

  const [formatDialogOpen, setFormatDialogOpen] = useState(false);
  const [functionDialogOpen, setFunctionDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleContextMenu = (event: React.MouseEvent, row: number, col: number) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      row,
      col,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
      toast({
        title: "ファイルを読み込みました",
        description: `${file.name} を開きました。`,
      });
    }
  };

  const handleSaveFile = () => {
    saveFile();
    toast({
      title: "ファイルを保存しました",
      description: "JSON形式で保存されました。",
    });
  };

  const handleNewFile = () => {
    newSpreadsheet();
    toast({
      title: "新しいファイルを作成しました",
      description: "空のスプレッドシートが作成されました。",
    });
  };

  const handleUndo = () => {
    undo();
    toast({
      title: "操作を元に戻しました",
    });
  };

  const handleRedo = () => {
    redo();
    toast({
      title: "操作をやり直しました",
    });
  };

  const handleCopy = () => {
    copyCell();
    toast({
      title: "セルをコピーしました",
    });
  };

  const handlePaste = () => {
    pasteCell();
    toast({
      title: "セルを貼り付けました",
    });
  };

  const handleToggleBold = () => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      const currentCell = getCurrentCell();
      const currentWeight = currentCell?.style?.fontWeight || "normal";
      formatCell(row, col, { fontWeight: currentWeight === "bold" ? "normal" : "bold" });
    }
  };

  const handleToggleItalic = () => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      const currentCell = getCurrentCell();
      const currentStyle = currentCell?.style?.fontStyle || "normal";
      formatCell(row, col, { fontStyle: currentStyle === "italic" ? "normal" : "italic" });
    }
  };

  const handleToggleUnderline = () => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      const currentCell = getCurrentCell();
      const currentDecoration = currentCell?.style?.textDecoration || "none";
      formatCell(row, col, { textDecoration: currentDecoration === "underline" ? "none" : "underline" });
    }
  };

  const handleInsertRow = () => {
    if (spreadsheet.selectedCell) {
      insertRow(spreadsheet.selectedCell.row);
      toast({
        title: "行を追加しました",
      });
    }
  };

  const handleInsertColumn = () => {
    if (spreadsheet.selectedCell) {
      insertColumn(spreadsheet.selectedCell.col);
      toast({
        title: "列を追加しました",
      });
    }
  };

  const handleDeleteRowColumn = () => {
    if (spreadsheet.selectedCell) {
      deleteRow(spreadsheet.selectedCell.row);
      toast({
        title: "行を削除しました",
      });
    }
  };

  const handleUpdateCellFromFormula = (value: string, isFormula?: boolean) => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      updateCell(row, col, value, isFormula);
    }
  };

  const handleInsertFunction = (formula: string) => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      updateCell(row, col, formula, true);
    }
  };

  const handleFormatApply = (style: Parameters<typeof formatCell>[2]) => {
    if (spreadsheet.selectedCell) {
      const { row, col } = spreadsheet.selectedCell;
      formatCell(row, col, style);
      toast({
        title: "書式を適用しました",
      });
    }
  };

  // Keyboard shortcuts and cell editing
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip if we're already editing a cell
    if (editingCell) {
      return;
    }

    // Skip if focus is on an input element
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'c':
          event.preventDefault();
          handleCopy();
          break;
        case 'v':
          event.preventDefault();
          handlePaste();
          break;
        case 'z':
          event.preventDefault();
          handleUndo();
          break;
        case 'y':
          event.preventDefault();
          handleRedo();
          break;
        case 's':
          event.preventDefault();
          handleSaveFile();
          break;
        case 'o':
          event.preventDefault();
          handleOpenFile();
          break;
        case 'n':
          event.preventDefault();
          handleNewFile();
          break;
      }
    } else {
      // Handle cell navigation
      if (spreadsheet.selectedCell) {
        const { row, col } = spreadsheet.selectedCell;
        let newRow = row;
        let newCol = col;
        
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            newRow = Math.max(0, row - 1);
            selectCell(newRow, col);
            break;
          case 'ArrowDown':
            event.preventDefault();
            newRow = Math.min(spreadsheet.rowCount - 1, row + 1);
            selectCell(newRow, col);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            newCol = Math.max(0, col - 1);
            selectCell(row, newCol);
            break;
          case 'ArrowRight':
            event.preventDefault();
            newCol = Math.min(spreadsheet.colCount - 1, col + 1);
            selectCell(row, newCol);
            break;
          case 'Enter':
          case 'F2':
            event.preventDefault();
            startEditing(row, col);
            break;
          case 'Delete':
          case 'Backspace':
            event.preventDefault();
            updateCell(row, col, '');
            break;
          default:
            // Check if the key is a printable character (letters, numbers, symbols)
            if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
              // Start editing and immediately set the typed character
              event.preventDefault();
              updateCell(row, col, event.key);
              startEditing(row, col);
            }
            break;
        }
      }
    }
  }, [editingCell, spreadsheet.selectedCell, spreadsheet.rowCount, spreadsheet.colCount, handleCopy, handlePaste, handleUndo, handleRedo, handleSaveFile, handleOpenFile, handleNewFile, selectCell, startEditing, updateCell]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Electronメニューアクションの受信設定
  useEffect(() => {
    const cleanup = setupMenuListeners({
      onNewFile: handleNewFile,
      onOpenFile: (data) => {
        try {
          const loaded = importFromJSON(data.content);
          newSpreadsheet();
          // スプレッドシートデータを置換
          setTimeout(() => {
            const event = new CustomEvent('loadSpreadsheet', { detail: loaded });
            document.dispatchEvent(event);
          }, 100);
          toast({
            title: "ファイルを開きました",
            description: `${data.fileName} を読み込みました。`,
          });
        } catch (error) {
          toast({
            title: "ファイル読み込みエラー",
            description: "ファイルの形式が正しくありません。",
          });
        }
      },
      onSaveFile: handleSaveFile,
      onSaveAs: handleSaveFile,
      onExportCSV: () => saveAsCSV(),
      onUndo: handleUndo,
      onRedo: handleRedo,
      onCut: handleCopy,
      onCopy: handleCopy,
      onPaste: handlePaste,
    });

    return cleanup;
  }, [setupMenuListeners, handleNewFile, handleSaveFile, saveAsCSV, handleUndo, handleRedo, handleCopy, handlePaste, newSpreadsheet, toast]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center shadow-lg">
        <h1 className="text-2xl font-light">プロ表計算ソフト - React+Electron版</h1>
      </div>

      {/* Toolbar */}
      <Toolbar
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onToggleBold={handleToggleBold}
        onToggleItalic={handleToggleItalic}
        onToggleUnderline={handleToggleUnderline}
        onInsertRow={handleInsertRow}
        onInsertColumn={handleInsertColumn}
        onDeleteRowColumn={handleDeleteRowColumn}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Formula Bar */}
      <FormulaBar
        currentCell={getCurrentCell()}
        currentCellReference={getCurrentCellReference()}
        onUpdateCell={handleUpdateCellFromFormula}
        onShowFunctionDialog={() => setFunctionDialogOpen(true)}
      />

      {/* Spreadsheet Grid */}
      <SpreadsheetGrid
        spreadsheet={spreadsheet}
        editingCell={editingCell}
        onSelectCell={selectCell}
        onStartEditing={startEditing}
        onUpdateCell={updateCell}
        onFinishEditing={finishEditing}
        onContextMenu={handleContextMenu}
      />

      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={handleCloseContextMenu}
        onCut={handleCopy}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onInsertRowAbove={() => insertRow(contextMenu.row)}
        onInsertRowBelow={() => insertRow(contextMenu.row + 1)}
        onInsertColumnLeft={() => insertColumn(contextMenu.col)}
        onInsertColumnRight={() => insertColumn(contextMenu.col + 1)}
        onDeleteRow={() => deleteRow(contextMenu.row)}
        onDeleteColumn={() => deleteColumn(contextMenu.col)}
        onFormatCells={() => setFormatDialogOpen(true)}
      />

      {/* Status Bar */}
      <StatusBar
        currentCellReference={getCurrentCellReference()}
        currentCell={getCurrentCell()}
        editMode={editingCell !== null}
      />

      {/* Format Dialog */}
      <FormatDialog
        open={formatDialogOpen}
        onClose={() => setFormatDialogOpen(false)}
        onApply={handleFormatApply}
        currentStyle={getCurrentCell()?.style}
      />

      {/* Function Dialog */}
      <FunctionDialog
        open={functionDialogOpen}
        onClose={() => setFunctionDialogOpen(false)}
        onInsert={handleInsertFunction}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
    </div>
  );
}
