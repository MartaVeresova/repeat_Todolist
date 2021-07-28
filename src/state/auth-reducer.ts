import {AppThunk} from './store';
import {authApi, RequestLoginType, ResponseStatuses} from '../api/todolist-api';
import {setAppStatusAC, setIsInitializedAC} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState


export const authReducer = (state = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {

        case 'SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}

        default:
            return state
    }
}

//actions
export const setIsLoggedInAC = (isLoggedIn: boolean) =>
    ({type: 'SET-IS-LOGGED-IN', isLoggedIn} as const)


//thunks
export const initializeAppTC = (): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authApi.me()
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
            dispatch(setIsInitializedAC(true))
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }
    }

export const loginTC = (data: RequestLoginType): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authApi.login(data)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }
    }

export const logoutTC = (): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authApi.logout()
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }
    }

//types
export type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>


export type AuthActionsType =
    | SetIsLoggedInActionType
