import * as React from 'react';
// import './Popup.scss';
import Input from '../Components/Input'
import Title from '../Components/Title'
import Textarea from '../Components/Textarea'
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
});


interface AppProps { }

interface AppState { }

export default function(props: AppProps, state: AppState) {
    function onChange() {
        console.log('onchange here')
    }

    const classes = useStyles();
    return (
        <div className="popupContainer">
            <Title title='Import Mnemonic' />
            <Textarea onChange={onChange} />
            <Input />
            <Input />
            <Button className={classes.root} color="primary">Import</Button>
        </div>
    )
}
