const { app, BrowserWindow, shell } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')

    win.webContents.setWindowOpenHandler(({ url }) => {
        console.log(url)
        if (url.startsWith('http')) {
            shell.openExternal(url)
        }
        return { action: 'deny' }
    })
}

app.whenReady().then(() => {
    createWindow()
})