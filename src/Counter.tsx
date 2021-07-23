import React, {useState} from 'react';
import './Counter.css';
import {v1} from 'uuid';

type TasksType = {
    id: string
    title: string
}

export function Test() {

    const [tasks, setTasks] = useState<Array<TasksType>>([
        {id: v1(), title: 'Hello'},
        {id: v1(), title: 'Bye'},
        {id: v1(), title: 'Yo'},
    ])

    const [newTaskTitle, setNewTaskTitle] = useState('')

    const addTask = (title: string) => {
        const newTask = {
            id: v1(),
            title
        }
        setTasks([...tasks, newTask])
    }


    return (
        <div className="App">
            <div>
                <h1>
                    Text
                </h1>
            </div>
            <div>
                <input
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.currentTarget.value)}
                />
            </div>
            <div className="textarea">
                <textarea/>
            </div>
            <div>
                <button onClick={() => {
                    addTask(newTaskTitle)
                    setNewTaskTitle('')
                }}>Add
                </button>
            </div>
            <div>
                <ul>
                    {
                        tasks.map(t => <li key={t.id}>{t.title}</li>)
                    }

                </ul>
            </div>
        </div>
    )
}