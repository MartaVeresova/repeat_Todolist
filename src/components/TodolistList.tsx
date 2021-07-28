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
import {RequestStatusType} from '../state/app-reducer';
import Grid from '@material-ui/core/Grid';
import {AddItemForm} from './AddItemForm';
import Paper from '@material-ui/core/Paper';
import {TodoList} from './TodoList';

export const TodolistList: React.FC = () => {

    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

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