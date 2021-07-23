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
import {TasksType} from '../api/todolist-api';


export type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
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
                                        filter
                                    }: TodoListPropsType) => {

    const tasks = useSelector<AppRootStateType, Array<TasksType>>(state => state.tasks[todoListId])
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(todoListId))
    }, [])

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

    const addNewTask = useCallback((newTitle: string) => dispatch(addNewTaskTC(todoListId, newTitle)), [todoListId])

    const changeTitleToTodoList = useCallback((newTitle: string) => dispatch(changeTodoListTitleTC(newTitle, todoListId)), [todoListId])

    return (
        <div>
            <h3 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <EditableSpan newTitle={title} changeTitle={changeTitleToTodoList}/>
                <IconButton onClick={onClickRemoveTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addNewTask}/>
            <ul style={{listStyle: 'none', paddingLeft: '0px'}}>
                {
                    newTasks.map(t => {
                        return (
                            <Task
                                key={t.id}
                                task={t}
                                todoListId={todoListId}
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