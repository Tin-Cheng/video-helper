import { updateSyncStorage } from './localStorageUtil';

export default async function init() {
    let { DefaultJumpTime } = await chrome.storage.sync.get(['DefaultJumpTime']);
    if (DefaultJumpTime === undefined) {
        updateSyncStorage('DefaultJumpTime', 85);
    }
}
