import React, {MouseEvent, useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {addNewTaskTC, fetchTasksTC} from '../state/tasks-reducer';
import {Task} from './Task';
import {changeTodoListTitleTC, FilterValuesType} from '../state/todoLists-reducer';
import {RequestStatusType} from '../state/app-reducer';
import {TasksDomainType} from '../App';


export type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export const TodoList = React.memo(({
                                        todoListId,
                                        removeTodoList,
                                        changeTodoListTitle,
                                        title,
                                        changeFilter,
                                        filter,
                                        entityStatus,
                                    }: TodoListPropsType) => {

    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, Array<TasksDomainType>>(state => state.tasks[todoListId])

    useEffect(() => {
        dispatch(fetchTasksTC(todoListId))
    }, [dispatch, todoListId])

    const getTaskForTodoList = () => {
        switch (filter) {
            case 'active':
                return tasks.filter(t => !t.status)
            case 'completed':
                return tasks.filter(t => t.status)
            default:
                return tasks
        }
    }
    const newTasks = getTaskForTodoList()


    const onChangeFilterAll = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        changeFilter('all', todoListId)
    }, [changeFilter, todoListId])

    const onChangeFilterActive = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        changeFilter('active', todoListId)
    }, [changeFilter, todoListId])

    const onChangeFilterCompleted = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        changeFilter('completed', todoListId)
    }, [changeFilter, todoListId])

    const onClickRemoveTodolist = useCallback(() => {
        removeTodoList(todoListId)
    }, [removeTodoList, todoListId])

    const addNewTask = useCallback((newTitle: string) => dispatch(addNewTaskTC(todoListId, newTitle)), [dispatch, todoListId])

    const changeTitleToTodoList = useCallback((newTitle: string) => dispatch(changeTodoListTitleTC(newTitle, todoListId)), [dispatch, todoListId])

    return (
        <div>
            <h3 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <EditableSpan newTitle={title} changeTitle={changeTitleToTodoList} disabled={entityStatus === 'loading'}/>
                <IconButton onClick={onClickRemoveTodolist} disabled={entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addNewTask} disabled={entityStatus === 'loading'}/>
            <ul style={{listStyle: 'none', paddingLeft: '0px'}}>
                {
                    newTasks.map(t => {
                        return (
                            <Task
                                key={t.id}
                                task={t}
                                todoListId={todoListId}
                                entityTaskStatus={t.entityTaskStatus}
                            />)
                    })
                }
            </ul>
            <div>
                <Button
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    onClick={onChangeFilterAll}
                >
                    All
                </Button>
                <Button
                    style={{marginLeft: '3px'}}
                    variant={filter === 'active' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    onClick={onChangeFilterActive}
                >
                    Active
                </Button>
                <Button
                    style={{marginLeft: '3px'}}
                    variant={filter === 'completed' ? 'contained' : 'outlined'}
                    size={'small'}
                    color={'primary'}
                    onClick={onChangeFilterCompleted}
                >
                    Completed
                </Button>
            </div>
        </div>
    )
})