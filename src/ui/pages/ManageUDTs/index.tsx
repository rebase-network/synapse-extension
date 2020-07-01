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
        id="udtname"
        name="udtname"
        type="text"
        fullWidth
        value={values.udtname}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.udtname}
        helperText={errors.udtname && touched.udtname && errors.udtname}
        margin="normal"
        variant="outlined"
        data-testid="field-udtname"
      />
      <TextField
        label={intl.formatMessage({ id: 'UDT Hash' })}
        id="udthash"
        name="udthash"
        type="text"
        fullWidth
        value={values.udthash}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.udthash}
        helperText={errors.udthash && touched.udthash && errors.udthash}
        margin="normal"
        variant="outlined"
        data-testid="field-udthash"
      />
      <TextField
        label={intl.formatMessage({ id: 'Decimals' })}
        id="decimals"
        name="decimals"
        type="text"
        fullWidth
        value={values.decimals}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.decimals}
        helperText={errors.decimals && touched.decimals && errors.decimals}
        margin="normal"
        variant="outlined"
        data-testid="field-decimals"
      />
      <TextField
        label={intl.formatMessage({ id: 'Symbols' })}
        id="symbols"
        name="symbols"
        type="text"
        fullWidth
        value={values.symbols}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.symbols}
        helperText={errors.symbols && touched.symbols && errors.symbols}
        margin="normal"
        variant="outlined"
        data-testid="field-symbols"
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

  const onSubmit = async (values) => {
    let udtsList = [];
    const { udtname, udthash, decimals, symbols } = values;
    const udtsStorage = await browser.storage.local.get('udts');
    if (Array.isArray(udtsStorage.udts)) {
      udtsList = udtsStorage.udts;
    }
    const udtObj = { udtname, udthash, decimals, symbols };
    const modUdtsIndex = _.findIndex(udtsList, function findItemIndex(udtItem) {
      return udtItem.udthash === udthash;
    });
    if (modUdtsIndex === -1) {
      udtsList.push(udtObj);
    } else {
      udtsList[modUdtsIndex] = udtObj;
    }
    setUdtsItems(udtsList);
    await browser.storage.local.set({ udts: udtsList });
  };

  React.useEffect(() => {
    browser.storage.local.get('udts').then((result) => {
      if (Array.isArray(result.udts)) {
        setUdtsItems(result.udts);
      }
    });
  }, []);

  const handleListItemClick = async (event, udthash) => {
    let udtsObj = [];
    const udtsStorage = await browser.storage.local.get('udts');
    if (Array.isArray(udtsStorage.udts)) {
      udtsObj = udtsStorage.udts;
    }
    _.remove(udtsObj, function removeItem(contact) {
      return contact.udthash === udthash;
    });
    setUdtsItems(udtsObj);
    await browser.storage.local.set({ udts: udtsObj });
  };

  const udtsElem = udtsItems.map((item, index) => {
    const secondaryItem = `${item.udtname} - ${item.decimals} - ${item.symbols}`;
    return (
      <List component="nav" aria-label="udts List" key={`item-${item.udthash}`}>
        <ListItem>
          <ListItemText primary={truncateHash(item.udthash)} secondary={secondaryItem} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => handleListItemClick(event, item.udthash)}
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
      <PageNav to="/setting" title="Manage Contacts" />
      <div className={classes.container}>
        {udtsElem}
        <Formik
          initialValues={{ udtname: '', udthash: '', decimals: '8', symbols: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            udtname: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            udthash: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            decimals: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            symbols: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
}
