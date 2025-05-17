import { app, ipcMain, type BrowserWindow } from "electron"
import { autoUpdater } from "electron-updater"

export function update(win: BrowserWindow) {
  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  // start checking
  autoUpdater.on("checking-for-update", () => {})
  // update available
  autoUpdater.on("update-available", (arg) => {
    win.webContents.send("update-can-available", { update: true, version: app.getVersion(), newVersion: arg?.version })
  })
  // update not available
  autoUpdater.on("update-not-available", (arg) => {
    win.webContents.send("update-can-available", { update: false, version: app.getVersion(), newVersion: arg?.version })
  })
  // error when updating
  autoUpdater.on("error", (err) => {
    win.webContents.send("update-error", { message: err.message })
  })
  // progress when downloading
  autoUpdater.on("download-progress", (progress) => {
    win.webContents.send("download-progress", progress)
  })
  // update downloaded
  autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send("update-downloaded", info)
    // Restart the app and install the update
    autoUpdater.quitAndInstall()
  })

  // check update now
  ipcMain.handle("check-update", async () => {
    if (!app.isPackaged) {
      const error = new Error("The update feature is only available after the package.")
      return { message: error.message, error }
    }

    try {
      return await autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      return { message: "Network Error", error }
    }
  })

  // start download
  ipcMain.handle("start-download", (event) => {
    startDownload()
  })

  // Get the version number
  ipcMain.handle("get-version", () => {
    return app.getVersion()
  })

  const startDownload = () => {
    autoUpdater.downloadUpdate()
  }
}
