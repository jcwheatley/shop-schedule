import React from 'react';
import { Route } from 'react-router';

/**
 * Import all page components here
 */
import App from './App';
import Landing from './Components/Landing';
import Home from './Components/Home';
// import SomePage from './components/SomePage';
// import SomeOtherPage from './components/SomeOtherPage';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>
    {/* <IndexRoute component={Landing} /> */}
    <Route path="/home" component={Home} />
  </Route>
);