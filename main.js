const {app, BrowserWindow, ipcMain, Tray, Menu, Notification} = require('electron');
const path = require('path')
var async = require('async')
let mainWindow
let win

app.on('ready', function() {
  mainWindow = new BrowserWindow(
    {
      backgroundColor: '#2e2c29',
      width: 1150, height: 800,
      nodeIntegration: true,
      darkTheme: false,
      maximizable: false,
      show: true
      //resizable: true
    }
  );
  mainWindow.loadURL('file://' + __dirname + '/html/sidebar.html');
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  })

  ///trayIcon

  let trayIcon = new Tray(path.join('/Users/sanchezpessa/Desktop/serieTracker/logo/logo.jpg'))

   const trayMenuTemplate = [
      {
         label: 'Background',
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
           console.log("quitting")
           mainWindow.removeAllListeners('close')
           mainWindow.close()
           app.quit()
         }
      }
   ]

   let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
   trayIcon.setContextMenu(trayMenu)

    //mainWindow.webContents.openDevTools();

});
