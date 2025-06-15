const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // メインウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // アイコンファイルが存在する場合
    show: false
  });

  // 開発環境かプロダクション環境かを判別
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // 開発環境ではViteサーバーをロード
    mainWindow.loadURL('http://localhost:5000');
    // DevToolsを開く
    mainWindow.webContents.openDevTools();
  } else {
    // プロダクション環境では静的ファイルをロード
    mainWindow.loadFile(path.join(__dirname, '../dist/public/index.html'));
  }

  // ウィンドウが準備できたら表示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // ウィンドウが閉じられた時の処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// メニューバーの設定
function createMenu() {
  const template = [
    {
      label: 'ファイル',
      submenu: [
        {
          label: '新規作成',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-file');
          }
        },
        {
          label: '開く',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled && result.filePaths.length > 0) {
              try {
                const filePath = result.filePaths[0];
                const fileContent = fs.readFileSync(filePath, 'utf8');
                mainWindow.webContents.send('menu-action', 'open-file', {
                  content: fileContent,
                  fileName: path.basename(filePath)
                });
              } catch (error) {
                dialog.showErrorBox('ファイル読み込みエラー', 'ファイルの読み込みに失敗しました。');
              }
            }
          }
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-action', 'save-file');
          }
        },
        {
          label: '名前を付けて保存',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu-action', 'save-as');
          }
        },
        { type: 'separator' },
        {
          label: 'CSVエクスポート',
          click: () => {
            mainWindow.webContents.send('menu-action', 'export-csv');
          }
        },
        { type: 'separator' },
        {
          label: '終了',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '編集',
      submenu: [
        {
          label: '元に戻す',
          accelerator: 'CmdOrCtrl+Z',
          click: () => {
            mainWindow.webContents.send('menu-action', 'undo');
          }
        },
        {
          label: 'やり直し',
          accelerator: 'CmdOrCtrl+Y',
          click: () => {
            mainWindow.webContents.send('menu-action', 'redo');
          }
        },
        { type: 'separator' },
        {
          label: '切り取り',
          accelerator: 'CmdOrCtrl+X',
          click: () => {
            mainWindow.webContents.send('menu-action', 'cut');
          }
        },
        {
          label: 'コピー',
          accelerator: 'CmdOrCtrl+C',
          click: () => {
            mainWindow.webContents.send('menu-action', 'copy');
          }
        },
        {
          label: '貼り付け',
          accelerator: 'CmdOrCtrl+V',
          click: () => {
            mainWindow.webContents.send('menu-action', 'paste');
          }
        }
      ]
    },
    {
      label: '表示',
      submenu: [
        {
          label: '再読み込み',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: '開発者ツール',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        {
          label: '全画面表示',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: 'バージョン情報',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'バージョン情報',
              message: 'プロ表計算ソフト',
              detail: `Version: 1.0.0\nElectron: ${process.versions.electron}\nNode: ${process.versions.node}\nChrome: ${process.versions.chrome}`
            });
          }
        }
      ]
    }
  ];

  // macOSの場合はアプリケーションメニューを追加
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: `${app.getName()}について`,
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'サービス',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: `${app.getName()}を隠す`,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: '他を隠す',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'すべて表示',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: '終了',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC通信の処理
ipcMain.handle('save-file-dialog', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: data.defaultName || 'spreadsheet.json',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled) {
    try {
      fs.writeFileSync(result.filePath, data.content, 'utf8');
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, cancelled: true };
});

ipcMain.handle('save-csv-dialog', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: data.defaultName || 'spreadsheet.csv',
    filters: [
      { name: 'CSV Files', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled) {
    try {
      fs.writeFileSync(result.filePath, data.content, 'utf8');
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, cancelled: true };
});

// アプリケーションが準備完了した時の処理
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    // macOSでDockアイコンがクリックされた時にウィンドウを再作成
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// すべてのウィンドウが閉じられた時の処理
app.on('window-all-closed', () => {
  // macOS以外ではアプリケーションを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// セキュリティ：外部URLの読み込みを防ぐ
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    event.preventDefault();
  });

  contents.on('will-navigate', (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5000' && parsedUrl.origin !== 'file://') {
      navigationEvent.preventDefault();
    }
  });
});