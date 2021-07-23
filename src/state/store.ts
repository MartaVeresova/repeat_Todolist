import {applyMiddleware, combineReducers, createStore} from 'redux';
import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodoActionsType, todoListsReducer} from './todoLists-reducer';
import thunk, {ThunkAction} from 'redux-thunk'


export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionsType>

export type AppRootActionsType =
    | TodoActionsType
    | TasksActionsType

//@ts-ignore
window.store = store