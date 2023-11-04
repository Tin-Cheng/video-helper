import { test, expect } from './fixture';

test('options edit default jump time', async ({ context, page, extensionId }) => {
    const JUMP_TIME = 5;
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await expect(page.locator('h1')).toHaveText('Options Page');
    await page.getByRole('textbox').first().fill(JUMP_TIME.toString());
    let page_one = await context.newPage();
    await page_one.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(page_one.getByRole('textbox').first()).toHaveValue(JUMP_TIME.toString());
});


test('popup test', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(page.locator('h1')).toHaveText('Video Controller');
});
//Playwright cannot Invoke chrome extension using the keyboard shortcut yet
//Playwright cannot interact pop up menu while stay on same tab yet
/*
test('jump test', async ({ context, page, extensionId }) => {
    const JUMP_TIME = 5;
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await expect(page.locator('h1')).toHaveText('Options Page');
    await page.getByRole('textbox').first().fill(JUMP_TIME.toString());
    await page.locator('h1').click();
    await page.goto('https://www.w3schools.com/html/html5_video.asp');
    await page.getByText('Accept all & visit the site').click();
    //await page.locator('#video1').click();

    let page_one = await context.newPage();
    await page_one.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.locator('#video1').focus();
    await page.waitForTimeout(3000);
    const startPlayTime = await page.evaluate(() => {
        return document.getElementsByTagName('video')[0].currentTime
    });
    await page.keyboard.press('Meta+Shift+O');
    await page_one.getByRole('button', { name: '>>' }).click();
    const endPlayTime = await page.evaluate(() => {
        return document.getElementsByTagName('video')[0].currentTime
    });
    await expect(endPlayTime).toBe(startPlayTime + JUMP_TIME);
});*/