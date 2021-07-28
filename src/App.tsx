import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Menu} from '@material-ui/icons';
import {TasksType} from './api/todolist-api';
import {RequestStatusType} from './state/app-reducer';
import {ErrorSnackbar} from './components/ErrorSnackbar';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Login} from './components/Login';
import {TodolistList} from './components/TodolistList';
import {useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';

export type TasksDomainType = TasksType & {
    entityTaskStatus: RequestStatusType
}
export type TaskStateType = {
    [key: string]: Array<TasksDomainType>
}

function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

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
                <Switch>
                    <Route exact path={'/'} render={() => <TodolistList/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={'*'} to={'/404'} />
                </Switch>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default App;

