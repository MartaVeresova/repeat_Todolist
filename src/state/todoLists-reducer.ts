import {ResponseStatuses, todolistApi, TodoListType} from '../api/todolist-api';
import {AppThunk} from './store';
import {RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';


const initialState: TodoListDomainType[] = []
type InitialStateType = typeof initialState

export const todoListsReducer = (state = initialState, action: TodoActionsType): InitialStateType => {
    switch (action.type) {

        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListId)

        case 'ADD-NEW-TODOLIST':
            const newTodoList: TodoListDomainType = {
                id: action.todoListId,
                title: action.title,
                addedDate: '',
                order: 0,
                filter: 'all',
                entityStatus: 'idle',
            }
            return [newTodoList, ...state]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.value} : tl)

        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todoListId ? {...tl, entityStatus: action.entityStatus} : tl)

        default:
            return state
    }
}

//actions
export const setTodolistsAC = (todolists: TodoListType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)

export const removeTodoListAC = (todoListId: string) =>
    ({type: 'REMOVE-TODOLIST', todoListId} as const)

export const addNewTodoListAC = (title: string, todoListId: string) =>
    ({type: 'ADD-NEW-TODOLIST', title, todoListId} as const)

export const changeTodoListTitleAC = (title: string, todoListId: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', title, todoListId} as const)

export const changeTodoListFilterAC = (value: FilterValuesType, todoListId: string) =>
    ({type: 'CHANGE-TODOLIST-FILTER', value, todoListId} as const)

export const changeTodolistEntityStatusAC = (entityStatus: RequestStatusType, todoListId: string) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', entityStatus, todoListId} as const)


//thunks
export const fetchTodolistsTC = (): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.getTodos()
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    }

export const removeTodoListTC = (todolistId: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC('loading', todolistId))
        try {
            const res = await todolistApi.deleteTodo(todolistId)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(removeTodoListAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }

    }

export const addNewTodoListTC = (newTitle: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await todolistApi.createTodo(newTitle)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(addNewTodoListAC(res.data.data.item.title, res.data.data.item.id))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }

    }

export const changeTodoListTitleTC = (newTitle: string, todolistId: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await todolistApi.createTodo(newTitle)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(changeTodoListTitleAC(newTitle, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }

    }


//types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type SetTodolistsActionsType = ReturnType<typeof setTodolistsAC>
export type RemoveTodoListActionsType = ReturnType<typeof removeTodoListAC>
export type AddNewTodoListActionsType = ReturnType<typeof addNewTodoListAC>
export type ChangeTodoListTitleActionsType = ReturnType<typeof changeTodoListTitleAC>
export type ChangeTodoListFilterActionsType = ReturnType<typeof changeTodoListFilterAC>
export type ChangeTodolistEntityStatusActionsType = ReturnType<typeof changeTodolistEntityStatusAC>

export type TodoActionsType =
    | SetTodolistsActionsType
    | RemoveTodoListActionsType
    | AddNewTodoListActionsType
    | ChangeTodoListTitleActionsType
    | ChangeTodoListFilterActionsType
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ChangeTodolistEntityStatusActionsType