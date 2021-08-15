'use strict'

const { TouchBar } = require('electron')
const { TouchBarButton, TouchBarSpacer, TouchBarLabel, TouchBarSlider } = TouchBar
const nativeImage = require('electron').nativeImage

class MTouchBar {
    constructor(player) {
        this.player = player

        this.images = {
            play: nativeImage.createFromNamedImage('NSTouchBarPlayTemplate', [-1, 0, 1]),
            pause: nativeImage.createFromNamedImage('NSPauseTemplate', [-1, 0, 1]),
        }
    }

    build() {
        this.playButton = new TouchBarButton({
            icon: this.images.play,
            click: this.player.play
        })

        this.currentTime = new TouchBarLabel({
            label: '00:00'
        })

        this.progressSlider = new TouchBarSlider({
            minValue: 0,
            maxValue: 100,
            value: 50,
            change: (value) => {
                console.log(value)
                this.player.seek(value)
            }
        })

        this.totalTime = new TouchBarLabel({
            label: '99:99'
        })

        this.touchBar = new TouchBar({
            items: [
                this.playButton,
                this.currentTime,
                this.progressSlider,
                this.totalTime
            ]
        })

        this.subscribeEvents()

        return this.touchBar
    }

    sToHms(seconds) {
        var time = [
            Math.floor(((seconds % 31536000) % 86400) / 3600), //Hours
            Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), //Minutes
            (((seconds % 31536000) % 86400) % 3600) % 60 //Seconds
        ]

        return time.map(n => n < 10 ? '0' + n : n.toString()).map(n => n.substr(0, 2)).join(':')
    }

    sToMs(seconds) {
        var time = [
            Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), //Minutes
            (((seconds % 31536000) % 86400) % 3600) % 60 //Seconds
        ]

        return time.map(n => n < 10 ? '0' + n : n.toString()).map(n => n.substr(0, 2)).join(':')
    }

    sToHumanReadeable(seconds, duration) {
        if (duration <= 60)
            return seconds.toString()          
        
        if (duration <= 3600)
            return this.sToMs(seconds)

        return this.sToHms(seconds)
    }

    progressToPercents(seconds, duration) {
        var onePercent = duration / 100.0
        var percents = seconds / onePercent

        return Math.floor(percents)
    }

    updatePP(paused) {
        if (paused)
            this.playButton.icon = this.images.play
        else
            this.playButton.icon = this.images.pause
    }

    updateTime(currentTime, duration) {
        this.currentTime.label = this.sToHumanReadeable(currentTime, duration)
        this.totalTime.label = this.sToHumanReadeable(duration, duration)
        this.progressSlider.value = this.progressToPercents(currentTime, duration)
    }

    subscribeEvents() {
        this.player.on('EVENT_VIDEO', (paused, volume, duration, currentTime) => {
            this.updatePP(paused)
            this.updateTime(currentTime, duration)
        })

        this.player.on('EVENT_VIDEO_TIME_UPDATE', (currentTime, duration) => {
            this.updateTime(currentTime, duration)
        })

        this.player.on('EVENT_VIDEO_PAUSE', () => {
            this.updatePP(true)
        })

        this.player.on('EVENT_VIDEO_PLAY', () => {
            this.updatePP(false)
        })
    }
}

module.exports.MTouchBar = MTouchBar