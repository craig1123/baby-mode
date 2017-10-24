function init() {
  const toggle = document.getElementById('toggle');

  // sends a message to the content script
  function sendMsg(checked) {
    chrome.runtime.sendMessage({ checked: checked });
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { checked: checked });
      });
    });
  }

  // Restores checkbox state using the preferences stored in chrome.storage.sync
  const restoreOptions = () => {
    chrome.storage.sync.get({ checked: false }, (item) => {
      toggle.checked = item.checked;
      sendMsg(toggle.checked)
    });
  }

  restoreOptions();

  toggle.addEventListener('click', function() {
    chrome.storage.sync.set({ 'checked': toggle.checked })
    sendMsg(toggle.checked);
  }, false);


}


document.addEventListener('DOMContentLoaded', init, false);