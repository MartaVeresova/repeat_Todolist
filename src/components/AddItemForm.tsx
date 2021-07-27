import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import {AddBox} from '@material-ui/icons';
import {IconButton, TextField} from '@material-ui/core';

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled}: AddItemFormPropsType) => {

    const [newItemTitle, setNewItemTitle] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeSetNewItemTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNewItemTitle(e.currentTarget.value)
        setError(false)
    }, [])

    const onClickAddItem = useCallback(() => {
        if (newItemTitle.trim() !== '') {
            addItem(newItemTitle.trim())
        } else {
            setError(true)
        }
        setNewItemTitle('')
    }, [addItem, newItemTitle])

    const onKeyPressEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        (e.key === 'Enter') && onClickAddItem()
    }, [onClickAddItem])

    const onBlur = useCallback(() => setError(false), [])

    return (
        <div>
            <TextField
                variant={'outlined'}
                error={error}
                placeholder="Enter a new title"
                value={newItemTitle}
                onChange={onChangeSetNewItemTitle}
                onKeyPress={onKeyPressEnter}
                label={'Title'}
                helperText={error && 'Title is required!'}
                size={'small'}
                onBlur={onBlur}
                disabled={disabled}
            />
            <IconButton onClick={onClickAddItem} color={'primary'}>
                <AddBox/>
            </IconButton>
        </div>
    )
})