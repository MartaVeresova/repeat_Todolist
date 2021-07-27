import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from './EditableSpan';
import {Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {removeTaskTC, updateTaskTC} from '../state/tasks-reducer';
import {useDispatch} from 'react-redux';
import {TaskStatuses} from '../api/todolist-api';
import {RequestStatusType} from '../state/app-reducer';
import {TasksDomainType} from '../App';

export type TaskPropsType = {
    task: TasksDomainType
    todoListId: string
    entityTaskStatus: RequestStatusType
}

export const Task = React.memo(({task, todoListId, entityTaskStatus}: TaskPropsType) => {
    // const task = useSelector<AppRootStore, TasksPropsType>(state => state.tasks[todoListId].find(task => task.id === taskFromProps.id)!)

    const dispatch = useDispatch()

    const onClickRemoveTask = useCallback(() => {
        dispatch(removeTaskTC(todoListId, task.id))
    }, [dispatch, task, todoListId])

    const onChangeChecked = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTaskTC(todoListId, task.id, {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}))
    }, [dispatch, task, todoListId])

    const onChangeTitle = useCallback((changedTitle: string) => {
        dispatch(updateTaskTC(todoListId, task.id, {title: changedTitle}))
    }, [dispatch, task, todoListId])

    const taskClasses = task.status === TaskStatuses.Completed ? 'isDone' : ''

    return (
        <li key={task.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className={taskClasses}>
                <Checkbox
                    color={'primary'}
                    checked={task.status === TaskStatuses.Completed}
                    onChange={onChangeChecked}
                    disabled={entityTaskStatus === 'loading'}
                />
                <EditableSpan
                    newTitle={task.title}
                    changeTitle={onChangeTitle}
                    disabled={entityTaskStatus === 'loading'}
                />
            </span>
            <IconButton onClick={onClickRemoveTask} disabled={entityTaskStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </li>
    )
})