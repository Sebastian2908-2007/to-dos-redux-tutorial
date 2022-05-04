import { combineReducers } from 'redux';
import todosReducer from './features/todos/todosSlice';
import filtersReducer from './features/filters/filtersSlice';



const rootReducer = combineReducers({
    // define a top level state field named todos, handled by todosReducer
    todos: todosReducer,
    filters: filtersReducer
});

export default rootReducer;

/*{type: 'todos/todoAdded', payload: todoText}
{type: 'todos/todoToggled', payload: todoId}
{type: 'todos/colorSelected, payload: {todoId, color}}
{type: 'todos/todoDeleted', payload: todoId}
{type: 'todos/allCompleted'}
{type: 'todos/completedCleared'}
{type: 'filters/statusFilterChanged', payload: filterValue}
{type: 'filters/colorFilterChanged', payload: {color, changeType}}*/