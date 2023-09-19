import React, {
    useCallback,
    useState,
    useEffect,
} from 'react';

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/fixed');
import styles from './Looper.module.css';

const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
const TABID = tabs[0].id;

const getInitalState = async () => {
    let { LooperStartTime, LooperEndTime, LooperLoopState } = await chrome.storage.local.get(['LooperStartTime', 'LooperEndTime', 'LooperLoopState']);
    let result = [0, 0, false];
    if (LooperStartTime && LooperStartTime[TABID]) {
        result[0] = LooperStartTime[TABID];
    }
    if (LooperEndTime && LooperEndTime[TABID]) {
        result[1] = LooperEndTime[TABID];
    }
    if (LooperLoopState && LooperLoopState[TABID]) {
        result[2] = LooperLoopState[TABID];
    }
    return result;
}
const [initalStartTime, initalEndTime, initalEnableLoopState] = await getInitalState();

const Looper = () => {

    const [enableLoopState, setEnableLoopState] = useState(initalEnableLoopState);
    const [startTime, setStartTime] = useState(initalStartTime);
    const [endTime, setEndTime] = useState(initalEndTime);



    const handleStartTimeChange = useCallback(async (event) => {
        setStartTime(event.target.value);
        let { LooperStartTime } = await chrome.storage.local.get(['LooperStartTime']);
        chrome.storage.local.set({ ['LooperStartTime']: { ...LooperStartTime, [TABID]: event.target.value } });
    }, []);

    const handleEndTimeChange = useCallback(async (event) => {
        setEndTime(event.target.value);
        let { LooperEndTime } = await chrome.storage.local.get(['LooperEndTime']);
        chrome.storage.local.set({ ['LooperEndTime']: { ...LooperEndTime, [TABID]: event.target.value } });
    }, []);

    const handleEnableLoopStateChange = useCallback(async (event) => {
        setEnableLoopState(event.target.checked);
        let { LooperLoopState } = await chrome.storage.local.get(['LooperLoopState']);
        chrome.storage.local.set({ ['LooperLoopState']: { ...LooperLoopState, [TABID]: event.target.checked } });
    }, []);


    const addVideoListenerFunction = (startTime, endTime, enableLoopState) => {
        startTime = parseFloat(startTime);
        endTime = parseFloat(endTime);
        if (!enableLoopState || startTime >= endTime) {
            VideoListenerLoop = () => { };
            return;
        }
        VideoListenerLoop = () => {
            const videoEls = document.getElementsByTagName('video');
            for (let i = 0; i < videoEls.length; i++) {
                if (videoEls[i].readyState >= 2) {
                    if (videoEls[i].currentTime < startTime || videoEls[i].currentTime > endTime) {
                        videoEls[i].currentTime = startTime;
                    }
                }
            }
            requestAnimationFrame(VideoListenerLoop);
        };
        VideoListenerLoop();
    }

    useEffect(() => {
        const addVideoListenerToTab = async () => {
            chrome.scripting.executeScript({
                target: { tabId: TABID },
                func: addVideoListenerFunction,
                args: [startTime, endTime, enableLoopState]
            });
        }
        addVideoListenerToTab()
            .catch(console.error);
    }, [startTime, endTime, enableLoopState])

    const getCurrentTime = async () => {
        let time;
        const result = await chrome.scripting.executeScript({
            target: { tabId: TABID },
            func: () => {
                const videoEls = document.getElementsByTagName('video');
                for (let i = 0; i < videoEls.length; i++) {
                    if (videoEls[i].readyState === 4) {
                        return {
                            currentTime: videoEls[i].currentTime
                        };
                    }
                }
            },
        });
        time = result[0].result.currentTime;
        return time;
    }

    const handleSetCurrentTimeAsStartTime = useCallback(async () => {
        try {
            const time = await getCurrentTime();
            setStartTime(time);
            let { LooperStartTime } = await chrome.storage.local.get(['LooperStartTime']);
            chrome.storage.local.set({ ['LooperStartTime']: { ...LooperStartTime, [TABID]: time } });
        } catch (err) {
            console.log(err)
        }

    }, []);

    const handleSetCurrentTimeAsEndTime = useCallback(async () => {
        try {
            const time = await getCurrentTime();
            setEndTime(time);
            let { LooperEndTime } = await chrome.storage.local.get(['LooperEndTime']);
            chrome.storage.local.set({ ['LooperEndTime']: { ...LooperEndTime, [TABID]: time } });
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
