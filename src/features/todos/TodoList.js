import React from 'react';
import { useSelector } from 'react-redux';
import TodoListItem from './TodoListItem';

const selectTodos = state => state.todos;

const TodoList = () => {
    //  useSelector automatically subscribes to the Redux store for us! That way, any time an action is dispatched, it will call its selector function again right away.
    // If the value returned by the selector changes from the last time it ran, useSelector will force our component to re-render with the new data. All we have to do is call useSelector()
  const todos = useSelector(selectTodos);

  const renderedListItems = todos.map((todo) => {
    return <TodoListItem key={todo.id} todo={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList;