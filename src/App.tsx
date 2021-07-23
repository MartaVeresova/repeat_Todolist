import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from './components/TodoList';
import {AddItemForm} from './components/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addNewTodoListAC, addNewTodoListTC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodoListAC, removeTodoListTC,
    TodoListDomainType
} from './state/todoLists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TasksType} from './api/todolist-api';


export type TaskStateType = {
    [key: string]: Array<TasksType>
}

function App() {

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


    const todoListComponents = todoLists.map(tl =>
        <Grid item key={tl.id}>
            <Paper elevation={4} style={{padding: '15px'}}>
                <TodoList
                    todoListId={tl.id}
                    title={tl.title}
                    changeFilter={changeFilter}
                    filter={tl.filter}
                    removeTodoList={removeTodoList}
                    changeTodoListTitle={changeTodoListTitle}
                />
            </Paper>
        </Grid>
    )

    return (
        <div>
            <AppBar position={'static'}>
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <IconButton color={'inherit'}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        TodoLists
                    </Typography>
                    <Button
                        color={'inherit'}
                        variant={'outlined'}
                    >
                        LogIn
                    </Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm addItem={addNewTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoListComponents}
                </Grid>
            </Container>
        </div>
    )
}

export default App;
