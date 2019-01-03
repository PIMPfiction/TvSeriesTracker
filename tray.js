const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
   win = new BrowserWindow({show:false})
   ///trayIcon

   let trayIcon = new Tray(path.join('/Users/sanchezpessa/Desktop/serieTracker/logo/logo.jpg'))

    const trayMenuTemplate = [
       {
          label: 'Empty Application',
          enabled: false
       },

       {
          label: 'Settings',
          click: function () {
             console.log("Clicked on settings")
          }
       },

       {
          label: 'Quit',
          click: function () {
            win = null
            app.isQuiting = true
            app.quit()
          }
       }
    ]

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
    trayIcon.setContextMenu(trayMenu)


   win.on('close', (event) =>{
     if (win) {
       event.preventDefault();
       win.hide();
     }
   });
}


ipcMain.on('tray-quit', (event, arg) => {
  app.quit();
});

app.on('ready', createWindow)
