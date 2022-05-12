import React from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'

function App() {
  return (
    <div className="App">
      <nav>
        <section>
          <h1>Sebastian's Redux todo tracker</h1>
        </section>
      </nav>
      <main>
        <section className="medium-container">
          <h2>Stuff to do</h2>
          <div className="todoapp">
            <Header />
            <TodoList />
            <Footer />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
