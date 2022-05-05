import { client } from '../../api/client';
import { createSelector } from 'reselect';
import { StatusFilters } from '../filters/filtersSlice';
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

// todos loaded action creator
export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
};

// action creator for adding a todo
export const todoAdded = todo => {
    return {
        type: 'todos/todoAdded',
        payload: todo
    }
};


// Thunk function for loading initial to do data for adding to the store this is called once in index.js
export  function fetchTodos() {
    return async function fetchTodosThunk(dispatch, getState) { 
    const response = await client.get('/fakeApi/todos');
    dispatch(todosLoaded(response.todos));
    }
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
      dispatch(todoAdded(response.todo));
    }
};

// memoizing selector function with `createSelector` imported from reselect
export const selectTodoIds = createSelector(
    // First , pass one or more "input selector" functions:
    state => state.todos,
    // then an; output selector that recieves all the input results as arguments
    // and returns a final result value
    todos => todos.map(todo => todo.id)
);

//memoized selector that returns that filtered list of todos.
export const selectFilteredTodos = createSelector(
    // First input selector: all todos
    state => state.todos,
    // Second input selector: current status filter
    state => state.filters.status,
    // Output selector: recieves both values
    (todos, status) => {
        // status filters All selected returns all todos
        if (status === StatusFilters.All) {
            return todos;
        }
 
        const completedStatus = status === StatusFilters.Completed;
               // Return either active or completed todos based on filter   
               return todos.filter(todo => todo.completed === completedStatus)
    }
);

// use "selectFilteredTodos" selector as an input to another selector that returns the IDs of those todos:
export const selectFilteredTodoIds = createSelector(
    // Pass our other memoized selector as an input
    selectFilteredTodos,
    // And derive data in the output selector
    filteredTodos => filteredTodos.map(todo => todo.id)
);