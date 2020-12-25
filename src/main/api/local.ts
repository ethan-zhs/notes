import fs from 'fs-extra'
import path from 'path'
import { app } from 'electron'

export function updateConfig(data: any) {
    fs.writeJSONSync(path.join(app.getAppPath(), './settings-config.json'), data)
    return data
}

export function getConfig() {
    const configPath = path.join(app.getAppPath(), './settings-config.json')

    if (fs.pathExistsSync(configPath)) {
        return fs.readJSONSync(configPath)
    }
}

export function updateNotes(data: any) {
    fs.writeJSONSync(path.join(app.getAppPath(), './notes-data.json'), data)
    return data
}

export function getNotes() {
    const notesPath = path.join(app.getAppPath(), './notes-data.json')

    if (fs.pathExistsSync(notesPath)) {
        return fs.readJSONSync(notesPath)
    }
}
