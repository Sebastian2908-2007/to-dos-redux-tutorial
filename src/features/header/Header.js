import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const Header = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => setText(e.target.value);

  // if a user presses enter dispatch with our text as the payload and clear the text
  const handleKeyDown = e => {
      const trimmedText = e.target.value.trim();
      // if user pressed enter on keyboard
      if(e.key === 'Enter' && trimmedText) {
         // Dispatch th 'todo added' Action with this text
         dispatch({ type: 'todos/todoAdded', payload: trimmedText });
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