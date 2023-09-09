
function add90Seconds() {
    console.log('running code');
    var streams = document.getElementsByTagName('video');
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].readyState === 4) {
            streams[i].currentTime += 90;
        }
    }
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: add90Seconds
    });
});