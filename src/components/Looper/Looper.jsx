import React, {
    useCallback,
    useState,
    useEffect,
} from 'react';
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/fixed');

import styles from './Looper.module.css';

const Looper = () => {
    const [enableLoopState, setEnableLoopState] = useState(false);
    const [editingVideoState, setEditingVideoState] = useState(false);
    const [startTime, setStartTime] = useState('0');
    const [endTime, setEndTime] = useState('0');

    const handleStartTimeChange = useCallback((event) => {
        setStartTime(event.target.value);
    }, []);

    const handleEndTimeChange = useCallback((event) => {
        setEndTime(event.target.value);
    }, []);

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
    const setCurrentTime = async (time) => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        for (let i = 0; i < tabs.length; i++) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[i].id },
                func: (time) => {
                    var streams = document.getElementsByTagName('video');
                    for (var i = 0; i < streams.length; i++) {
                        if (streams[i].readyState === 4 && !streams[i].paused && !streams[i].ended) {
                            streams[i].currentTime = time;
                        }
                    }
                },
                args: [time]
            });
        }
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

    const checkLoop = async () => {
        if (!enableLoopState || editingVideoState) return;
        if (parseFloat(startTime) >= parseFloat(endTime)) return;
        try {
            const currentTime = await getCurrentTime();
            if (currentTime >= endTime || currentTime < startTime) {
                setEditingVideoState(true);
                await setCurrentTime(parseFloat(startTime));
                setEditingVideoState(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const interval = setIntervalAsync(async () => {
            checkLoop();
        }, 100);
        return () => clearIntervalAsync(interval);
    }, [enableLoopState, startTime, endTime]);


    return (
        <div className={styles.jumper}>
            <label>
                Enable Loop
                <input type="checkbox" checked={enableLoopState} onChange={(event) => {
                    setEnableLoopState(event.target.checked);
                }} />
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
