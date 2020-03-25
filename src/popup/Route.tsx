import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Address from '../pages/Main'
import Popup from './Popup'

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Popup</Link>
            </li>
            <li>
              <Link to="/address">Address</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/address">
            <Address />
          </Route>
          <Route path="/">
            <Popup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
