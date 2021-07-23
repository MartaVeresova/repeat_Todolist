import React, {ChangeEvent, useCallback, useState} from 'react';
import {Input} from '@material-ui/core';

export type EditableSpanPropsType = {
    newTitle: string
    changeTitle: (newTitle: string) => void
}

export const EditableSpan = React.memo(({newTitle, changeTitle}: EditableSpanPropsType) => {
    
    const [editMode, setEditMode] = useState(false)
    const [titleValue, setTitleValue] = useState(newTitle)

    const onEditMode = () => setEditMode(true)

    const offEditMode = useCallback(() => {
        setEditMode(false)
        changeTitle(titleValue)
    }, [changeTitle, titleValue])

    const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.currentTarget.value)
    }, [])

    return (
        editMode
            ? <Input
                color={'primary'}
                value={titleValue}
                onChange={onChangeTitle}
                onBlur={offEditMode}
                autoFocus
            />
            : <span onDoubleClick={onEditMode}>{newTitle}</span>
    )
})