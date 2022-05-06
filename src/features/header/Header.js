import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import saveNewTodo middleware function
import { saveNewTodo } from '../todos/todosSlice';

const Header = () => {
  const [text, setText] = useState('');
  // state to let us know if loading spinner should display
  const [status, setStatus] = useState('idle');
  const dispatch = useDispatch();

  const handleChange = (e) => setText(e.target.value);

  // if a user presses enter dispatch with our text and 'ThunK function' as the payload and clear the text
  const handleKeyDown = async e => {
      const trimmedText = text.trim();
      // if user pressed enter on keyboard
      if(e.which === 13 && trimmedText) {
         setStatus('loading');
         
         // Dispatch thunk function from todoslice.js with our text value
         await dispatch(saveNewTodo(trimmedText));
         // and clear text out of the input
         setText('');
         setStatus('idle');
      }
  };

  let isLoading = status === 'loading';
  let placeholder = isLoading ? '' : 'what needs to be done?';
  let loader = isLoading ? <div className='loader' /> : null;
  

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header