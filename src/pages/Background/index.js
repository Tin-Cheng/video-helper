import { onClickChangeLoopState } from '../../chromeActions/manageLooper';

console.log('This is the background page.');
console.log('Put the background scripts here.');
chrome.commands.onCommand.addListener(async (command) => {
    if (command == "toggle-feature-loop") {
        await onClickChangeLoopState(undefined);
    }
});