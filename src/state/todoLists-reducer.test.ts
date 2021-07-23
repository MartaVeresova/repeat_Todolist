import {v1} from 'uuid';
import {
    addNewTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    todoListsReducer
} from './todoLists-reducer';
import {FilterValuesType, TodoListType} from '../App';

test('correct todolist should be removed', () => {
    const todoListID1 = v1()
    const todoListID2 = v1()

    const startState: Array<TodoListType> = [
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'}
    ]

    // const endState = todoListsReducer(startState, {
    //     type: REMOVE_TODOLIST,
    //     todoListId: todoListID1
    // })
    const endState = todoListsReducer(startState, removeTodoListAC(todoListID1))

    expect(endState[0].id).toBe(todoListID2)
    expect(endState.length).toBe(1)
})

test('correct todolist should be added', () => {
    const todoListID1 = v1()
    const todoListID2 = v1()

    const newTodoListTitle = 'New todoList'
    const startState: Array<TodoListType> = [
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'}
    ]

    // const endState = todoListsReducer(startState, {
    //     type: ADD_NEW_TODOLIST,
    //     title: newTodoListTitle
    // })
    const endState = todoListsReducer(startState, addNewTodoListAC(newTodoListTitle))

    expect(endState[0].title).toBe(newTodoListTitle)
    expect(endState.length).toBe(3)
})

test('correct todolist should change its name', () => {
    const todoListID1 = v1()
    const todoListID2 = v1()

    const newTodoListTitle = 'New todoList'
    const startState: Array<TodoListType> = [
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'}
    ]

    // const endState = todoListsReducer(startState, {
    //     type: CHANGE_TODOLIST_TITLE,
    //     title: newTodoListTitle,
    //     todoListId: todoListID2
    // })
    const endState = todoListsReducer(startState, changeTodoListTitleAC(newTodoListTitle, todoListID2))

    expect(endState[1].title).toBe(newTodoListTitle)
    expect(endState[0].title).toBe('What to learn')
})

test('', () => {
    const todoListID1 = v1()
    const todoListID2 = v1()

    const newFilter: FilterValuesType = 'completed'
    const startState: Array<TodoListType> = [
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'}
    ]

    // const endState = todoListsReducer(startState, {
    //     type: CHANGE_FILTER,
    //     value: newFilter,
    //     todoListId: todoListID2
    // })
    const endState = todoListsReducer(startState, changeTodoListFilterAC(newFilter, todoListID2))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})