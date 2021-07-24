import {v1} from 'uuid';
import {ResponseStatuses, todolistApi, TodoListType} from '../api/todolist-api';
import {AppRootStateType, AppThunk} from './store';
import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from './app-reducer';


const initialState: TodoListDomainType[] = []
type InitialStateType = typeof initialState

export const todoListsReducer = (state = initialState, action: TodoActionsType): InitialStateType => {
    switch (action.type) {

        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all'}))

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todoListId)

        case 'ADD-NEW-TODOLIST':
            const newTodoList: TodoListDomainType = {
                id: action.todoListID,
                title: action.title,
                addedDate: '',
                order: 0,
                filter: 'all',
            }
            return [newTodoList, ...state]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.value} : tl)

        default:
            return state
    }
}

//actions
export const setTodolistsAC = (todolists: TodoListType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)

export const removeTodoListAC = (todoListId: string) =>
    ({type: 'REMOVE-TODOLIST', todoListId: todoListId} as const)

export const addNewTodoListAC = (title: string) =>
    ({type: 'ADD-NEW-TODOLIST', title: title, todoListID: v1()} as const)

export const changeTodoListTitleAC = (title: string, todoListId: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', title: title, todoListId: todoListId} as const)

export const changeTodoListFilterAC = (value: FilterValuesType, todoListId: string) =>
    ({type: 'CHANGE-TODOLIST-FILTER', value: value, todoListId: todoListId} as const)


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
        const res = await todolistApi.deleteTodo(todolistId)
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(removeTodoListAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            if (res.data.messages.length) {
                dispatch(setAppErrorAC(res.data.messages[0]))
            } else {
                dispatch(setAppErrorAC('Some error'))
            }
            dispatch(setAppStatusAC('failed'))
        }
    }

export const addNewTodoListTC = (newTitle: string): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.createTodo(newTitle)
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(addNewTodoListAC(res.data.data.item.title))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            if (res.data.messages) {
                dispatch(setAppErrorAC(res.data.messages[0]))
            } else {
                dispatch(setAppErrorAC('Some error'))
            }
            dispatch(setAppStatusAC('failed'))
        }
    }

export const changeTodoListTitleTC = (newTitle: string, todolistId: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.createTodo(newTitle)
        if (res.data.resultCode === ResponseStatuses.succeeded) {
            dispatch(changeTodoListTitleAC(newTitle, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            if (res.data.messages) {
                dispatch(setAppErrorAC(res.data.messages[0]))
            } else {
                dispatch(setAppErrorAC('Some error'))
            }
            dispatch(setAppStatusAC('succeeded'))
        }
    }


//types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}

export type SetTodolistsActionsType = ReturnType<typeof setTodolistsAC>
export type RemoveTodoListActionsType = ReturnType<typeof removeTodoListAC>
export type AddNewTodoListActionsType = ReturnType<typeof addNewTodoListAC>
export type ChangeTodoListTitleActionsType = ReturnType<typeof changeTodoListTitleAC>
export type ChangeTodoListFilterActionsType = ReturnType<typeof changeTodoListFilterAC>

export type TodoActionsType =
    | SetTodolistsActionsType
    | RemoveTodoListActionsType
    | AddNewTodoListActionsType
    | ChangeTodoListTitleActionsType
    | ChangeTodoListFilterActionsType
    | SetAppStatusActionType
    | SetAppErrorActionType