import { useEffect, useCallback } from "react";

// Electron APIの型定義
interface ElectronAPI {
  saveFile: (data: { content: string; defaultName: string }) => Promise<{ success: boolean; filePath?: string; error?: string; cancelled?: boolean }>;
  saveCSV: (data: { content: string; defaultName: string }) => Promise<{ success: boolean; filePath?: string; error?: string; cancelled?: boolean }>;
  onMenuAction: (callback: (action: string, data?: any) => void) => void;
  removeMenuActionListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export function useElectron() {
  const isElectron = typeof window !== 'undefined' && window.electronAPI;

  const saveFileToSystem = useCallback(async (content: string, defaultName: string, isCSV = false) => {
    if (!isElectron) {
      // ブラウザ環境では従来のダウンロード方式
      const blob = new Blob([content], { type: isCSV ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultName;
      a.click();
      URL.revokeObjectURL(url);
      return { success: true };
    }

    // Electron環境ではネイティブダイアログを使用
    try {
      const result = isCSV 
        ? await window.electronAPI!.saveCSV({ content, defaultName })
        : await window.electronAPI!.saveFile({ content, defaultName });
      return result;
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }, [isElectron]);

  const setupMenuListeners = useCallback((handlers: {
    onNewFile?: () => void;
    onOpenFile?: (data: { content: string; fileName: string }) => void;
    onSaveFile?: () => void;
    onSaveAs?: () => void;
    onExportCSV?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onCut?: () => void;
    onCopy?: () => void;
    onPaste?: () => void;
  }) => {
    if (!isElectron || !window.electronAPI) return;

    const handleMenuAction = (action: string, data?: any) => {
      switch (action) {
        case 'new-file':
          handlers.onNewFile?.();
          break;
        case 'open-file':
          handlers.onOpenFile?.(data);
          break;
        case 'save-file':
          handlers.onSaveFile?.();
          break;
        case 'save-as':
          handlers.onSaveAs?.();
          break;
        case 'export-csv':
          handlers.onExportCSV?.();
          break;
        case 'undo':
          handlers.onUndo?.();
          break;
        case 'redo':
          handlers.onRedo?.();
          break;
        case 'cut':
          handlers.onCut?.();
          break;
        case 'copy':
          handlers.onCopy?.();
          break;
        case 'paste':
          handlers.onPaste?.();
          break;
      }
    };

    window.electronAPI.onMenuAction(handleMenuAction);

    return () => {
      window.electronAPI?.removeMenuActionListener();
    };
  }, [isElectron]);

  return {
    isElectron,
    saveFileToSystem,
    setupMenuListeners
  };
}