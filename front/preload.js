const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onInitData: (callback) => ipcRenderer.on('initData', (event, data) => callback(data)),
    startFunction: () => ipcRenderer.send('start-button-clicked'),
    stopFunction: () => ipcRenderer.send('stop-button-clicked')
});