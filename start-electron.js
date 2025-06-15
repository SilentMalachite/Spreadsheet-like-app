const { spawn } = require('child_process');
const waitOn = require('wait-on');

console.log('Electronアプリケーションを起動しています...');

// Viteサーバーの起動を待つ
waitOn({
  resources: ['http://localhost:5000'],
  delay: 1000,
  timeout: 30000,
}).then(() => {
  console.log('Viteサーバーが起動しました。Electronを開始します...');
  
  // Electronアプリケーションを起動
  const electronProcess = spawn('electron', ['.'], {
    env: { ...process.env, NODE_ENV: 'development' },
    stdio: 'inherit'
  });

  electronProcess.on('close', (code) => {
    console.log(`Electronアプリケーションが終了しました。コード: ${code}`);
    process.exit(code);
  });

  electronProcess.on('error', (err) => {
    console.error('Electronアプリケーションでエラーが発生しました:', err);
    process.exit(1);
  });
}).catch((err) => {
  console.error('Viteサーバーの起動待機でエラーが発生しました:', err);
  process.exit(1);
});