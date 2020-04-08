import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Address from './pages/Address'

import {ImportMnemonic, } from './pages/ImportMnemonic/index'
import {GenerateMnemonic, } from './pages/ImportMnemonic/generate'
import {ShowMnemonic, } from './pages/ImportMnemonic/show'
import Transaction from "./pages/Transaction"
import TxDetail from "./pages/TxDetail"
import Home from "./pages/Home"

import AppBar from './Components/AppBar/'

import "./styles/global.scss";

export const AppContext = React.createContext({network: 'testnet'});

export default function App() {
  const [network, setNetwork] = React.useState('testnet');

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
  };

  return (
    <Router>
      <AppContext.Provider value={{
        network
      }}>
        <div>
          <AppBar handleNetworkChange={handleNetworkChange} />
          <nav>
            <ul>
              <li>
                <Link to="/address">Address</Link>
              </li>
              <li>
                <Link to="/import-mnemonic">Import Mnemonic</Link>
              </li>
              {/* <li>
                <Link to="/tx-detail">Tx Detail</Link>
              </li> */}
            </ul>
          </nav>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/address">
              <Address />
            </Route>
            <Route path="/import-mnemonic">
              <ImportMnemonic />
            </Route>
            <Route path="/generate-mnemonic">
              <GenerateMnemonic/>
            </Route>
            <Route path="/show-mnemonic">
              <ShowMnemonic/>
            </Route>
            <Route path="/send-tx">
              <Transaction />
            </Route>
            <Route path="/tx-detail">
              <TxDetail />
            </Route>

            {/* 通配放到最后 */}
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </AppContext.Provider>
    </Router>
  );
}
