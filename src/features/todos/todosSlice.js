import { client } from '../../api/client';
import { createSelector } from 'reselect';
import { StatusFilters } from '../filters/filtersSlice';
const initialState = {
    status: 'idle',
    entities: []
};


function nextTodoId(todos) {
   const maxId = todos.reduce((maxId,todo) => Math.max(todo.id, maxId), -1);
   return maxId + 1;
};

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
      case 'todos/todoAdded': {
          return {
              ...state,
              entities: [...state.entities, action.payload]
          }
      }
      case 'todos/todoToggled': {
         return {
             ...state,
             entities: state.entities.map(todo => {
                 if (todo.id !== action.payload) {
                     return todo;
                 }

                 return {
                     ...todo,
                     completed: !todo.completed
                 }
             })
         }
      }
      case 'todos/colorSelected': {
          const { color, todoId } = action.payload
          return {
              ...state,
              entities: state.entities.map((todo) => {
                 if (todo.id !== todoId) {
                     return todo;
                 }

                 return {
                     ...todo,
                     color,
                 }
              }),
          }
      }
      case 'todos/todoDeleted': {
          return {
              ...state,
              entities: state.entities.filter((todo) => todo.id !== action.payload),
          }
      }
      case 'todos/allCompleted': {
         return {
             ...state,
             entities: state.entities.map((todo) => {
                 return{ ...todo, completed: true }
             })
         }
      }
      case 'todos/completedCleared': {
         return {
             ...state,
             entities: state.entities.filter((todo) => !todo.completed),
         }
      }
      case 'todos/todosLoaded': {
        return {
            ...state,
            status: 'idle',
            entities: action.payload
        }
      }
      case 'todos/todosLoading': {
          return {
              ...state,
              status: 'loading'
          }
      }
      
      default:
          return state;
  }
};
// Actions creators start
// action creator for adding a todo
export const todoAdded = todo => {
    return {
        type: 'todos/todoAdded',
        payload: todo
    }
};


export const todoToggled = (todoId) => ({
    type: 'todos/todoToggled',
    payload: todoId,
  })
  
  export const todoColorSelected = (todoId, color) => ({
    type: 'todos/colorSelected',
    payload: { todoId, color },
  })
  
  export const todoDeleted = (todoId) => ({
    type: 'todos/todoDeleted',
    payload: todoId,
  })
  
  export const allTodosCompleted = () => ({ type: 'todos/allCompleted' })
  
  export const completedTodosCleared = () => ({ type: 'todos/completedCleared' })

// todos loading action 
export const todosLoading = () => ({ type: 'todos/todosLoading' });

// todos loaded action creator
export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
};
// Actions creators end



// Thunk function for loading initial to do data for adding to the store this is called once in index.js
export  const fetchTodos = () => async dispatch => {
   dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos');
    dispatch(todosLoaded(response.todos));
    
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



export const selectTodos = state => state.todos.entities;

export const selectTodoById = (state, todoId) => {
    return selectTodos(state).find(todo => todo.id === todoId);
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
    selectTodos,
    // Second input selector: all filter values
    state => state.filters,
    // Output selector: receives both values
    (todos, filters) => {
      const { status, colors } = filters
      const showAllCompletions = status === StatusFilters.All
      if (showAllCompletions && colors.length === 0) {
        return todos
      }
  
      const completedStatus = status === StatusFilters.Completed
      // Return either active or completed todos based on filter
      return todos.filter(todo => {
        const statusMatches =
          showAllCompletions || todo.completed === completedStatus
        const colorMatches = colors.length === 0 || colors.includes(todo.color)
        return statusMatches && colorMatches
      })
    }
  )

// use "selectFilteredTodos" selector as an input to another selector that returns the IDs of those todos:
export const selectFilteredTodoIds = createSelector(
    // Pass our other memoized selector as an input
    selectFilteredTodos,
    // And derive data in the output selector
    filteredTodos => filteredTodos.map(todo => todo.id)
);