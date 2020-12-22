import * as React from 'react'
import { fromJS } from 'immutable'
import classNames from 'classnames'

const styles = require('./index.less')

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            taskType: 'Todo',
            activeNote: '',
            hoverNote: '',
            noteList: [
                {
                    id: '11',
                    name: '11111',
                    noteStatus: 'Todo'
                },
                {
                    id: '22',
                    name: '22222',
                    noteStatus: 'Done'
                }
            ]
        }
    }

    render() {
        const MENU = ['Todo', 'Done']
        const { noteList, activeNote, hoverNote, taskType } = this.state

        const currentNoteList = noteList.filter((item: any) => item.noteStatus === taskType)

        return (
            <div>
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

                    <div className={styles['setting-btn']}>
                        <svg width="100%" height="100%">
                            <circle cx="3" cy="10" r="1.8" className={styles['setting-svg-fill']} />
                            <circle cx="10" cy="10" r="1.8" className={styles['setting-svg-fill']} />
                            <circle cx="17" cy="10" r="1.8" className={styles['setting-svg-fill']} />
                        </svg>
                    </div>
                </div>

                <div className={styles['note-list']}>
                    {currentNoteList.map((item: any) => (
                        <div
                            key={item.id}
                            className={styles['note-item']}
                            onClick={() => this.changeActiveNote(item.id)}
                            onDoubleClick={() => this.changeNoteStatus(item.id)}
                        >
                            {activeNote !== item.id ? (
                                <div
                                    className={styles['note-detail']}
                                    onMouseLeave={() => this.changeHoverNote('')}
                                    onMouseEnter={() => this.changeHoverNote(item.id)}
                                >
                                    <div className={styles['note-title']}>▫ {item.name}</div>

                                    {hoverNote === item.id && (
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
                            ) : (
                                <input
                                    className={styles['note-input']}
                                    value={item.name}
                                    autoFocus
                                    onBlur={() => this.changeActiveNote()}
                                    onKeyUp={this.noteInputKeyup}
                                    onChange={this.handleNoteValueChange}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    handleChangeTaskList = (type: string) => {
        this.setState({ taskType: type })
    }

    changeActiveNote = (noteId?: string | number) => {
        this.setState({ activeNote: noteId, hoverNote: '' })
    }

    handleNoteValueChange = (e: any) => {
        const { activeNote, noteList } = this.state

        const noteListTemp = fromJS(noteList).toJS()

        noteListTemp.forEach((item: any) => {
            if (item.id === activeNote) {
                item.name = e.target.value
            }
        })

        this.setState({ noteList: noteListTemp })
    }

    noteInputKeyup = (e: any) => {
        if (e.keyCode === 13) {
            e.target.blur()
        }
    }

    changeHoverNote = (noteId: string | number) => {
        this.setState({ hoverNote: noteId })
    }

    deleteNote = (e: any, noteId: string | number) => {
        e.stopPropagation()
        const { noteList = [] } = this.state

        let noteListTemp = fromJS(noteList).toJS()
        noteListTemp = noteListTemp.filter((item: any) => noteId !== item.id)
        this.setState({ noteList: noteListTemp })
    }

    changeNoteStatus = (noteId: string | number) => {
        const { noteList = [] } = this.state

        const noteListTemp = fromJS(noteList).toJS()
        noteListTemp.forEach((item: any) => {
            if (item.id === noteId) {
                item.noteStatus = item.noteStatus === 'Todo' ? 'Done' : 'Todo'
            }
        })

        this.setState({ noteList: noteListTemp, activeNote: '', hoverNote: '' })
    }
}

export default Home
