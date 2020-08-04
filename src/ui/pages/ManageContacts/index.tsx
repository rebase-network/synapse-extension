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
import { truncateAddress } from '@utils/formatters';
import _ from 'lodash';
import * as Yup from 'yup';
import { addressToScript } from '@keyper/specs';

const useStyles = makeStyles({
  container: {
    margin: 30,
    fontSize: 12,
  },
});

interface AppProps {}

interface AppState {}

export const InnerForm = (props) => {
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
        label={intl.formatMessage({ id: 'Address' })}
        id="address"
        name="address"
        type="address"
        fullWidth
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.address}
        helperText={errors.address && touched.address && errors.address}
        margin="normal"
        variant="outlined"
        data-testid="field-address"
      />
      <TextField
        label={intl.formatMessage({ id: 'Name' })}
        id="name"
        name="name"
        type="name"
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

export default function Init(props: AppProps, state: AppState) {
  const classes = useStyles();
  const intl = useIntl();
  const [contactItems, setContactItems] = React.useState([]);
  const [inValidate, setInValidate] = React.useState(false);

  const onSubmit = async (values, { resetForm }) => {
    let contactsObj = [];
    const { address, name } = values;

    // address validate
    setInValidate(false);
    try {
      addressToScript(address);
    } catch (error) {
      setInValidate(true);
      return;
    }
    const contactsStorage = await browser.storage.local.get('contacts');
    if (Array.isArray(contactsStorage.contacts)) {
      contactsObj = contactsStorage.contacts;
    }

    const contactObj = { address, name };
    const modContactIndex = _.findIndex(contactsObj, function findIndex(contactItem) {
      return contactItem.address === address;
    });
    if (modContactIndex === -1) {
      contactsObj.push(contactObj);
    } else {
      contactsObj[modContactIndex].name = name;
    }

    setContactItems(contactsObj);
    await browser.storage.local.set({ contacts: contactsObj });

    resetForm();
  };

  React.useEffect(() => {
    browser.storage.local.get('contacts').then((result) => {
      if (Array.isArray(result.contacts)) {
        setContactItems(result.contacts);
      }
    });
  }, [contactItems]);

  const handleListItemClick = async (event, address) => {
    let contactsObj = [];

    const contactsStorage = await browser.storage.local.get('contacts');
    if (Array.isArray(contactsStorage.contacts)) {
      contactsObj = contactsStorage.contacts;
    }

    _.remove(contactsObj, function remove(contact) {
      return contact.address === address;
    });

    setContactItems(contactsObj);
    await browser.storage.local.set({ contacts: contactsObj });
  };

  const contactElem = contactItems.map((item, index) => {
    return (
      <List component="nav" aria-label="contact List" key={`item-${item.address}`}>
        <ListItem>
          <ListItemText primary={truncateAddress(item.address)} secondary={item.name} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => handleListItemClick(event, item.address)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  });

  let failureNode = null;
  if (inValidate) {
    failureNode = <div>{intl.formatMessage({ id: 'Invalid address' })}</div>;
  }

  return (
    <div>
      <PageNav to="/setting" title={intl.formatMessage({ id: 'Manage Contacts' })} />
      <div className={classes.container}>
        {contactElem}
        {failureNode}
        <Formik
          initialValues={{ address: '', name: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(1)
              .required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {InnerForm}
        </Formik>
      </div>
    </div>
  );
}
