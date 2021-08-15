'use strict'

const EventEmmiter = require('events')
const { globalShortcut } = require('electron')

class Player extends EventEmmiter {
    constructor(window, ipcMain) {
        super()

        this.window = window
        this.ipcMain = ipcMain
        this.state = {}

        this.ipcMain.on('EVENT_VIDEO', (e, paused, volume, duration, currentTime) => {
            this.emit('EVENT_VIDEO', paused, volume, duration, currentTime)

            this.duration = duration
        })

        this.ipcMain.on('EVENT_VIDEO_VOLUME_CHANGE', (e, volume) => {
            this.emit('EVENT_VIDEO_VALUE_CHANGE')
        })

        this.ipcMain.on('EVENT_VIDEO_TIME_UPDATE', (e, currentTime, duration) => {
            this.emit('EVENT_VIDEO_TIME_UPDATE', currentTime, duration)
        })

        this.ipcMain.on('EVENT_VIDEO_PAUSE', (e) => {
            this.emit('EVENT_VIDEO_PAUSE')
        })

        this.ipcMain.on('EVENT_VIDEO_PLAY', (e) => {
            this.emit('EVENT_VIDEO_PLAY')
        })
    }

    play = () => {
        this.window.webContents.send('EVENT_PLAY', null)
    }

    seek = (percents) => {
        let onePercent = this.duration / 100
        let newTime = Math.round(onePercent * percents * 1000)

        console.log(`newTime = ${newTime}`)

        this.window.webContents.executeJavaScript(`
            netflixVideoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer
            player = netflixVideoPlayer.getVideoPlayerBySessionId(netflixVideoPlayer.getAllPlayerSessionIds()[0])

            player.seek(${newTime})
        `)
    }
}

module.exports.Player = Player
