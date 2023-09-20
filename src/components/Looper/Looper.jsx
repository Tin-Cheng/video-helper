import React, {
    useCallback,
    useState,
    useEffect,
} from 'react';

//const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/fixed');
import styles from './Looper.module.css';
import { getCurrentTime, addVideoListenerToTab } from '../../chromeActions/manageLooper';
import { updateLocalStorage } from '../../chromeActions/localStorageUtil';

const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
const TABID = tabs[0].id;

const getInitalState = async () => {
    let { LooperStartTime, LooperEndTime, LooperLoopState } = await chrome.storage.local.get(['LooperStartTime', 'LooperEndTime', 'LooperLoopState']);
    return [
        LooperStartTime?.[TABID] || 0,
        LooperEndTime?.[TABID] || 0,
        LooperLoopState?.[TABID] || false,
    ];
}
const [initalStartTime, initalEndTime, initalEnableLoopState] = await getInitalState();

const Looper = () => {

    const [enableLoopState, setEnableLoopState] = useState(initalEnableLoopState);
    const [startTime, setStartTime] = useState(initalStartTime);
    const [endTime, setEndTime] = useState(initalEndTime);

    const handleStartTimeChange = useCallback(async (event) => {
        setStartTime(event.target.value);
        updateLocalStorage('LooperStartTime', event.target.value, TABID);
    }, []);

    const handleEndTimeChange = useCallback(async (event) => {
        setEndTime(event.target.value);
        updateLocalStorage('LooperEndTime', event.target.value, TABID);
    }, []);

    const handleEnableLoopStateChange = useCallback(async (event) => {
        setEnableLoopState(event.target.checked);
        updateLocalStorage('LooperLoopState', event.target.checked, TABID);
    }, []);

    useEffect(() => {
        addVideoListenerToTab(TABID, startTime, endTime, enableLoopState)
            .catch(console.error);
    }, [startTime, endTime, enableLoopState])

    const handleSetCurrentTimeAsStartTime = useCallback(async () => {
        try {
            const time = await getCurrentTime(TABID);
            setStartTime(time);
            updateLocalStorage('LooperStartTime', time, TABID);
        } catch (err) {
            console.log(err)
        }

    }, []);

    const handleSetCurrentTimeAsEndTime = useCallback(async () => {
        try {
            const time = await getCurrentTime(TABID);
            setEndTime(time);
            updateLocalStorage('LooperEndTime', time, TABID);
        } catch (err) {
            console.log(err)
        }
    }, []);

    return (
        <div className={styles.jumper}>
            <label>
                Enable Loop
                <input type="checkbox"
                    checked={enableLoopState}
                    onChange={handleEnableLoopStateChange} />
            </label>
            <br />
            <button
                className={styles.prevSkip}
                onClick={handleSetCurrentTimeAsStartTime}
            >
                {'set Start Time'}
            </button>
            <button
                className={styles.prevSkip}
                onClick={handleSetCurrentTimeAsEndTime}
            >
                {'set End Time'}
            </button>
            <br />
            <input
                className={styles.input}
                type="text"
                value={startTime}
                onChange={handleStartTimeChange}
            />
            <input
                className={styles.input}
                type="text"
                value={endTime}
                onChange={handleEndTimeChange}
            />
        </div>
    );
};

export default Looper;
