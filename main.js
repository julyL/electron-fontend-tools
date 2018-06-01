const {
  electron,
  app,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut
} = require("electron");

require("./main-process/application-menu.js");
const path = require("path");
const url = require("url");
const logger = require("./main-process/logger.js");
process.on('uncaughtException', err => {
  logger.error(err)
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: "./assets/image/app-icon.png",
    width: 1350,
    height: 860
    // width: 1000,
    // height: 800
  });
  let iconPath = path.resolve(__dirname, "./assets/image/app-icon.png");
  let appIcon = new Tray(iconPath);

  var trayMenuTemplate = [{
    label: '退出',
    click: function () {
      app.quit();
    }
  }];
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  appIcon.setToolTip('create by julyL!');
  appIcon.setContextMenu(contextMenu);


  // mainWindow.webContents.openDevTools({ mode: "right" });
  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
      // pathname: "https://wx.qq.com/",
    })
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  console.log("create window");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  createWindow();
});

var webContentsLoad = false;

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.