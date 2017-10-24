// sends a message to the content script
function sendMsg(checked) {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { checked: checked });
    });
  });
}

// Restores checkbox state using the preferences stored in chrome.storage.sync
const restoreOptions = () => {
  chrome.storage.sync.get({ checked: false }, (item) => {
    sendMsg(item.checked)
  });
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.checked) {
    console.log('hi');
  }
});