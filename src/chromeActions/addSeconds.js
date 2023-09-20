import getActiveTab from './getActiveTab';
import { updateLocalStorage } from './localStorageUtil';



/**
 * 
 * @param tabId 
 * @returns {Promise}
 */
async function 揀咗個VideoElement先(tabId) {
    return chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            window.__VIDEO_CONTROLLER_TEMP__ = {
                selectedVideoElement: document.getElementsByTagName('video')[0],
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
    揀咗個VideoElement先(tabId);
    return chrome.scripting.executeScript({
        target: { tabId },
        func: async (value) => {
            window.__VIDEO_CONTROLLER_TEMP__.selectedVideoElement.currentTime += value;
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
    return JumpTime?.[tabId] || 85;
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