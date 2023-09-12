import React, { useCallback, useEffect, useState } from 'react';
import './Popup.css';

import {
    changePlayBackRate,
    getCurrentTabs,
    getVideoPlayBackRate,
    addSeconds,
} from './util.js';

const Popup = () => {

    const [playbackRate, setPlaybackRate] = useState(1);
    const [skipSeconds, setSkipSeconds] = useState(85);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: getVideoPlayBackRate
            }, (result) => {
                console.log("Recv result = " + result[0].result);
                setPlaybackRate(result[0].result);
            });
        });
    }, []);

    useEffect(() => {
        (async function () {
            const tabs = await getCurrentTabs();
            for (let i = 0; i < tabs.length; i++) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[i].id },
                    func: changePlayBackRate,
                    args: [playbackRate]
                });
            }
        })();
    }, [playbackRate]);

    const handleSkipClick = async function () {
        console.log("click!");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log(tabs[0]);
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: addSeconds,
                args: [parseInt(skipSeconds)]
            });
        });
    };
    const handleSkipSecondsChange = useCallback((event) => {
        setSkipSeconds(event.target.value);
    }, []);

    const handleRateInputChange = useCallback((event) => {
        setPlaybackRate(event.target.value);
    }, []);

    const handleRateRangeChange = useCallback((event) => {
        setPlaybackRate(2 ** event.target.value);
    }, []);

    return (
        <div>
            <h1>Video Controller</h1>
            <div>
                <button type="button" onClick={handleSkipClick}>Skip</button>
                <input type="number" onChange={handleSkipSecondsChange} value={skipSeconds} />
                seconds
            </div>
            <label>Playback Rate</label>
            <input type="number" min={0.0625} max={16} onChange={handleRateInputChange} value={playbackRate} />
            <input type="range" min={-4} max={4} step={0.01} onChange={handleRateRangeChange} value={Math.log2(playbackRate)} />
        </div>
    );
};

export default Popup;
