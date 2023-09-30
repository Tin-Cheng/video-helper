import React, { useCallback, useEffect, useState } from 'react';
import './Popup.css';

import {
    changePlayBackRate,
    getCurrentTabs,
} from './util.js';

import Jumper from '../../components/Jumper/Jumper';
import Looper from '../../components/Looper/Looper';

const Popup = () => {
    const [playbackRate, setPlaybackRate] = useState(1);
    const [preservesPitchState, setPreservesPitchState] = useState(false);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    const videoEls = document.getElementsByTagName('video');
                    for (let i = 0; i < videoEls.length; i++) {
                        if (videoEls[i].readyState === 4) {
                            return {
                                playbackRate: videoEls[i].playbackRate,
                                preservesPitch: videoEls[i].preservesPitch,
                            };
                        }
                    }
                },
            }, (result) => {
                setPlaybackRate(result[0].result.playbackRate);
                setPreservesPitchState(result[0].result.preservesPitch)
            });
        });
    }, []);

    useEffect(() => {
        (async function () {
            const tabs = await getCurrentTabs();
            for (let i = 0; i < tabs.length; i++) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[i].id },
                    // eslint-disable-next-line no-loop-func
                    func: (input) => {
                        var streams = document.getElementsByTagName('video');
                        for (var i = 0; i < streams.length; i++) {
                            if (streams[i].readyState === 4) {
                                streams[i].preservesPitch = input;
                            }
                        }
                    },
                    args: [preservesPitchState]
                });
            }
        })();
    }, [preservesPitchState]);

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
            <Jumper />
            <div>
                <label>Playback Rate</label>
                <input type="number" min={0.0625} max={16} onChange={handleRateInputChange} value={playbackRate} />
                <input type="range" min={-4} max={4} step={0.01} onChange={handleRateRangeChange} value={Math.log2(playbackRate)} />
            </div>
            <label>
                Preserves audio pitch
                <input type="checkbox" checked={preservesPitchState} onChange={(event) => {
                    setPreservesPitchState(event.target.checked);
                }} />
            </label>
            <Looper />
        </div>
    );
};

export default Popup;
