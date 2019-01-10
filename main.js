const {app, BrowserWindow, ipcMain, Tray, Menu, Notification} = require('electron');
const path = require('path')
let mainWindow
let win

const path_logo = path.join(__dirname, 'logo')
let tray = null
app.on('ready', function() {
  mainWindow = new BrowserWindow(
    {
      backgroundColor: '#2e2c29',
      width: 1190, height: 820,
      nodeIntegration: true,
      darkTheme: false,
      maximizable: false,
      show: true,
      resizable: false
    }
  );
  mainWindow.loadURL('file://' + __dirname + '/html/main.html');
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  })
  console.log(app.getPath('userData'))
  ///trayIcon

  trayIcon = new Tray(path.join(path_logo, 'logo.jpg'))

   const trayMenuTemplate = [
      {
         label: 'Background',
         enabled: false
      },

      {
         label: 'Open App',
         click: function () {
            mainWindow.show();
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
