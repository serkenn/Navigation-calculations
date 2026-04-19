const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");

const DIST_DIR = path.join(__dirname, "..", "dist");
const PORT = 0; // OS assigns a free port automatically

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function startServer() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    const ext = path.extname(url);

    // Static assets: serve the file directly
    if (ext && ext !== ".html") {
      const filePath = path.join(DIST_DIR, url);
      if (fs.existsSync(filePath)) {
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
          }
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        });
        return;
      }
    }

    // All routes: serve root index.html (SPA fallback)
    const indexPath = path.join(DIST_DIR, "index.html");
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve(server);
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    title: "NavCalc",
  });

  const port = server.address().port;
  win.loadURL(`http://127.0.0.1:${port}`);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let server;

app.whenReady().then(async () => {
  server = await startServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (server) server.close();
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
