import {tasksReducer} from './tasks-reducer';
import {TaskStateType, TodoListType} from '../App';
import {addNewTodoListAC, todoListsReducer} from './todoLists-reducer';

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodoListsState: Array<TodoListType> = [];

    const action = addNewTodoListAC('new todolist');

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)


    // {'xxx': []}
    // [{id: 'xxx', title: 'new todolist', filter: 'all'}]

    const keys = Object.keys(endTasksState); //['xxx']
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.todoListID);
    expect(idFromTodoLists).toBe(action.todoListID);
});

