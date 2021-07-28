import {applyMiddleware, combineReducers, createStore} from 'redux';
import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodoActionsType, todoListsReducer} from './todoLists-reducer';
import thunk, {ThunkAction} from 'redux-thunk'
import {AppActionsType, appReducer} from './app-reducer';
import {AuthActionsType, authReducer} from './auth-reducer';


export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionsType>

export type AppRootActionsType =
    | TodoActionsType
    | TasksActionsType
    | AppActionsType
    | AuthActionsType

//@ts-ignore
window.store = store