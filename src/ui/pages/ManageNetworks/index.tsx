import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import PageNav from '@ui/Components/PageNav';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import * as Yup from 'yup';
import NetworkManager from '@common/networkManager';

const useStyles = makeStyles({
  container: {
    margin: 30,
    fontSize: 12,
  },
  item: {
    display: 'block',
  },
});

interface FormValues {
  name: string;
  nodeURL: string;
  cacheURL: string;
}

const innerForm = (props: FormikProps<FormValues>) => {
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
        label={intl.formatMessage({ id: 'Name' })}
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
        label={intl.formatMessage({ id: 'CKB Node URL' })}
        id="nodeURL"
        name="nodeURL"
        type="text"
        fullWidth
        value={values.nodeURL}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.nodeURL}
        helperText={errors.nodeURL && touched.nodeURL && errors.nodeURL}
        margin="normal"
        variant="outlined"
        data-testid="field-nodeURL"
      />
      <TextField
        label={intl.formatMessage({ id: 'CKB Cache Layer URL' })}
        id="cacheURL"
        name="cacheURL"
        type="text"
        fullWidth
        value={values.cacheURL}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.cacheURL}
        helperText={errors.cacheURL && touched.cacheURL && errors.cacheURL}
        margin="normal"
        variant="outlined"
        data-testid="field-cacheURL"
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
  const [networksItems, setNetworksItems] = React.useState([]);
  const [networkAmount, setNetworkAmount] = React.useState(0);

  const onSubmit = async (values, { resetForm }) => {
    const { name, nodeURL, cacheURL } = values;
    const networkObj = { name, nodeURL, cacheURL };
    const newNetworkList = NetworkManager.createNetwork(networkObj);
    setNetworksItems(newNetworkList);
    setNetworkAmount(newNetworkList.length);
    console.log(/networksList/, newNetworkList);

    resetForm();
  };

  React.useEffect(() => {
    const networkList = NetworkManager.getNetworkList();
    setNetworksItems(networkList);
    setNetworkAmount(networkList.length);
  }, [networkAmount]);

  const removeItem = async (event, name) => {
    const newNetworkList = NetworkManager.removeNetwork(name);
    setNetworkAmount(newNetworkList.length);
    setNetworksItems(newNetworkList);
  };

  const networksElem = networksItems.map((item) => {
    const secondaryItem = (
      <span>
        <span className={classes.item}>{item.cacheURL}</span>
        <span className={classes.item}>{item.nodeURL}</span>
      </span>
    );
    return (
      <List component="nav" aria-label="networks List" key={`item-${item.nodeURL}`}>
        <ListItem>
          <ListItemText primary={item.name} secondary={secondaryItem} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => removeItem(event, item.name)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  });
  console.log(/ ======= networksList/, networksItems);

  return (
    <div>
      <PageNav to="/setting" title="Manage Networks" />
      <div className={classes.container}>
        {networksElem}
        <Formik
          initialValues={{ name: '', nodeURL: '', cacheURL: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            nodeURL: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            cacheURL: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
};
