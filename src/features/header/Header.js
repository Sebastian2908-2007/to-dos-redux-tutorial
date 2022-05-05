import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import saveNewTodo middleware function
import { saveNewTodo } from '../todos/todosSlice';

const Header = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => setText(e.target.value);

  // if a user presses enter dispatch with our text and 'ThunK function' as the payload and clear the text
  const handleKeyDown = e => {
      const trimmedText = text.trim();
      // if user pressed enter on keyboard
      if(e.which === 13 && trimmedText) {
         
         
         // Dispatch thunk function from todoslice.js with our text value
         dispatch(saveNewTodo(trimmedText));
         // and clear text out of the input
         setText('');
      }
  };

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </header>
  )
}

export default Header