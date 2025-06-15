const { contextBridge, ipcRenderer } = require('electron');

// メインプロセスとの安全な通信のためのAPIを公開
contextBridge.exposeInMainWorld('electronAPI', {
  // ファイル保存ダイアログ
  saveFile: (data) => ipcRenderer.invoke('save-file-dialog', data),
  
  // CSV保存ダイアログ
  saveCSV: (data) => ipcRenderer.invoke('save-csv-dialog', data),
  
  // メニューアクションの受信
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action, data) => {
      callback(action, data);
    });
  },
  
  // メニューアクションの受信を停止
  removeMenuActionListener: () => {
    ipcRenderer.removeAllListeners('menu-action');
  }
});

// セキュリティ: Node.jsのAPIへの直接アクセスを防ぐ
delete window.require;
delete window.exports;
delete window.module;