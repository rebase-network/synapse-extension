import * as React from 'react';
// import './Popup.scss';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const useStylesPopper = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: '1px solid',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {

  },
  textField: {

  }
});

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '380px',
      backgroundColor: theme.palette.background.paper,
      marginTop: '0px',
      marginBottom: '0px',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      width: '400px',
    },
    grid: {
      width: '380px',
    },
    typography: {
      marginLeft: "108px",
      fontSize: "20px",
    },
    adressesElem: {
      marginLeft: "28px",
    },
    link: {
      // display: 'flex',
      textAlign: 'center',
      font: "40px",
      height: 50,
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 40,
      height: 20,
    },
    demo: {
      // backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(1, 0, 1),
    },
    ListSubheader: {
      font: '10px',
      height: '4px',
      inlineSize: '4px',
    },
    inline: {
      display: 'inline',
    }
  }),
);

interface AppProps { }

interface AppState { }

export const innerForm = props => {
  const classes = useStyles();

  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  } = props;

  return (
    <Form className="export-private-key" id="export-private-key" onSubmit={handleSubmit}>

      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={(errors.password && touched.password) && errors.password}
        margin="normal"
        variant="outlined"
        data-testid="field-password"
      />

      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        className={classes.button}
        data-testid="submit-button"
      >
        Confirm
      </Button>
    </Form>
  );
}

export default function (props: AppProps, state: AppState) {

  const classTheme = useStylesTheme();
  const [success, setSuccess] = React.useState(false)
  const [vaildate, setValidate] = React.useState(true)
  const history = useHistory();

  const onSubmit = async (values) => {
    //background.ts check the password
    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK })
  }

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // console.log("export private key =>",message);
      if (message.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT) {
        if (message.isValidatePassword) {

          history.push('/export-private-key-second'); //测试成功的地址
          chrome.runtime.sendMessage({
            message,
            messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND
          })
        } else {
          setValidate(false);
        }
      }
    });
  }, []);

  function handleClickBreadcrumbs(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>
  if (!vaildate) successNode = <div className="success">Invalid passwrod</div>
  const classes = useStyles();

  return (
    <div>
      <div className={classTheme.root}>
        <Grid container spacing={3} className={classTheme.grid}>
          <Grid item xs={12}>
            {/* <Paper className={classTheme.paper}>My Addresses</Paper>   */}
            <Paper className={classTheme.paper}>
              <Breadcrumbs aria-label="breadcrumb" color="textPrimary">
                <Typography color="textPrimary" className={classTheme.typography}>
                  {/* {<NavigateBeforeIcon className={classTheme.icon}/>} */}
                  <Link color="inherit" href="/" onClick={handleClickBreadcrumbs}>
                    <NavigateBeforeIcon className={classTheme.icon} />
                    Export Private Key
                  </Link>
                </Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
        </Grid>
      </div>

      <div className={classes.container}>
        <Title title='Export Private Key' testId="export-private-key-title" />
        {successNode}
        <Formik
          initialValues={{ password: "" }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .min(6)
              .required("Required")
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  )
}
