import { app, BrowserWindow, nativeImage, session, type NativeImage } from 'electron'
import { existsSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { RENG_PRODUCTO } from '@shared/producto'
import { rengDisposeModules, rengRegisterModules } from './registry'

const RENG_DEV_URL = process.env['ELECTRON_RENDERER_URL']
const rengIsDev = !!RENG_DEV_URL && !app.isPackaged

app.setName(RENG_PRODUCTO.nombre)
const RENG_PERFIL_PRUEBA = process.env['RENG_PERFIL_PRUEBA']
const rengUsaPerfilPrueba = !app.isPackaged && !!RENG_PERFIL_PRUEBA && isAbsolute(RENG_PERFIL_PRUEBA)
app.setPath('userData', rengUsaPerfilPrueba ? RENG_PERFIL_PRUEBA : join(app.getPath('appData'), RENG_PRODUCTO.nombre))
if (rengUsaPerfilPrueba) process.stdout.write(`RENG_USERDATA ${app.getPath('userData')}\n`)
if (process.platform === 'win32') app.setAppUserModelId(RENG_PRODUCTO.appId)

let rengMainWindow: BrowserWindow | null = null

function rengIsTrusted(rengUrl: string): boolean {
  if (rengIsDev && RENG_DEV_URL && rengUrl.startsWith(RENG_DEV_URL)) return true
  return rengUrl.startsWith('file://')
}

const RENG_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join('; ')

function rengHardenSession(): void {
  const rengSes = session.defaultSession

  rengSes.webRequest.onBeforeRequest((rengDetails, rengCb) => {
    const rengU = rengDetails.url
    const rengAllowed =
      rengU.startsWith('file://') ||
      rengU.startsWith('devtools://') ||
      rengU.startsWith('data:') ||
      rengU.startsWith('blob:') ||
      (rengIsDev && RENG_DEV_URL !== undefined && (rengU.startsWith(RENG_DEV_URL) || rengU.startsWith(RENG_DEV_URL.replace('http', 'ws'))))
    rengCb({ cancel: !rengAllowed })
  })

  if (!rengIsDev) {
    rengSes.webRequest.onHeadersReceived((rengDetails, rengCb) => {
      rengCb({ responseHeaders: { ...rengDetails.responseHeaders, 'Content-Security-Policy': [RENG_CSP] } })
    })
  }

  rengSes.setPermissionRequestHandler((_rengWc, _rengPerm, rengCb) => rengCb(false))
  rengSes.setPermissionCheckHandler(() => false)
}

function rengIconoVentana(): NativeImage | undefined {
  const rengRuta = join(__dirname, '../renderer/icono.png')
  return existsSync(rengRuta) ? nativeImage.createFromPath(rengRuta) : undefined
}

function rengCreateWindow(): void {
  rengMainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    backgroundColor: RENG_PRODUCTO.colorFondo,
    title: RENG_PRODUCTO.nombre,
    icon: rengIconoVentana(),
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      devTools: rengIsDev
    }
  })

  rengMainWindow.once('ready-to-show', () => rengMainWindow?.show())

  rengMainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  rengMainWindow.webContents.on('will-navigate', (rengE, rengUrl) => {
    if (!rengIsTrusted(rengUrl)) rengE.preventDefault()
  })
  rengMainWindow.webContents.on('will-attach-webview', (rengE) => rengE.preventDefault())
  rengMainWindow.on('closed', () => {
    rengMainWindow = null
  })

  if (rengIsDev && RENG_DEV_URL) void rengMainWindow.loadURL(RENG_DEV_URL)
  else void rengMainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (rengMainWindow) {
      if (rengMainWindow.isMinimized()) rengMainWindow.restore()
      rengMainWindow.focus()
    }
  })

  app.enableSandbox()

  void app.whenReady().then(() => {
    rengHardenSession()
    rengRegisterModules({ window: () => rengMainWindow, trusted: rengIsTrusted, userData: app.getPath('userData') })
    rengCreateWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) rengCreateWindow()
    })
  })

  app.on('web-contents-created', (_rengE, rengContents) => {
    rengContents.on('will-attach-webview', (rengEv) => rengEv.preventDefault())
  })

  app.on('before-quit', rengDisposeModules)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
