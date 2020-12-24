import * as React from 'react'
import { fromJS } from 'immutable'
import classNames from 'classnames'
import { remote, ipcRenderer } from 'electron'

import TextInput from './TextInput'

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
            noteList: [
                {
                    id: '11',
                    content: '111asdasasdasfffa韶大啊实打实v啊实打实阿三大苏打啊大苏打11',
                    noteStatus: 'Todo',
                    updateTime: ''
                },
                {
                    id: '22',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '33',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '44',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '55',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '66',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '77',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '88',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '99',
                    content: '22222',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '1010',
                    content: '88888',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '1111',
                    content: '88888',
                    noteStatus: 'Done',
                    updateTime: ''
                },
                {
                    id: '1212',
                    content: '88888',
                    noteStatus: 'Done',
                    updateTime: ''
                }
            ]
        }
    }

    componentDidMount() {
        ipcRenderer.on('config-update', (event, msg) => {
            console.log(msg)
            document.documentElement.style.setProperty('--primary-bgcolor', '#ff3232')
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
                                    className={styles['note-detail']}
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
                                            <g fill="#ddd">
                                                <polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5" />
                                            </g>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
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

        // 只能初始化一个settings win
        if (!settingWin) {
            const SETTINGS_URL =
                process.env.NODE_ENV === 'production'
                    ? `file://${__dirname}/index.html#/settings`
                    : 'http://localhost:1234/#settings'

            const BrowserWindow = remote.BrowserWindow
            const win = new BrowserWindow({
                height: 300,
                width: 500,
                transparent: true,
                frame: false,
                webPreferences: {
                    nodeIntegration: true,
                    enableRemoteModule: true
                }
            })
            win.loadURL(SETTINGS_URL)

            win.webContents.openDevTools()

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

        this.setState({ noteList: noteListTemp, isCreating: false })
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

        this.setState({ noteList: noteListTemp, activeNoteId: '' })
    }

    changeHoverNote = (noteId: string | number) => {
        this.setState({ hoverNoteId: noteId })
    }

    deleteNote = (e: any, noteId: string | number) => {
        e.stopPropagation()
        const { noteList = [] } = this.state

        let noteListTemp = fromJS(noteList).toJS()
        noteListTemp = noteListTemp.filter((item: any) => noteId !== item.id)
        this.setState({ noteList: noteListTemp })
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

        this.setState({ noteList: noteListTemp, activeNoteId: '', hoverNoteId: '' })
    }
}

export default Home
