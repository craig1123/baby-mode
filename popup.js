function init() {
  var toggle = document.getElementById('toggle');
  var ctrl = document.getElementById('ctrl');
  ctrl.innerText = navigator.platform.toUpperCase().indexOf('MAC')>=0 ? 'cmd' : 'ctrl';

  // initial state
  chrome.storage.sync.get({ checked: false }, function(item) {
    toggle.checked = item.checked;
  })

  // sends a message to the background script and saves option
  toggle.addEventListener('click', function() {
    chrome.storage.sync.set({ checked: toggle.checked });
    chrome.runtime.sendMessage({ type: 'toggle', checked: toggle.checked });
  }, false);

  // listens for messages from background
  chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'switch') {
      toggle.checked = !toggle.checked;
    }
  });
}

document.addEventListener('DOMContentLoaded', init, false);