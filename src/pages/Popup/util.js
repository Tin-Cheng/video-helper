export function getSkipSeconds() {
    return parseInt(document.getElementById('skip_input').value);
}
export function addSeconds(s) {
    var streams = document.getElementsByTagName('video');
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].readyState === 4) {
            streams[i].currentTime += s;
        }
    }
}

export async function getCurrentTabs() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs;
}

export async function handleSkipClick(e) {
    var tabs = await getCurrentTabs();
    for (var i = 0; i < tabs.length; i++) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[i].id },
            func: addSeconds,
            args: [getSkipSeconds()]
        })
    }
}

export function getPlayBackRateRange() {
    return Math.pow(2, parseFloat(document.getElementById('rate_Range').value));
}
export function getPlayBackRateInput() {
    return parseFloat(document.getElementById('rate_input').value);
}

export function setPlayBackRateInput(r) {
    document.getElementById('rate_input').value = Math.round(r * 1000) / 1000;
}

export function setPlayBackRateRange(r) {
    document.getElementById('rate_Range').value = Math.log2(r);
}


export function changePlayBackRate(rate) {
    var streams = document.getElementsByTagName('video');
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].readyState === 4) {
            streams[i].playbackRate = rate;
        }
    }
}

export async function handleRateRangeChange(e) {
    setPlayBackRateInput(getPlayBackRateRange())
    var tabs = await getCurrentTabs();
    for (var i = 0; i < tabs.length; i++) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[i].id },
            func: changePlayBackRate,
            args: [getPlayBackRateRange()]
        })
    }
}

export async function handleRateInputChange(e) {
    setPlayBackRateRange(getPlayBackRateInput())
    var tabs = await getCurrentTabs();
    for (var i = 0; i < tabs.length; i++) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[i].id },
            func: changePlayBackRate,
            args: [getPlayBackRateInput()]
        })
    }
}

export function setDefaultPlayBackRate() {
    var streams = document.getElementsByTagName('video');
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].readyState === 4) {
            setPlayBackRateInput(streams[i].playbackRate);
            setPlayBackRateRange(streams[i].playbackRate);
        }
    }
    setPlayBackRateInput(16);
    console.log(document.getElementById('rate_input'));
}
