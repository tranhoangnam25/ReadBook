import React from 'react';

function App() {
  const tasks = ['Learn React', 'Build an App', 'Enjoy Coding'];

  return (
    <div>
      <h1>My To-Do List</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;