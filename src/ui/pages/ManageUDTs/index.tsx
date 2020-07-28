import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import PageNav from '@ui/Components/PageNav';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { truncateHash } from '@utils/formatters';
import _ from 'lodash';
import * as Yup from 'yup';

const useStyles = makeStyles({
  container: {
    margin: 30,
    fontSize: 12,
  },
});

interface AppProps {}

interface AppState {}

export const innerForm = (props) => {
  const intl = useIntl();

  const { values, touched, errors, handleChange, handleBlur, handleSubmit, handleReset } = props;

  return (
    <Form
      className="manage-contacts"
      id="manage-contacts"
      onSubmit={handleSubmit}
      aria-label="form"
    >
      <TextField
        label={intl.formatMessage({ id: 'UDT Name' })}
        id="name"
        name="name"
        type="text"
        fullWidth
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.name}
        helperText={errors.name && touched.name && errors.name}
        margin="normal"
        variant="outlined"
        data-testid="field-name"
      />
      <TextField
        label={intl.formatMessage({ id: 'UDT Hash' })}
        id="typeHash"
        name="typeHash"
        type="text"
        fullWidth
        value={values.typeHash}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.typeHash}
        helperText={errors.typeHash && touched.typeHash && errors.typeHash}
        margin="normal"
        variant="outlined"
        data-testid="field-typeHash"
      />
      <TextField
        label={intl.formatMessage({ id: 'Decimal' })}
        id="decimal"
        name="decimal"
        type="text"
        fullWidth
        value={values.decimal}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.decimal}
        helperText={errors.decimal && touched.decimal && errors.decimal}
        margin="normal"
        variant="outlined"
        data-testid="field-decimal"
      />
      <TextField
        label={intl.formatMessage({ id: 'Symbol' })}
        id="symbol"
        name="symbol"
        type="text"
        fullWidth
        value={values.symbol}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.symbol}
        helperText={errors.symbol && touched.symbol && errors.symbol}
        margin="normal"
        variant="outlined"
        data-testid="field-symbol"
      />
      <Button
        type="submit"
        id="submit-button"
        color="primary"
        variant="contained"
        data-testid="submit-button"
      >
        <FormattedMessage id="Add" />
      </Button>
    </Form>
  );
};

export default function initFunction(props: AppProps, state: AppState) {
  const classes = useStyles();
  const intl = useIntl();
  const [udtsItems, setUdtsItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onSubmit = async (values, { resetForm }) => {
    let udtsList = [];
    const { name, typeHash, decimal, symbol } = values;
    const udtsStorage = await browser.storage.local.get('udts');
    if (Array.isArray(udtsStorage.udts)) {
      udtsList = udtsStorage.udts;
    }
    const udtObj = { name, typeHash, decimal, symbol };

    if (udtsList.length === 0) {
      udtsList.push(udtObj);
    } else {
      _.find(udtsList, (udtItem) => {
        if (udtItem.typeHash === typeHash) {
          udtItem = udtObj;
        } else {
          udtsList.push(udtObj);
        }
      });
    }

    setUdtsItems(udtsList);
    await browser.storage.local.set({ udts: udtsList });

    resetForm();
  };

  React.useEffect(() => {
    browser.storage.local.get('udts').then((result) => {
      if (Array.isArray(result.udts)) {
        setUdtsItems(result.udts);
      }
    });
  }, []);

  const handleListItemClick = async (event, typeHash) => {
    let udtsObj = [];
    const udtsStorage = await browser.storage.local.get('udts');
    if (Array.isArray(udtsStorage.udts)) {
      udtsObj = udtsStorage.udts;
    }
    _.remove(udtsObj, function removeItem(contact) {
      return contact.typeHash === typeHash;
    });
    setUdtsItems(udtsObj);
    await browser.storage.local.set({ udts: udtsObj });
  };

  const udtsElem = udtsItems.map((item, index) => {
    const secondaryItem = `${item.name} - ${item.decimal} - ${item.symbol}`;
    return (
      <List component="nav" aria-label="udts List" key={`item-${item.typeHash}`}>
        <ListItem>
          <ListItemText primary={truncateHash(item.typeHash)} secondary={secondaryItem} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => handleListItemClick(event, item.typeHash)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  });

  return (
    <div>
      <PageNav to="/setting" title="Manage UDTs" />
      <div className={classes.container}>
        {udtsElem}
        <Formik
          initialValues={{ name: '', typeHash: '', decimal: '8', symbol: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            typeHash: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            decimal: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            symbol: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
}
