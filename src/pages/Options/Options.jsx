import React, {
    useCallback,
    useState,
} from 'react';

import { updateSyncStorage } from '../../chromeActions/localStorageUtil';

import TextInput from '../../components/TextInput';

import styles from './Options.module.css';


const getInitalState = async () => {
    let { DefaultJumpTime } = await chrome.storage.sync.get(['DefaultJumpTime']);
    return [
        (DefaultJumpTime.value)
    ];
}
const [initalDefaultJumpTime] = await getInitalState();


//TODO UI Design
//TODO Validate input
const Options = () => {
    const [input, setInput] = useState(initalDefaultJumpTime);

    const handleInputChange = useCallback((event) => {
        setInput(event.target.value);
        updateSyncStorage('DefaultJumpTime', event.target.value);
    }, []);

    return (
        <div className="OptionsContainer">
            <h1>Options Page</h1>
            <br />
            <label>Default Jump Time</label>
            <TextInput
                className={styles.input}
                type="text"
                value={input}
                onChange={handleInputChange}
            />
            <br />
            <br />
            <label>Please check <a href="chrome://extensions/shortcuts">chrome://extensions/shortcuts</a> for customizing keyboard shortcuts.</label>
        </div>
    );
};

export default Options;
