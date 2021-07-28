import React, {ChangeEvent, useCallback, useState} from 'react';
import {Input} from '@material-ui/core';

export type EditableSpanPropsType = {
    newTitle: string
    changeTitle: (newTitle: string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo(({newTitle, changeTitle, disabled}: EditableSpanPropsType) => {

    const [editMode, setEditMode] = useState(false)
    const [titleValue, setTitleValue] = useState(newTitle)

    const onEditMode = () => setEditMode(true)

    const offEditMode = useCallback(() => {
        setEditMode(false)
        if (titleValue.length > 100) {
            setTitleValue(newTitle)
        }
        changeTitle(titleValue)
    }, [changeTitle, titleValue, newTitle])

    const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.currentTarget.value)
    }, [setTitleValue])

    return (
        editMode
            ? <Input
                color={'primary'}
                value={titleValue}
                onChange={onChangeTitle}
                onBlur={offEditMode}
                autoFocus
                disabled={disabled}
            />
            : <span onDoubleClick={onEditMode} >{newTitle}</span>
    )
})