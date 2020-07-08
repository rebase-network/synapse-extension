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
import { truncateHash } from '@utils/formatters';
import _ from 'lodash';
import * as Yup from 'yup';

const useStyles = makeStyles({
  container: {
    margin: 30,
    fontSize: 12,
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

  const onSubmit = async (values, { resetForm }) => {
    let networksList = [];
    const { name, nodeURL, cacheURL } = values;
    const networksStorage = await browser.storage.local.get('networks');
    if (Array.isArray(networksStorage.networks)) {
      networksList = networksStorage.networks;
    }
    const networkObj = { name, nodeURL, cacheURL };
    const modNetworksIndex = _.findIndex(networksList, function findItemIndex(networkItem) {
      return networkItem.nodeURL === nodeURL;
    });
    if (modNetworksIndex === -1) {
      networksList.push(networkObj);
    } else {
      networksList[modNetworksIndex] = networkObj;
    }
    setNetworksItems(networksList);
    console.log(/networksList/, JSON.stringify(networksList));
    await browser.storage.local.set({ networks: networksList });

    resetForm();
  };

  React.useEffect(() => {
    browser.storage.local.get('networks').then((result) => {
      if (Array.isArray(result.networks)) {
        setNetworksItems(result.networks);
      }
    });
  }, []);

  const removeItem = async (event, nodeURL) => {
    let networksObj = [];
    const networksStorage = await browser.storage.local.get('networks');
    if (Array.isArray(networksStorage.networks)) {
      networksObj = networksStorage.networks;
    }
    _.remove(networksObj, { nodeURL });
    setNetworksItems(networksObj);
    await browser.storage.local.set({ networks: networksObj });
  };

  const networksElem = networksItems.map((item) => {
    const secondaryItem = (
      <div>
        <div>{item.cacheURL}</div>
        <div>{item.nodeURL}</div>
      </div>
    );
    return (
      <List component="nav" aria-label="networks List" key={`item-${item.nodeURL}`}>
        <ListItem>
          <ListItemText primary={truncateHash(item.name)} secondary={secondaryItem} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => removeItem(event, item.nodeURL)}
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
