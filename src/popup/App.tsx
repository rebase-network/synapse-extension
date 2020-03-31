import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Address from '../pages/Main'
import Popup from './Popup'
import AppBar from '../Components/AppBar/index'

export default function App() {
  return (
    <Router>
      <div>
        <AppBar />
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/import-mnemonic">Import Mnemonic</Link>
            </li>
          </ul>
        </nav>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Address />
          </Route>
          <Route path="/import-mnemonic">
            <Popup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
