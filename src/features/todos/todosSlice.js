import { client } from '../../api/client';
const initialState = [];


function nextTodoId(todos) {
   const maxId = todos.reduce((maxId,todo) => Math.max(todo.id, maxId), -1);
   return maxId + 1;
};

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
      case 'todos/todoAdded': {
          return [...state, action.payload];
      }
      case 'todos/todoToggled': {
          return state.map(todo => {
              if (todo.id !== action.payload) {
                  return todo;
              }

              return {
                  ...todo,
                  completed: !todo.completed
              }
          })
      }
      case 'todos/colorSelected': {
          const { color, todoId } = action.payload
          return state.map((todo) => {
              if (todo.id !== todoId) {
                  return todo;
              }
              return {
                  ...todo,
                  color,
              }
          })
      }
      case 'todos/todoDeleted': {
          return state.filter((todo) => todo.id !== action.payload)
      }
      case 'todos/allCompleted': {
          return state.map((todo) => {
              return { ...todo, completed: true }
          })
      }
      case 'todos/completedCleared': {
          return state.filter((todo) => !todo.completed)
      }
      case 'todos/todosLoaded': {
          //  Replace the existing state entirely by returning the new value
          return action.payload;
      }
      default:
          return state;
  }
};

// Thunk function for loading initial to do data for adding to the store this is called once in index.js
export async function fetchTodos(dispatch, getState) {
    const response = await client.get('/fakeApi/todos');
    dispatch({ type: 'todos/todosLoaded', payload: response.todos });
};

// this middleware function or "Thunk" will help us ad a new todo to our fake db then dispatches changes to our store
// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
    return async function saveNewTodoThunk(dispatch, getState) {
      //  Now we can use the text value and send it to the server   
      const initialTodo = { text };
      // post to fake api
      const response = await client.post('/fakeApi/todos', { todo: initialTodo });
      // dispatch data to the redux store
      dispatch({ type: 'todos/todoAdded', payload: response.todo });
    }
};