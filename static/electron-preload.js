const { contextBridge, ipcRenderer } = require('electron')

// window.getWinSize = {
//   getAnswer() {
//     return 42;
//   }
// }
ipcRenderer.send('setFullscreen')
// var electron = require('electron');
// var window = electron.remote.getCurrentWindow();
// window.setFullScreen(true);
// TODO: ?

// contextBridge.exposeInMainWorld('electronAPI', {
//   setTitle: (title) => ipcRenderer.send('set-title', title),
//   notifyGameInitialized: () => ipcRenderer.send('notify-game-initialized'),
// })
