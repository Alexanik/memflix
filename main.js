'use strict'

const path = require('path')
const { app, BrowserWindow, ipcMain, session, Menu, MenuItem, dialog } = require('electron')
const Store = require('electron-store')
const { Player } = require('./player')
const { MTouchBar } = require('./mtouchbar')
const { Shortcuts } = require('./shortcuts')

//console.log(app.getPath('userData'))

var debug = !app.isPackaged

const settings = new Store({
    quit: {
        type: 'boolean',
        default: false
    }
})

var quitApproved = false

async function checkAndConfirmExit(window) {
    if (settings.get('quit') === true) {
        quitApproved = true
        window.close()

        return
    }

    let quitQuestion = settings.get('quit')

    var result = await dialog.showMessageBox(this, {
        type: 'question',
        buttons: ['Нет', 'Выйти'],
        message: 'Вы действительно хотите выйти?',
        checkboxLabel: 'Больше не спрашивать',
        checkboxChecked: quitQuestion === true ? true : false
    })

    if (result.checkboxChecked === true)
        settings.set('quit', true)
    else
        settings.set('quit', false)

    if (result.response == 1) {
        quitApproved = true
        window.close()
    }
}

function createMainWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 200,
        minHeight: 150,
        webPreferences: {
            preload: path.join(__dirname, 'inject.js'),
            nodeIntegration: true,
            experimentalFeatures: true,
            icon: path.join(__dirname, 'build/icon.png'),
            show: false,
            contextIsolation: true
        }
    })

    if (!debug)
        win.loadURL('https://www.netflix.com/browse')
    else
        win.loadURL('https://www.netflix.com/watch/81031054?trackId=15036066&tctx=1%2C1%2Cce03e093-229c-4269-94f9-d943eb6cf543-51633940%2C44cc0979-3784-460f-b813-e0709545262f_34449421X54XX1628929294988%2C44cc0979-3784-460f-b813-e0709545262f_ROOT%2C')
        
    win.setMenu(null)
    win.once('ready-to-show', () => {
        win.show()
        win.focus()

        if (debug)
            win.webContents.openDevTools()
    })
    win.on('close', (e) => {
        if (quitApproved)
            return

        e.preventDefault()

        checkAndConfirmExit(win)
    })
    win.webContents.on('will-navigate', () => {
        console.log('will navigate')
    })
    win.webContents.on('did-finish-load', () => {
        console.log('did-finish-load')
        win.webContents.send('EVENT_NAVIGATE', null)
    })
    win.on('page-title-updated', (e, title) => {
        console.log(title)
    })
    win.webContents.on('did-start-loading', (e) => {
        win.webContents.send('EVENT_NAVIGATE', null)
    })
    win.webContents.on('will-navigate', (e, url) => {
        console.log(url)
    })
    win.webContents.on('did-navigate', (e, url) => {
        console.log(url)
    })

    return win
}

function createContextMenu(window) {
    let contextMenu = new Menu()

    contextMenu.append(new MenuItem({
        label: 'Поверх всех окон',
        type: 'checkbox',
        checked: window.isAlwaysOnTop(),
        click: function() {
            window.setAlwaysOnTop(!window.isAlwaysOnTop())
        }
    }))
    contextMenu.append(new MenuItem({
        type: 'separator'
    }))
    contextMenu.append(new MenuItem({
        label: 'Выход',
        role: 'quit'
    }))

    return contextMenu
}

app.on('ready', () => {
    const popupMenuTemplate = [

    ]

    const popupMenu = Menu.buildFromTemplate(popupMenuTemplate)
    Menu.setApplicationMenu(popupMenu)
})

app.on('widevine-ready', (version, lastVersion) => {
    ipcMain.removeAllListeners()

    let mainWindow = createMainWindow()

    const player = new Player(mainWindow, ipcMain)
    
    const shortcuts = new Shortcuts(player)
    const contextMenu = createContextMenu(mainWindow)

    if (process.platform === "darwin") {
        const touchBar = new MTouchBar(player)
        mainWindow.setTouchBar(touchBar.build())
    }

    shortcuts.bindKeys()
    mainWindow.webContents.on('context-menu', (e, params) => {
        contextMenu.popup(mainWindow, params.x, params.y)
    })
})