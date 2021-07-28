import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {
    addNewTodoListTC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodoListTC,
    TodoListDomainType
} from '../state/todoLists-reducer';
import Grid from '@material-ui/core/Grid';
import {AddItemForm} from './AddItemForm';
import Paper from '@material-ui/core/Paper';
import {TodoList} from './TodoList';
import {Redirect} from 'react-router-dom';

export const TodolistList: React.FC = () => {

    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(fetchTodolistsTC())
    }, [dispatch, isLoggedIn])

    //todoLists:
    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId))
    }, [dispatch])

    const addNewTodoList = useCallback((newTitle: string) => {
        dispatch(addNewTodoListTC(newTitle))
    }, [dispatch])

    const changeTodoListTitle = useCallback((title: string, todoListId: string) => {
        dispatch(changeTodoListTitleAC(title, todoListId))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todoListId: string) => {  //логическая функция для setFilter
        dispatch(changeTodoListFilterAC(value, todoListId))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px 0'}}>
            <AddItemForm addItem={addNewTodoList}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todoLists.map(tl =>
                    <Grid item key={tl.id}>
                        <Paper elevation={4} style={{padding: '15px'}}>
                            <TodoList
                                todoListId={tl.id}
                                title={tl.title}
                                filter={tl.filter}
                                entityStatus={tl.entityStatus}
                                changeFilter={changeFilter}
                                removeTodoList={removeTodoList}
                                changeTodoListTitle={changeTodoListTitle}
                            />
                        </Paper>
                    </Grid>
                )
            }
        </Grid>
    </>
}