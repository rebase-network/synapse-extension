import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { AppContext } from '@ui/utils/context';
import Address from '@ui/pages/Address';

import ImportMnemonic from '@ui/pages/ImportMnemonic/index';
import GenerateMnemonic from '@ui/pages/ImportMnemonic/generate';
import Transaction from '@ui/pages/Transaction';
import Sign from '@ui/pages/Sign';
import MnemonicSetting from '@ui/pages/MnemonicSetting';
import ImportPrivateKey from '@ui/pages/ImportPrivateKey';
import ExportPrivateKey from '@ui/pages/ExportPrivateKey';
import ExportMnemonic from '@ui/pages/ExportMnemonic';
import ExportPrivateKeySecond from '@ui/pages/ExportPrivateKeySecond';
import Setting from '@ui/pages/Setting';
import ExportMnemonicSecond from '@ui/pages/ExportMnemonicSecond';
import AppBar from '@ui/Components/AppBar';
import ManageContacts from '@ui/pages/ManageContacts';
import ManageUDTs from '@src/ui/pages/ManageUDTs';
import ManageNetworks from '@ui/pages/ManageNetworks';

import './styles/global.scss';

export default function App() {
  const [network, setNetwork] = React.useState('');

  const handleNetworkChange = (value: string) => {
    setNetwork(value);
    location.replace('/popup.html');
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
            <Route
              path="/address/:address"
              render={(routeProps) => <Address match={routeProps.match} />}
            />
            <Route path="/import-mnemonic">
              <ImportMnemonic />
            </Route>
            <Route path="/generate-mnemonic">
              <GenerateMnemonic />
            </Route>
            <Route path="/send-tx">
              <Transaction />
            </Route>
            <Route path="/sign-tx">
              <Sign />
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
            <Route path="/manage-contacts">
              <ManageContacts />
            </Route>
            {/* <Route path="/manage-udts">
              <ManageUDTs />
            </Route> */}
            <Route
              path="/manage-udts/:typeHash"
              render={(routeProps) => <ManageUDTs match={routeProps.match} />}
            />
            <Route path="/manage-networks">
              <ManageNetworks />
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
