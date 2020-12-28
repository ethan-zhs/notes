import * as React from 'react'
import { fromJS } from 'immutable'
import classNames from 'classnames'
import { remote, ipcRenderer } from 'electron'

import TextInput from './TextInput'
import { themeUpdate } from '../../utils/css'

const styles = require('./index.less')

class Home extends React.Component<any, any> {
    timer: any

    constructor(props: any) {
        super(props)

        this.state = {
            taskType: 'Todo',
            settingWin: null,
            isCreating: false,
            activeNoteId: '',
            hoverNoteId: '',
            noteList: []
        }
    }

    componentDidMount() {
        const config = ipcRenderer.sendSync('get-config')
        const notes = ipcRenderer.sendSync('get-notes')

        // 初始化notes
        this.setState({ noteList: notes || [] })

        // 初始化主题
        themeUpdate(config)

        // 监听配置变化更改主题
        ipcRenderer.on('config-update', (event, conf) => {
            themeUpdate(conf)
        })
    }

    render() {
        const MENU = ['Todo', 'Done']
        const { noteList = [], activeNoteId, hoverNoteId, taskType, isCreating } = this.state

        const currentNoteList = noteList.filter((item: any) => item.noteStatus === taskType)
        const activeNote = currentNoteList.find((item: any) => item.id === activeNoteId) || {}

        return (
            <div className={styles['notes']}>
                <header className={styles['drag-header']}></header>
                <div className={styles['header']}>
                    <div className={styles['menu']}>
                        {MENU.map(item => (
                            <span
                                key={item}
                                onClick={() => this.handleChangeTaskList(item)}
                                className={classNames({
                                    [styles['menu-item']]: true,
                                    [styles['active']]: taskType === item
                                })}
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className={styles['add-btn']} onClick={this.handleCreateNote}>
                        <svg height="100%" width="100%" viewBox="0 0 36 36">
                            <path
                                className={styles['svg-icon']}
                                d="M 6,16 16,16 16,7 19,7 19,16 30,16 30,19 19,19 19,29 16,29 16,19 6,19 z"
                            ></path>
                        </svg>
                    </div>

                    <div className={styles['setting-btn']} onClick={this.openSettingsDialog}>
                        <svg width="100%" height="100%">
                            <circle cx="3" cy="10" r="1.8" className={styles['svg-icon']} />
                            <circle cx="10" cy="10" r="1.8" className={styles['svg-icon']} />
                            <circle cx="17" cy="10" r="1.8" className={styles['svg-icon']} />
                        </svg>
                    </div>
                </div>

                {isCreating || activeNote.id ? (
                    <TextInput onChange={this.handleNoteValueChange} initializeValue={activeNote.content || ''} />
                ) : (
                    <div className={styles['note-list']}>
                        {currentNoteList.map((item: any) => (
                            <div
                                key={item.id}
                                className={styles['note-item']}
                                onClick={() => this.changeActiveNote(item.id)}
                                onDoubleClick={() => this.changeNoteStatus(item.id)}
                            >
                                <div
                                    className={classNames({
                                        [styles['note-detail']]: true,
                                        [styles['note-done']]: item.noteStatus === 'Done'
                                    })}
                                    onMouseLeave={() => this.changeHoverNote('')}
                                    onMouseEnter={() => this.changeHoverNote(item.id)}
                                >
                                    <svg width="14" height="20">
                                        <circle cx="4" cy="10" r="2" className={styles['svg-icon']} />
                                    </svg>

                                    <div className={styles['note-title']}>{item.content}</div>

                                    {hoverNoteId === item.id && (
                                        <svg
                                            width="20px"
                                            height="20px"
                                            x="10"
                                            viewBox="-180 0 700 370"
                                            onClick={e => this.deleteNote(e, item.id)}
                                        >
                                            <g
                                                className={classNames({
                                                    [styles['svg-icon']]: true,
                                                    [styles['delete-btn']]: true
                                                })}
                                            >
                                                <polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5" />
                                            </g>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}

                        {currentNoteList.length <= 0 && <div className={styles['no-data']}>No Notes</div>}
                    </div>
                )}
            </div>
        )
    }

    handleCreateNote = () => {
        this.setState({
            isCreating: true
        })
    }

    openSettingsDialog = () => {
        const { settingWin } = this.state

        const isProd = process.env.NODE_ENV === 'production'

        // 只能初始化一个settings win
        if (!settingWin) {
            const SETTINGS_URL = isProd ? `file://${__dirname}/index.html#/settings` : 'http://localhost:1234/#settings'

            const BrowserWindow = remote.BrowserWindow
            const win = new BrowserWindow({
                height: 300,
                width: 500,
                transparent: true,
                frame: false,
                maximizable: false,
                webPreferences: {
                    nodeIntegration: true,
                    enableRemoteModule: true
                }
            })
            win.loadURL(SETTINGS_URL)

            // 非生产环境启动开发者工具
            if (!isProd) {
                win.webContents.openDevTools()
            }

            win.on('close', event => {
                event.preventDefault()
                this.setState({ settingWin: null })
            })

            this.setState({ settingWin: win })
        } else {
            settingWin.show()
        }
    }

    handleChangeTaskList = (type: string) => {
        this.setState({ taskType: type })
    }

    changeActiveNote = (noteId: string | number) => {
        this.timer = setTimeout(() => {
            if (this.timer) {
                clearTimeout(this.timer)
                this.setState({ activeNoteId: noteId, hoverNoteId: '' })
            }
        }, 300)
    }

    handleNoteValueChange = (value: string) => {
        const { isCreating } = this.state
        if (isCreating) {
            this.createNote(value)
        } else {
            this.uppdateNote(value)
        }
    }

    createNote = (value: string) => {
        const { noteList } = this.state

        const noteListTemp = fromJS(noteList).toJS()

        if (value && value != '') {
            const newNote = {
                id: Math.round(Math.random() * 1000).toString(),
                content: value,
                noteStatus: 'Todo',
                updateTime: Date.now()
            }
            noteListTemp.unshift(newNote)
        }

        this.handleNotesUpdate(noteListTemp)
    }

    uppdateNote = (value: string) => {
        const { activeNoteId, noteList } = this.state

        const noteListTemp = fromJS(noteList).toJS()

        noteListTemp.forEach((item: any) => {
            if (item.id === activeNoteId && item.content !== value) {
                item.content = value
                item.updateTime = Date.now()
            }
        })

        this.handleNotesUpdate(noteListTemp)
    }

    changeHoverNote = (noteId: string | number) => {
        this.setState({ hoverNoteId: noteId })
    }

    deleteNote = (e: any, noteId: string | number) => {
        e.stopPropagation()
        const { noteList = [] } = this.state

        let noteListTemp = fromJS(noteList).toJS()
        noteListTemp = noteListTemp.filter((item: any) => noteId !== item.id)
        this.handleNotesUpdate(noteListTemp)
    }

    changeNoteStatus = (noteId: string | number) => {
        // 避免和单击事件冲突
        clearTimeout(this.timer)
        this.timer = null

        const { noteList = [] } = this.state

        const noteListTemp = fromJS(noteList).toJS()
        noteListTemp.forEach((item: any) => {
            if (item.id === noteId) {
                item.noteStatus = item.noteStatus === 'Todo' ? 'Done' : 'Todo'
            }
        })

        this.handleNotesUpdate(noteListTemp)
    }

    handleNotesUpdate = (noteList: any) => {
        this.setState({
            noteList,
            activeNoteId: '',
            hoverNoteId: '',
            isCreating: false
        })
        ipcRenderer.send('notes-update', noteList)
    }
}

export default Home
