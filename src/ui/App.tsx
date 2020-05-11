import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Address from "./pages/Address";

import ImportMnemonic from "./pages/ImportMnemonic/index";
import GenerateMnemonic from "./pages/ImportMnemonic/generate";
import Transaction from "./pages/Transaction";
import TxDetail from "./pages/TxDetail";
import TxHistoryDetail from "./pages/Transaction/txHistoryDetail";
import MnemonicSetting from "./pages/MnemonicSetting";
import ImportPrivateKey from "./pages/ImportPrivateKey";
import ExportPrivateKey from "./pages/ExportPrivateKey";
import ExportMnemonic from "./pages/ExportMnemonic";
import ExportPrivateKeySecond from "./pages/ExportPrivateKeySecond";
import Setting from "./pages/Setting";

import ExportMnemonicSecond from "./pages/ExportMnemonicSecond";

import AppBar from "./Components/AppBar/";

import "./styles/global.scss";

export const AppContext = React.createContext({ network: "testnet" });

export default function App() {
  const [network, setNetwork] = React.useState("testnet");

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
  };

  return (
    <Router>
      <AppContext.Provider
        value={{
          network,
        }}
      >
        <div>
          <AppBar handleNetworkChange={handleNetworkChange} />
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
              <GenerateMnemonic />
            </Route>
            <Route path="/send-tx">
              <Transaction />
            </Route>
            <Route path="/tx-history-detail">
              <TxHistoryDetail />
            </Route>
            <Route path="/tx-detail">
              <TxDetail />
            </Route>
            <Route path="/import-private-key">
              <ImportPrivateKey />
            </Route>
            <Route path="/export-private-key">
              <ExportPrivateKey />
            </Route>
            <Route path="/export-mnemonic">
              <ExportMnemonic />
            </Route>
            <Route path="/export-private-key-second">
              <ExportPrivateKeySecond />
            </Route>
            <Route path="/export-mnemonic-second">
              <ExportMnemonicSecond />
            </Route>
            <Route path="/mnemonic-setting">
              <MnemonicSetting />
            </Route>
            <Route path="/setting">
              <Setting />
            </Route>
            {/* 通配放到最后 */}
            <Route path="/">
              <Address />
            </Route>
          </Switch>
        </div>
      </AppContext.Provider>
    </Router>
  );
}
