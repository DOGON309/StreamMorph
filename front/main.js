const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

const CURRENT_VERSION = '1.0.0'

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('initData', { 'port': '8000' });
    });

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