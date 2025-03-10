const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const Config = require('./config.js')

const CURRENT_VERSION = '1.0.0'
const config = new Config()

let exeProcess = null;

function startExeProcess() {
    if (exeProcess) {
        console.log('Exe process is already running');
        return;
    }

    const exePath = path.join(__dirname, 'main.exe');

    // shell オプションをtrueにすることで、windows環境でもexeファイルを実行できる
    exeProcess = spawn(exePath, [], { shell: true });

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
}

function stopExeProcess() {
    if (exeProcess) {
        exeProcess.kill();
        exeProcess = null;
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

    // devtools
    mainWindow.webContents.openDevTools();

    mainWindow.loadFile('dist/index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        let username = config.get("GENERAL", "username");
        let port = config.get("SERVER", "port");
        mainWindow.webContents.send('initData', { 'username': username.toString(), 'port': port.toString() });
    });

    // 起動ボタンクリック時の処理
    ipcMain.on('start-button-clicked', () => {
        console.log('起動ボタンクリック')
        startExeProcess()
    })

    // 停止ボタンクリック時の処理
    ipcMain.on('stop-button-clicked', () => {
        console.log('停止ボタンクリック')
        stopExeProcess()
    })

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        console.log(url)
        if (url.startsWith('http')) {
            shell.openExternal(url)
        }
        return { action: 'deny' }
    });
}

app.whenReady().then(() => {
    createWindow()
})