# Baby Mode MV3 Migration - Debugging Guide

## Fixed Issues

The following changes were made to fix the "Unchecked runtime.lastError: Could not establish connection" error:

1. **Added error handling** to all `chrome.runtime.sendMessage()` calls with `.catch()` statements
2. **Fixed audio path** in offscreen.js to use `chrome.runtime.getURL()` instead of relative paths
3. **Added console logging** throughout the extension for debugging
4. **Fixed message sending** between service worker and offscreen document
5. **Added error handling** to tab messaging in `sendMsgToCS()`

## How to Test

### Step 1: Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Navigate to `/Users/craigwalker/Desktop/code/baby-mode/src/` and select it
5. The extension should appear in your extensions list

### Step 2: Check for Errors in DevTools

1. In the Extensions page, find "Baby Mode" and click the **service worker** link
   - This opens the DevTools for the service worker
   - Check the Console tab for any error messages
   - You should see: "Baby Mode Service Worker loaded"

2. Open any web page in Chrome
3. Right-click → **Inspect** to open DevTools
4. Go to the **Console** tab
5. You should see logs from the content script

### Step 3: Test the Extension

1. **Test Popup Toggle:**
   - Click the Baby Mode extension icon
   - Click the toggle button
   - Check the console for any errors

2. **Test Keyboard Shortcut:**
   - Press `Cmd+Shift+0` (Mac) or `Ctrl+Shift+0` (Windows)
   - You should see the Baby Mode overlay appear
   - Try pressing a key (e.g., 'a') - a sound should play
   - Check the console for any errors

3. **Test Content Script:**
   - Open a web page
   - Press the Baby Mode toggle
   - Enable baby mode
   - Press a key on the keyboard
   - You should see a blue overlay in the corner and hear a sound

## Troubleshooting

### Error: "Receiving end does not exist"

This can occur if:

- The service worker hasn't fully loaded yet (wait a moment and try again)
- The offscreen document failed to create
- Check the **Service Worker Console** for errors

**Solution:**

1. Open `chrome://extensions/`
2. Click the service worker link for Baby Mode
3. Look for error messages in the console
4. Reload the extension (toggle off, then on)

### No Sound Playing

1. Check that sound files exist in `src/sounds/` directory
2. Verify web_accessible_resources in manifest.json includes `sounds/*`
3. Check the **Offscreen Document** console for audio errors:
   - Open `chrome://extensions/`
   - Find Baby Mode → Service Worker (in blue text)
   - Open DevTools for the offscreen document if available
   - Or check browser console for "Failed to play sound" messages

### Overlay Not Appearing

1. Verify the content script is loaded:
   - Open DevTools on any web page
   - Check Console - should show no errors from Baby Mode
2. Click the extension icon and toggle Baby Mode on
3. Look for "Baby Mode enabled" overlay in top-left corner

## Files Modified

- `manifest.json` - Updated to MV3 format
- `service-worker.js` - Replaces background.js, handles communication
- `offscreen.html` - New file for audio playback
- `offscreen.js` - New file, handles audio playback in offscreen document
- `content.js` - Updated to use modern Chrome APIs
- `popup.js` - Updated with error handling

## Console Logs to Look For

**Service Worker:**

- "Baby Mode Service Worker loaded"
- "Failed to setup offscreen document:" (if error occurs)
- "Failed to send message to offscreen:" (if error occurs)
- "Could not send message to tab:" (debug info)

**Offscreen Document:**

- "Offscreen document loaded"
- "Offscreen received message:" (with message object)
- "Offscreen message listener registered"
- "Failed to play sound:" (if audio fails)

**Content Script:**

- "Failed to send sound message:" (if error occurs)

## Next Steps

If you still see errors:

1. Note the exact error message and where it appears (DevTools console)
2. Check if there are any missing sound files
3. Verify all files are in the `src/` directory
4. Try removing and reloading the extension
