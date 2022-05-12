
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

// entity adapter
const todosAdapter = createEntityAdapter();

const initialState = todosAdapter.getInitialState({
  status: 'idle'
});


// We pass 'todos/fetchTodos' as the string prefix, and a "payload creator" 
//function that calls our API and returns a promise containing the fetched data.
// thunk function
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos');
  return response.todos;
});

//You can only pass one argument to the thunk when you dispatch it. If you need to pass multiple values, pass them in a single object
// The payload creator will receive an object as its second argument, which contains {getState, dispatch}, and some other useful values
//The thunk dispatches the pending action before running your payload creator, then dispatches either fulfilled or rejected based on whether the Promise you return succeeds or fails
export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
     const initialTodo = { text };
     const response = await client.post('/fakeApi/todos', { todo: initialTodo });
     return response.todo;

})



const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        }
      },
    },
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
    completedTodosCleared(state, action) {
    const completedIds = Object.values(state.entities)
    .filter(todo => todo.completed)
    .map(todo => todo.id)
    // use adapter function as a mutating update helper
    todosAdapter.removeMany(state, completedIds)
    },
    todosLoading(state, action) {
      state.status = 'loading'
    },
    todosLoaded(state, action) {
      const newEntities = {}
      action.payload.forEach((todo) => {
        newEntities[todo.id] = todo
      })
      state.entities = newEntities
      state.status = 'idle'
    },
    
  },
  extraReducers: builder => {
    builder
    .addCase(fetchTodos.pending, (state,action) => {
      state.status = 'loading'
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      todosAdapter.setAll(state, action.payload);
      state.status = 'idle';
    })
    .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  }
})

export const {
  allTodosCompleted,
  completedTodosCleared,
  todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled,
  todosLoaded,
  todosLoading,
} = todosSlice.actions

export default todosSlice.reducer




/*const selectTodoEntities = (state) => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, (entities) =>
  Object.values(entities)
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}*/

///////////////////////////////////////////////////////////////////////////////

/*export const { selectAll: selectTodos, selectById: selectTodoById } = 
todosAdapter.getSelectors(state => state.todos);*/

export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors(state => state.todos)

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

