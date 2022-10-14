import {useState} from "react";


function DisplayTodoList(props: { todos: string[]; setTodos: (e: string[])=>void;}) {
    const todos: string[] = props.todos;
    return todos?.length > 0 ? (
        <ul className="todo-list">
            {todos.map(
                (todo, index) => {
                    const DeleteTodo = () => {
                        var todos1 = [...todos.slice(0, index-1), ...todos.slice(index, todos.length)];
                        props.setTodos(todos1);
                    }

                    return (
                        <div className="todo">
                            <li key={index}> {todo} </li>
                            <button className="delete-button" onClick={DeleteTodo}>
                                Delete
                            </button>
                        </div>
                    )
                }
            )}
        </ul>
    ) : (
        <div className="empty">
            <p>No task found</p>
        </div>
    )
}


export function TodoList() {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState<string[]>([]);
    const addTodo = () => {
        setTodos(
            [...todos, todo]
        );
        setTodo("");
    }
    return (
        <div className="input-wrapper">
        <DisplayTodoList todos={todos} setTodos={setTodos} />
        <input
                type="text"
                name="todo"
                value={todo}
                placeholder="Create a new todo"
                onChange={
                    (e) => {
                        setTodo(e.target.value);
                    }
                }
            />
            <button className="add-bottom" onClick={
                () => {addTodo()}
            }>Add</button>
        </div>
    )
}
