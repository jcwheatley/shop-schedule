import React from 'react';
import { BrowserRouter as Router, Switch, Route,  } from "react-router-dom";
// import { Switch } from 'react-router/cjs/react-router';

// import Home from '../pages/Home';
import Home from './Components/Home';
import Landing from './Components/Landing';
import Schedule from './Components/Schedule';

const Main = () => {
  return (
    <Router>
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
        <Route exact path='/'> <Landing/></Route>
        <Route exact path='/schedule'><Schedule/></Route>
        </Switch>
    </Router>

  );
}

export default Main;