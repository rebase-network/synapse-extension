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
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
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
  title: string;
  prefix: string;
  nodeURL: string;
  cacheURL: string;
}

const innerForm = (props: FormikProps<FormValues>): React.ReactElement => {
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
        label={intl.formatMessage({ id: 'NetWorkName' })}
        id="title"
        name="title"
        type="text"
        fullWidth
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.title}
        helperText={errors.title && touched.title && errors.title}
        margin="normal"
        variant="outlined"
        data-testid="field-title"
      />
      <FormControl>
        <NativeSelect
          value={values.prefix}
          onChange={handleChange}
          defaultValue="ckt"
          inputProps={{
            name: 'prefix',
            id: 'prefix',
          }}
        >
          <option value="ckb">Mainnet</option>
          <option value="ckt">Testnet</option>
          <option value="local">Local</option>
        </NativeSelect>
      </FormControl>
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
  const [networkItems, setNetworkItems] = React.useState([]);

  const onSubmit = async (values, { resetForm }) => {
    const { title, nodeURL, cacheURL, prefix } = values;
    const networkTypeMapping = {
      ckb: 'mainnet',
      ckt: 'testnet',
    };
    const networkType = networkTypeMapping[prefix];
    const networkObj = { title, networkType, nodeURL, cacheURL, prefix };
    const newNetworkList = await NetworkManager.createNetwork(networkObj);
    setNetworkItems(newNetworkList);

    resetForm();
  };

  React.useEffect(() => {
    NetworkManager.getNetworkList().then((networkList) => {
      if (Array.isArray(networkList) && networkList.length > 0) {
        setNetworkItems(networkList);
      }
    });
  }, []);

  const removeItem = async (event, title) => {
    const newNetworkList = await NetworkManager.removeNetwork(title);
    setNetworkItems(newNetworkList);
  };

  const networkListElem = networkItems.map((item) => {
    const secondaryItem = (
      <span>
        <span className={classes.item}>{item.nodeURL}</span>
        <span className={classes.item}>{item.cacheURL}</span>
      </span>
    );
    return (
      <List component="nav" aria-label="Network List" key={`${item.name}-${item.nodeURL}`}>
        <ListItem>
          <ListItemText primary={item.title} secondary={secondaryItem} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => removeItem(event, item.title)}
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
        {networkListElem}
        <Formik
          initialValues={{ title: '', nodeURL: '', cacheURL: '', prefix: 'ckt' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            title: Yup.string().required(intl.formatMessage({ id: 'Required' })),
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
