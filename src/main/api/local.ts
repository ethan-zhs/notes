import fs from 'fs-extra'
import path from 'path'

function getBaseDir() {
    const basePath = process.env.HOME || ''
    const baseDir = path.join(basePath, '.simple-notes')
    return baseDir
}

export function updateConfig(data: any) {
    const baseDir = getBaseDir()

    if (!fs.pathExistsSync(baseDir)) {
        fs.mkdir(baseDir)
    }

    fs.writeJSONSync(path.join(baseDir, 'settings-config.json'), data)
    return data
}

export function getConfig() {
    const baseDir = getBaseDir()
    const configPath = path.join(baseDir, 'settings-config.json')

    if (fs.pathExistsSync(configPath)) {
        return fs.readJSONSync(configPath)
    }
}

export function updateNotes(data: any) {
    const baseDir = getBaseDir()
    if (!fs.pathExistsSync(baseDir)) {
        fs.mkdir(baseDir)
    }

    fs.writeJSONSync(path.join(baseDir, 'notes-data.json'), data)
    return data
}

export function getNotes() {
    const baseDir = getBaseDir()
    const notesPath = path.join(baseDir, 'notes-data.json')

    if (fs.pathExistsSync(notesPath)) {
        return fs.readJSONSync(notesPath)
    }
}
