const path = require("path");
const url = require("url");
const {
  app,
  BrowserWindow,

  ipcMain,
  dialog,
  shell,
} = require("electron");

const isDev = require("electron-is-dev");
const AutoLaunch = require("auto-launch");
const Store = require("electron-store");
const store = new Store();

let win;

function createWindow() {
  let autoLaunch = new AutoLaunch({
    name: "Stop Smoking",
    path: app.getPath("exe"),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
  });
  // Create the browser window.
  const bounds = store.get("windowStartPosition") || {
    x: 0,
    y: 0,
  };
  const winSize = store.get("winSize") || {
    width: 200,
    height: 200,
  };
  win = new BrowserWindow({
    width: winSize.width,
    height: winSize.height,
    x: bounds.x,
    y: bounds.y,
    alwaysOnTop: false,
    titleBarStyle: "hidden",
    frame: false,
    resizable: false,

    transparent: true,

    webPreferences: {
      enableRemoteModule: true,
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.on("moved", (e) => {
    const bounds = e.sender.getBounds();
    // console.log(bounds);
    store.set("windowStartPosition", bounds);
  });
  win.setMenuBarVisibility(false);
  //attachTitlebarToWindow(win);

  win.loadURL(
    isDev
      ? "http://localhost:3000/Login"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // win.loadURL(
  //   isDev
  //     ? "http://localhost:3000/Login"
  //     : url.format({
  //         pathname: path.join(__dirname, "index.html"),
  //         protocol: "file:",
  //         slashes: true,
  //       })
  // );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

if (process.platform === "linux") {
  // app.commandLine.appendSwitch('enable-transparent-visuals');
  // app.disableHardwareAcceleration();
  //app.on('ready', () => setTimeout(createWindow, 600));
}

app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("quit", () => {
  app.quit();
});
ipcMain.on("minimize", () => {
  win.minimize();
});
ipcMain.on("openLink", (e, link) => {
  e.preventDefault();
  shell.openExternal(link);
});

ipcMain.on("changeWindowSize", (e, width, height, isMaximizable) => {
  let win = BrowserWindow.fromWebContents(e.sender);
  win.setSize(width, height);
  store.set("winSize", { width: width, height: height });
  // win.isMaximizable(isMaximizable);
  // win.isResizable(isMaximizable);
  // win.isFullScreenable(isMaximizable);
  //win.setFullScreen(isMaximizable);
  // e.reply("onWindowTitleChanged", "title");
});
