export default async function getActiveTab() {
    return await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs);
        });
    });
}