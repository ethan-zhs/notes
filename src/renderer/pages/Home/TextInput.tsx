import * as React from 'react'

const styles = require('./index.less')

interface IProps {
    onChange: (value: string) => void
    initializeValue: string
}

class TextInput extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            noteValue: ''
        }
    }

    componentDidMount() {
        const { initializeValue } = this.props
        this.setState({ noteValue: initializeValue })
    }

    render() {
        const { noteValue } = this.state

        return (
            <div className={styles['note-input']}>
                <textarea
                    placeholder="请输入内容"
                    className={styles['note-input-textarea']}
                    value={noteValue}
                    autoFocus
                    onBlur={this.handleValueChange}
                    onKeyUp={this.noteInputKeyup}
                    onChange={this.handleNoteValueChange}
                ></textarea>
            </div>
        )
    }

    handleValueChange = () => {
        const { onChange, initializeValue = '' } = this.props

        let noteValue = this.state.noteValue

        if (noteValue.trim() === '') {
            noteValue = initializeValue
        }

        onChange && onChange(noteValue)
    }

    handleNoteValueChange = (e: any) => {
        this.setState({ noteValue: e.target.value })
    }

    noteInputKeyup = (e: any) => {
        if (e.ctrlKey && e.keyCode === 13) {
            e.target.blur()
        }
    }
}

export default TextInput
