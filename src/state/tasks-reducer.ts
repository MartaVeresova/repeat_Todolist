import {TaskStateType} from '../App';
import {AddNewTodoListActionsType, RemoveTodoListActionsType, SetTodolistsActionsType} from './todoLists-reducer';
import {ModelType, ResponseStatuses, TasksType, todolistApi} from '../api/todolist-api';
import {AppRootStateType, AppThunk} from './store';
import {RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';


const initialState: TaskStateType = {}
type InitialStateType = typeof initialState

export const tasksReducer = (state = initialState, action: TasksActionsType): InitialStateType => {
    switch (action.type) {

        case 'SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))
            }

        case 'SET-TODOLISTS':
            action.todolists.forEach(tl => ({...state[tl.id] = []}))
            return {...state}

        case 'REMOVE-TASKS':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.id)
            }

        case 'ADD-NEW-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityTaskStatus: 'idle'}, ...state[action.task.todoListId]]
            }

        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                    ...t,
                    ...action.model
                } : t)
            }

        case 'ADD-NEW-TODOLIST':
            return {
                ...state,
                [action.todoListId]: []
            }

        case 'REMOVE-TODOLIST':
            const stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy

        case 'CHANGE-TASK-ENTITY-STATUS':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                    ...t,
                    entityTaskStatus: action.entityTaskStatus
                } : t)
            }

        default:
            return state
    }
}

//actions
export const setTaskAC = (todolistId: string, tasks: TasksType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks} as const)

export const removeTaskAC = (id: string, todoListId: string) =>
    ({type: 'REMOVE-TASKS', id, todoListId} as const)

export const addNewTaskAC = (todoListId: string, task: TasksType) =>
    ({type: 'ADD-NEW-TASK', todoListId, task} as const)

export const updateTaskAC = (taskId: string, model: UpdateDomainModelType, todoListId: string) =>
    ({type: 'UPDATE-TASK', taskId, model, todoListId} as const)

export const changeTaskEntityStatusAC = (entityTaskStatus: RequestStatusType, todoListId: string, taskId: string) =>
    ({type: 'CHANGE-TASK-ENTITY-STATUS', entityTaskStatus, todoListId, taskId} as const)


//thunks
export const fetchTasksTC = (todolistId: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.getTasks(todolistId)
        dispatch(setTaskAC(todolistId, res.data.items))
        dispatch(setAppStatusAC('succeeded'))
    }

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC('loading', todolistId, taskId))
        try {
            const res = await todolistApi.deleteTask(todolistId, taskId)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }
    }

export const addNewTaskTC = (todolistId: string, title: string): AppThunk =>
    async dispatch => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await todolistApi.createTask(todolistId, title)
            if (res.data.resultCode === ResponseStatuses.succeeded) {
                dispatch(addNewTaskAC(todolistId, res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (err) {
            handleServerNetworkError(dispatch, err.message)
        }
    }

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainModelType): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {
        const changedTask = getState().tasks[todolistId].find(t => t.id === taskId)
        if (changedTask) {
            const apiModel: ModelType = {
                title: changedTask.title,
                description: changedTask.description,
                status: changedTask.status,
                priority: changedTask.priority,
                startDate: changedTask.startDate,
                deadline: changedTask.deadline,
                ...domainModel
            }
            dispatch(setAppStatusAC('loading'))
            try {
                const res = await todolistApi.updateTask(todolistId, taskId, apiModel)
                if (res.data.resultCode === ResponseStatuses.succeeded) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(dispatch, res.data)
                }
            } catch (err) {
                handleServerNetworkError(dispatch, err.message)
            }

        }
    }


//types
export type UpdateDomainModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export type SetTaskActionType = ReturnType<typeof setTaskAC>
export type RemoveTasksActionType = ReturnType<typeof removeTaskAC>
export type AddNewTaskActionType = ReturnType<typeof addNewTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>

export type TasksActionsType =
    | SetTaskActionType
    | SetTodolistsActionsType
    | RemoveTasksActionType
    | AddNewTaskActionType
    | UpdateTaskActionType
    | RemoveTodoListActionsType
    | AddNewTodoListActionsType
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ChangeTaskEntityStatusActionType