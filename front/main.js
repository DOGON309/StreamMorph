const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');
const Config = require('./config.js');

const CURRENT_VERSION = '1.0.0';
const config = new Config();

let exeProcess = null;

function startExeProcess() {
    if (exeProcess) {
        console.log('Exe process is already running');
        return;
    }

    const exePath = path.join(__dirname, 'main.exe');

    exeProcess = spawn(exePath, [], { shell: true });

    console.log(`Exe started with PID: ${exeProcess.pid}`);

    exeProcess.stdout.on('data', (data) => {
        console.log(`Exe stdout: ${data}`);
    });

    exeProcess.stderr.on('data', (data) => {
        console.log(`Exe stderr: ${data}`);
    });

    exeProcess.on('close', (code) => {
        console.log(`Exe process exited with code ${code}`);
        exeProcess = null;
    });

    exeProcess.on('error', (err) => {
        console.log(`Failed to start exe process: ${err}`);
        exeProcess = null;
    });
}

function stopExeProcess() {
    if (exeProcess && exeProcess.pid) {
        console.log(`Stopping exe process with PID: ${exeProcess.pid}`);

        try {
            // 同期処理で `taskkill` を実行（Electron が終了する前に完了させる）
            execSync(`taskkill /PID ${exeProcess.pid} /T /F`, { stdio: 'inherit' });
            console.log(`Exe process (PID: ${exeProcess.pid}) has been terminated`);
        } catch (err) {
            console.error(`Failed to kill process: ${err}`);
        }

        exeProcess = null;
    } else {
        console.log('Exe process is not running');
    }
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('dist/index.html');

    mainWindow.webContents.on('did-finish-load', () => {
        let username = config.get("GENERAL", "username");
        let port = config.get("SERVER", "port");
        mainWindow.webContents.send('initData', { 'username': username.toString(), 'port': port.toString() });
    });

    ipcMain.on('start-button-clicked', () => {
        console.log('起動ボタンクリック');
        startExeProcess();
    });

    ipcMain.on('stop-button-clicked', () => {
        console.log('停止ボタンクリック');
        stopExeProcess();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        console.log(url);
        if (url.startsWith('http')) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });

    // ウィンドウを閉じる際にプロセスを停止
    mainWindow.on('close', (event) => {
        stopExeProcess();
    });
};

// アプリが終了する前に `stopExeProcess()` を実行
app.on('before-quit', () => {
    console.log('App is quitting, stopping exe process...');
    stopExeProcess();
});

app.whenReady().then(() => {
    createWindow();
});
