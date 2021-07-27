import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from './components/TodoList';
import {AddItemForm} from './components/AddItemForm';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Menu} from '@material-ui/icons';
import {
    addNewTodoListTC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodoListTC,
    TodoListDomainType
} from './state/todoLists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TasksType} from './api/todolist-api';
import {RequestStatusType} from './state/app-reducer';
import {ErrorSnackbar} from './components/ErrorSnackbar';

export type TasksDomainType = TasksType & {
    entityTaskStatus: RequestStatusType
}
export type TaskStateType = {
    [key: string]: Array<TasksDomainType>
}

function App() {

    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

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
                    filter={tl.filter}
                    entityStatus={tl.entityStatus}
                    changeFilter={changeFilter}
                    removeTodoList={removeTodoList}
                    changeTodoListTitle={changeTodoListTitle}
                />
            </Paper>
        </Grid>
    )

    return (
        <div>
            {status === 'loading' && <LinearProgress color="secondary" style={{position: 'fixed', width: '100%'}}/>}
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
            <ErrorSnackbar/>
        </div>
    )
}

export default App;
