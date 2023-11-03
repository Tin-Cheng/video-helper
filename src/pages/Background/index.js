import { onClickChangeLoopState } from '../../chromeActions/manageLooper';
import { onClickJumpForward, onClickJumpBackward } from '../../chromeActions/addSeconds';
import init from '../../chromeActions/init';

init();
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-feature-loop") {
        await onClickChangeLoopState(undefined);
    }
    else if (command === "toggle-feature-jump-forward") {
        await onClickJumpForward(undefined);
    }
    else if (command === "toggle-feature-jump-backward") {
        await onClickJumpBackward(undefined);
    }
});