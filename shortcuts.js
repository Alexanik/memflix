'use strict'

const { globalShortcut, dialog } = require('electron')

class Shortcuts {
    constructor(player) {
        this.player = player
        this.shouldBind = true
    }

    bindKeys() {
        let reg = this.registerEvents()
    }

    registerEvents() {
        const bindings = {
            'MediaPlayPause': this.player.play,
        }

        let res = true

        for (let key in bindings) {
            res = res && globalShortcut.register(key, bindings[key])
        }

        return res
    }
}

module.exports.Shortcuts = Shortcuts