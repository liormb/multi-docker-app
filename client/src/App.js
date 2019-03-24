import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <div className="App-header-inner">
                            <div className="App-left">
                                <h3>Fibonacci</h3>
                            </div>
                            <div className="App-links">
                                <Link to="/">Home</Link>
                                <Link to="/about">About</Link>
                            </div>
                        </div>
                    </header>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
