# Video Helper
This extension is created for tunning video playback rate and jump forward or backward by a defined number of seconds.

## Features
- Jump forward or backward by the inputted number of seconds (Default 85)
  - Shortcuts:
    - Jump backward:
      - Windows: Ctrl + Shift + I
      - MacOS: Command + Shift + I 
    - Jump forward: 
      - Windows: Ctrl + Shift + O
      - MacOS: Command + Shift + O
- Preserves audio pitch (Default = true)
- AB loop
  - Click "set Start Time" or "set End Time" to record the current play time.
  - Check Enable Loop and the video will loop between the defined play time.

## Usage
Run `npm run build`
Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
Please check the boilderplate for other details.

This chrome extension is created with the following boilerplate:
[Chrome Extension (MV3) Boilerplate with React 18 and Webpack 5](https://github.com/lxieyang/chrome-extension-boilerplate-react)
