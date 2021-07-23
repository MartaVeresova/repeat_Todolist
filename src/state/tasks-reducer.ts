import {TaskStateType} from '../App';
import {AddNewTodoListActionsType, RemoveTodoListActionsType, SetTodolistsActionsType} from './todoLists-reducer';
import {ModelType, TasksType, todolistApi} from '../api/todolist-api';
import {AppRootStateType, AppThunk} from './store';


const initialState: TaskStateType = {}
type InitialStateType = typeof initialState

export const tasksReducer = (state = initialState, action: TasksActionsType): InitialStateType => {
    switch (action.type) {

        case 'SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks.map(t => ({...t}))
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
                [action.task.todoListId]: [{...action.task}, ...state[action.task.todoListId]]
            }

        // case 'CHANGE-TASK-STATUS':
        //     return {
        //         ...state,
        //         [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
        //             ...t,
        //             isDone: action.newIsDoneValue
        //         } : t)
        //     }
        //
        // case 'CHANGE-TASK-TITLE':
        //     return {
        //         ...state,
        //         [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
        //             ...t,
        //             title: action.newTitleValue
        //         } : t)
        //     }

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
                [action.todoListID]: []
            }

        case 'REMOVE-TODOLIST':
            const stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy

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


//thunks
export const fetchTasksTC = (todolistId: string): AppThunk =>
    async dispatch => {
        const res = await todolistApi.getTasks(todolistId)
        dispatch(setTaskAC(todolistId, res.data.items))
    }

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk =>
    async dispatch => {
        const res = await todolistApi.deleteTask(todolistId, taskId)
        dispatch(removeTaskAC(taskId, todolistId))
    }

export const addNewTaskTC = (todolistId: string, title: string): AppThunk =>
    async dispatch => {
        const res = await todolistApi.createTask(todolistId, title)
        dispatch(addNewTaskAC(todolistId, res.data.data.item))
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
            const res = await todolistApi.updateTask(todolistId, taskId, apiModel)
            dispatch(updateTaskAC(taskId, domainModel, todolistId))
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

export type TasksActionsType =
    | SetTaskActionType
    | SetTodolistsActionsType
    | RemoveTasksActionType
    | AddNewTaskActionType
    | UpdateTaskActionType
    | RemoveTodoListActionsType
    | AddNewTodoListActionsType
