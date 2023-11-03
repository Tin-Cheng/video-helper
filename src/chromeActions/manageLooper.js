import getActiveTab from './getActiveTab';
import { updateLocalStorage } from './localStorageUtil';

const addVideoListenerFunction = (startTime, endTime, enableLoopState) => {
    startTime = parseFloat(startTime);
    endTime = parseFloat(endTime);
    var VideoListenerLoop = () => { };
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

const getLooperStartTime = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let { LooperStartTime } = await chrome.storage.local.get(['LooperStartTime']);
    return LooperStartTime?.[tabId] || 0;
}

const getLooperEndTime = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let { LooperEndTime } = await chrome.storage.local.get(['LooperEndTime']);
    return LooperEndTime?.[tabId] || 0;
}
const getLooperLoopState = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let { LooperLoopState } = await chrome.storage.local.get(['LooperLoopState']);
    return LooperLoopState?.[tabId] || false;
}

export const addVideoListenerToTab = async (tabId, startTime, endTime, enableLoopState) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    if (startTime === undefined) {
        startTime = getLooperStartTime(tabId);
    }
    if (endTime === undefined) {
        endTime = getLooperEndTime(tabId);
    }
    if (enableLoopState === undefined) {
        enableLoopState = getLooperLoopState(tabId);
    }
    chrome.scripting.executeScript({
        target: { tabId },
        func: addVideoListenerFunction,
        args: [startTime, endTime, enableLoopState]
    });
}

export const getCurrentTime = async (tabId) => {
    let time;
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    const result = await chrome.scripting.executeScript({
        target: { tabId: tabId },
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

export const onClickChangeLoopState = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let [startTime, endTime, loopState] = [await getLooperStartTime(tabId), await getLooperEndTime(tabId), await getLooperLoopState(tabId)]
    loopState = !loopState;
    await updateLocalStorage('LooperLoopState', loopState, tabId);
    await addVideoListenerToTab(tabId, startTime, endTime, loopState);
}