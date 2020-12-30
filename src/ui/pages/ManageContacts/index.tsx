import React from 'react';
import _ from 'lodash';
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
import { truncateAddress } from '@src/common/utils/formatters';
import * as Yup from 'yup';
import { addressToScript } from '@keyper/specs';
import contactManager from '@common/contactManager';

const useStyles = makeStyles({
  container: {
    margin: 30,
    fontSize: 12,
  },
});

export const InnerForm = (props: any) => {
  const intl = useIntl();

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;

  return (
    <Form
      className="manage-contacts"
      id="manage-contacts"
      onSubmit={handleSubmit}
      aria-label="form"
    >
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Address' })}
        id="address"
        name="address"
        fullWidth
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.address}
        helperText={errors.address && touched.address && errors.address}
        margin="normal"
        variant="outlined"
      />
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Name' })}
        id="name"
        name="name"
        fullWidth
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.name}
        helperText={errors.name && touched.name && errors.name}
        margin="normal"
        variant="outlined"
      />
      <Button type="submit" id="submit-button" color="primary" variant="contained">
        <FormattedMessage id="Add" />
      </Button>
    </Form>
  );
};

export default () => {
  const classes = useStyles();
  const intl = useIntl();
  const [contactItems, setContactItems] = React.useState([]);
  const [inValidate, setInValidate] = React.useState(false);

  React.useEffect(() => {
    const updateContactList = async () => {
      const contactList = await contactManager.getContactList();
      setContactItems(contactList);
    };
    updateContactList();
    // unmount, clear state
    return () => setContactItems([]);
  }, []);

  const onSubmit = async (values, { resetForm }) => {
    const { address, name } = values;

    // address validate
    setInValidate(false);
    try {
      addressToScript(address);
    } catch (error) {
      setInValidate(true);
      return;
    }
    const contactList = await contactManager.getContactList();

    const contactObj = { address, name };
    const modContactIndex = _.findIndex(contactList, function findIndex(contactItem) {
      return contactItem.address === address;
    });
    if (modContactIndex === -1) {
      contactList.push(contactObj);
    } else {
      contactList[modContactIndex].name = name;
    }

    setContactItems(contactList);
    await browser.storage.local.set({ contacts: contactList });

    resetForm();
  };

  const handleListItemClick = async (event, address) => {
    const contactList = await contactManager.getContactList();

    _.remove(contactList, function remove(contact) {
      return contact.address === address;
    });

    setContactItems(contactList);
    await browser.storage.local.set({ contacts: contactList });
  };

  const contactElem = contactItems.map((item) => {
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
};
