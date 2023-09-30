export const updateLocalStorage = async (key, value, tabId) => {
    let { [key]: obj } = await chrome.storage.local.get([key]);
    return chrome.storage.local.set({ [key]: { ...obj, [tabId]: value } });
}



export const updateSyncStorage = async (key, value) => {
    return chrome.storage.sync.set({ [key]: { value } });
}