import * as React from 'react';
// import './Popup.scss';
import Input from '../Components/Input'
import Title from '../Components/Title'
import Textarea from '../Components/Textarea'

interface AppProps {}

interface AppState {}

export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    componentDidMount() {
        // Example of how to send a message to eventPage.ts.
        // chrome.runtime.sendMessage({ popupMounted: true });
    }

    render() {
        return (
            <div className="popupContainer">
                <Title title='Import Mnemonic' />
                <Textarea />
                <Input />
                <Input />
                <button>Import</button>
            </div>
        )
    }
}
