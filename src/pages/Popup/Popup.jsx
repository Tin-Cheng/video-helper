import React, { useCallback, useEffect, useState } from 'react';
import './Popup.css';

import {
    changePlayBackRate,
    getCurrentTabs,
    getVideoPlayBackRate,
    handleSkipClick,
} from './util.js';

const Popup = () => {

    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log("Execute Script");
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
                <input type="number" value={85} />
                seconds
            </div>
            <label>Playback Rate</label>
            <input type="number" min={0.0625} max={16} onChange={handleRateInputChange} value={playbackRate} />
            <input type="range" min={-4} max={4} step={0.01} onChange={handleRateRangeChange} value={Math.log2(playbackRate)} />
        </div>
    );
};

export default Popup;
