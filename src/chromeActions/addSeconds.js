/**
 * 
 * @param tabId 
 * @returns {Promise}
 */
async function 揀咗個VideoElement先(tabId) {
    console.log(chrome.storage);
    return chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            window.__VIDEO_CONTROLLER_TEMP__ = {
                selectedVideoElement: document.getElementsByTagName('video')[0],
            };
        }
    }, async (result) => {
        console.log('1', result[0].result);
    })
}

async function getTabs() {
    return await new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs);
        });
    });
}

/**
 * 
 * @param tabId 
 */
export default async function addSeconds(tabId, value) {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getTabs();
        tabId = firstTabId;
    }
    揀咗個VideoElement先(tabId);
    return chrome.scripting.executeScript({
        target: { tabId },
        func: async (value) => {
            window.__VIDEO_CONTROLLER_TEMP__.selectedVideoElement.currentTime += value;
        },
        args: [value]
    });
}