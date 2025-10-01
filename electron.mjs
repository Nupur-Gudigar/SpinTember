// electron.mjs
import { app, BrowserWindow, Menu, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "src", "assets", "dekstop-icon.jpeg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // optional if you want IPC later
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    titleBarStyle: "default",
    show: false,
    title: "SpinTember"
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // ✅ Unified dev vs prod URL
  const startUrl =
    process.env.VITE_DEV_SERVER_URL ||
    `file://${path.join(__dirname, "dist/index.html")}`;

  console.log("Electron start URL =", startUrl);
  mainWindow.loadURL(startUrl);

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  createMenu();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: "SpinTember",
      submenu: [
        { label: "About SpinTember", click: () => {} },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => app.quit()
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    { label: "Window", submenu: [{ role: "minimize" }, { role: "close" }] }
  ];

  if (process.platform === "darwin") {
    template[0].label = app.name;
    template[0].submenu.unshift({ label: "About SpinTember", role: "about" });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  app.setName("SpinTember");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Extra security: prevent `new-window`
app.on("web-contents-created", (event, contents) => {
  contents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
