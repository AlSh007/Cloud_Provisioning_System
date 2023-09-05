import React from 'react';
import './App.css';
import CloudEnvironmentRequestForm from './CloudEnvironmentRequestForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cloud Environment Provisioning System</h1>
      </header>
      <main>
        <CloudEnvironmentRequestForm />
      </main>
    </div>
  );
}

export default App;
