import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Fib from "./Fib";
import OtherPage from "./OtherPage";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Fibonacci Calculator</h1>
          <Link className="App-link" to="/">Home</Link>
          <Link className="App-link" to="/other_page">Other Page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path="/other_page" component={OtherPage}/>
        </div>
      </div>
    </Router>
  );
}

export default App;
