import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TodoList from './components/TodoList';
import Notes from './components/Notes';
import Counter from './components/Counter';
import About from './components/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>My Jenkins App &mdash; v{process.env.REACT_APP_VERSION || 'dev'} &mdash; Built with Jenkins CI/CD</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
