import getActiveTab from './getActiveTab';
import { updateLocalStorage } from './localStorageUtil';



/**
 * 
 * @param tabId 
 * @returns {Promise}
 */
async function 揀咗個VideoElements先(tabId) {
    return chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            window.__VIDEO_CONTROLLER_TEMP__ = {
                selectedVideoElements: document.getElementsByTagName('video'),
            };
        }
    }, async (result) => {
        //console.log('1', result[0].result);
    })
}



/**
 * 
 * @param tabId 
 */
export default async function addSeconds(tabId, value) {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    揀咗個VideoElements先(tabId);
    return chrome.scripting.executeScript({
        target: { tabId },
        func: async (value) => {
            for (let videoElement of window.__VIDEO_CONTROLLER_TEMP__.selectedVideoElements) {
                videoElement.currentTime += value;
            }
        },
        args: [value]
    });
}

const getJumpTime = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let { JumpTime } = await chrome.storage.local.get(['JumpTime']);
    let { DefaultJumpTime } = await chrome.storage.sync.get(['DefaultJumpTime']);
    return JumpTime?.[tabId] || DefaultJumpTime.value;
}

export const onClickJumpForward = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let [JumpTime] = [await getJumpTime(tabId)]
    await addSeconds(tabId, parseFloat(JumpTime));
}

export const onClickJumpBackward = async (tabId) => {
    if (tabId === undefined) {
        const [{ id: firstTabId }] = await getActiveTab();
        tabId = firstTabId;
    }
    let [JumpTime] = [await getJumpTime(tabId)]
    await addSeconds(tabId, -parseFloat(JumpTime));
}