import React, {
    useCallback,
    useState,
    useEffect,
} from 'react';
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/fixed');

import styles from './Looper.module.css';

const Looper = () => {
    const [enableLoopState, setEnableLoopState] = useState(false);
    const [startTime, setStartTime] = useState('0');
    const [endTime, setEndTime] = useState('0');

    const handleStartTimeChange = useCallback((event) => {
        setStartTime(event.target.value);
    }, []);

    const handleEndTimeChange = useCallback((event) => {
        setEndTime(event.target.value);
    }, []);

    const handleEnableLoopStateChange = useCallback((event) => {
        setEnableLoopState(event.target.checked);
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
            console.log('add to tab', startTime, endTime, enableLoopState);
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            for (let i = 0; i < tabs.length; i++) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[i].id },
                    func: addVideoListenerFunction,
                    args: [startTime, endTime, enableLoopState]
                });
            }
        }
        addVideoListenerToTab()
            .catch(console.error);
    }, [startTime, endTime, enableLoopState])

    const getCurrentTime = async () => {
        let time;
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

        const result = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
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
        } catch (err) {
            console.log(err)
        }

    }, []);

    const handleSetCurrentTimeAsEndTime = useCallback(async () => {
        try {
            const time = await getCurrentTime();
            setEndTime(time);
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
