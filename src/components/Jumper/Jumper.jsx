import React, {
    useCallback,
    useState,
} from 'react';

import addSeconds from '../../chromeActions/addSeconds';
import { updateLocalStorage } from '../../chromeActions/localStorageUtil';

import CircleButton from '../CircleButton';
import TextInput from '../TextInput';

import styles from './Jumper.module.css';

const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
const TABID = tabs[0].id;

const getInitalState = async () => {
    let { JumpTime } = await chrome.storage.local.get(['JumpTime']);
    return [
        JumpTime?.[TABID] || 85
    ];
}
const [initalJumpTime] = await getInitalState();

const Jumper = () => {
    const [input, setInput] = useState(initalJumpTime);

    const handleInputChange = useCallback((event) => {
        setInput(event.target.value);
        updateLocalStorage('JumpTime', event.target.value, TABID);
    }, []);

    const handlePrevSkipClick = useCallback(() => {
        addSeconds(TABID, -parseFloat(input));
    }, [input]);

    const handleForwardSkipClick = useCallback(() => {
        addSeconds(TABID, parseFloat(input));
    }, [input]);

    return (
        <div className={styles.jumper}>
            <CircleButton label="<<" onClick={handlePrevSkipClick} />
            <TextInput
                className={styles.input}
                type="text"
                value={input}
                onChange={handleInputChange}
            />
            <CircleButton label=">>" onClick={handleForwardSkipClick} />
        </div>
    );
};

export default Jumper;
