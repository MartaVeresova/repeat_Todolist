const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
}
type InitialStateType = typeof initialState


export const appReducer = (state = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {

        case 'SET-APP-STATUS':
            return {...state, status: action.status}

        case 'SET-APP-ERROR':
            return {...state, error: action.error}

        case 'SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}

        default:
            return state
    }
}

//actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'SET-APP-STATUS', status} as const)

export const setAppErrorAC = (error: string | null) =>
    ({type: 'SET-APP-ERROR', error} as const)

export const setIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'SET-IS-INITIALIZED', isInitialized} as const)


//thunks


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>


export type AppActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetIsInitializedActionType
