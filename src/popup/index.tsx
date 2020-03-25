import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Route from './Route';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<Route />, document.getElementById('popup'));
});
