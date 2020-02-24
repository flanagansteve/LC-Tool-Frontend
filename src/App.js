import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import GlobalStyle, { CSSReset } from './GlobalStyle'
import HomePage from './HomePage/HomePage';
import LoginPage from './LoginPage/LoginPage';
import Nav from './common/components/Nav';

// TODO It seems like having the presentational nav in this mostly-container
//      component is poor separation of concerns. Look into this.
function App() {
  return (
    <Router>
      <CSSReset />
      <GlobalStyle />
      <Nav/>
      <Switch>
        <Route path="/create"/>
        <Route path="/review"/>
        <Route path="/manage"/>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/">
          <HomePage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
