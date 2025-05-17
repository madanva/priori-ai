import { app, BrowserWindow, shell, ipcMain } from "electron"
import { release } from "node:os"
import { join } from "node:path"
import { update } from "./update"

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..")
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist")
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js")
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, "index.html")

async function createWindow() {
  win = new BrowserWindow({
    title: "PriorAI",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    width: 1280,
    height: 800,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge API
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url)
    return { action: "deny" }
  })

  // Apply electron-updater
  update(win)
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  win = null
  if (process.platform !== "darwin") app.quit()
})

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// IPC handlers for the app
ipcMain.handle("parse-note", async (_, file) => {
  // In a real app, this would parse the PDF and return the content
  // For now, we'll return mock data
  return {
    content: `Patient presents with chronic lower back pain that has persisted for over 6 months. Pain is described as dull and aching, rated 7/10 on the pain scale. Pain radiates down the left leg. Patient has tried over-the-counter NSAIDs with minimal relief. Physical therapy was attempted for 4 weeks with no significant improvement. MRI shows L4-L5 disc herniation with nerve root compression. Patient is requesting referral to pain management specialist for epidural steroid injections.`,
  }
})

ipcMain.handle("generate-draft", async (_, state) => {
  // In a real app, this would generate a draft letter based on the state
  // For now, we'll return mock data
  return {
    draft: `
Dear Insurance Provider,

I am writing to request prior authorization for epidural steroid injections for my patient, ${state.patient.name} (DOB: ${state.patient.dob}, Insurance ID: ${state.patient.insurance}).

Clinical Summary:
The patient presents with chronic lower back pain that has persisted for over 6 months. The pain is described as dull and aching, rated 7/10 on the pain scale. The pain radiates down the left leg, consistent with radiculopathy.

Treatment History:
The patient has tried conservative management including:
- Over-the-counter NSAIDs with minimal relief
- Physical therapy for 4 weeks with no significant improvement

Diagnostic Findings:
MRI of the lumbar spine shows L4-L5 disc herniation with nerve root compression, which correlates with the patient's symptoms.

Based on the patient's clinical presentation, failed conservative treatment, and diagnostic findings, epidural steroid injections are medically necessary to alleviate pain, improve function, and potentially avoid surgical intervention.

Thank you for your consideration of this request. Please feel free to contact our office if you require any additional information.

Sincerely,
Dr. Smith
    `.trim(),
  }
})
