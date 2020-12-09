import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import PageNav from '@ui/Components/PageNav';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  mnemonic: {
    border: '1px solid #eee',
    padding: '.8em',
    'font-size': '1.3em',
    background: '#fff',
  },
});

export default () => {
  const classes = useStyles();
  const [mnemonic, setMnemonic] = React.useState([]);

  React.useEffect(() => {
    const listener = (request) => {
      if (request.type === MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT) {
        setMnemonic(request.mnemonic);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div>
      <PageNav to="/export-mnemonic" title={<FormattedMessage id="Export Mnemonic" />} />
      <div className={classes.container} data-testid="container">
        <div className={classes.mnemonic} data-testid="mnemonic-id">
          {mnemonic}
        </div>
        <br />
      </div>
    </div>
  );
};
