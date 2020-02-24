import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import GlobalStyle, { CSSReset } from './GlobalStyle'
import HomePage from './HomePage/HomePage';

function App() {
  return (
    <Router>
      <CSSReset />
      <GlobalStyle />
      <Switch>
        <Route path="/">
          <HomePage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
