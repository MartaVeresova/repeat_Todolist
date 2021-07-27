import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../state/app-reducer';
import {Dispatch} from 'redux';
import {CommonResponseType} from '../api/todolist-api';


export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: CommonResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType, err: { message: string }) => {
    dispatch(setAppErrorAC(err.message))
    dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppStatusActionType | SetAppErrorActionType>

