const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const app = electron.app;

let template = [
  {
    label: "查看",
    submenu: [
      {
        label: "重载",
        accelerator: "CmdOrCtrl+R",
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function(win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        }
      },
      {
        label: "切换全屏",
        accelerator: (function() {
          if (process.platform === "darwin") {
            return "Ctrl+Command+F";
          } else {
            return "F11";
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      },
      {
        label: "切换开发者工具",
        accelerator: (function() {
          if (process.platform === "darwin") {
            return "Alt+Command+I";
          } else {
            return "Ctrl+Shift+I";
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }
    ]
  },
  {
    label: "帮助",
    role: "help",
    submenu: [
      {
        label: "意见反馈",
        click: function() {
          electron.shell.openExternal("https://github.com/julyL/electron-fontend-tools/issues");
        }
      },
      {
        label: "源码地址",
        click: function() {
          electron.shell.openExternal("https://github.com/julyL/electron-fontend-tools");
        }
      }
    ]
  }
];

function findReopenMenuItem() {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;

  let reopenMenuItem;
  menu.items.forEach(function(item) {
    if (item.submenu) {
      item.submenu.items.forEach(function(item) {
        if (item.key === "reopenMenuItem") {
          reopenMenuItem = item;
        }
      });
    }
  });
  return reopenMenuItem;
}

app.on("ready", function() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("browser-window-created", function() {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = false;
});

app.on("window-all-closed", function() {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = true;
});
