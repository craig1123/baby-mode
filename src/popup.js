function keyboard(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({ type: 'sound', sound: e.key.toLowerCase() });
  return false;
};

function soundListener(checked) {
  if (checked) {
    window.addEventListener('keydown', keyboard);
  } else {
    window.removeEventListener('keydown', keyboard);
  }
}

function init() {
  var fun = document.getElementById('fun');
  var toggle = document.getElementById('toggle');
  var ctrl = document.getElementById('ctrl');
  ctrl.innerText = navigator.platform.toUpperCase().indexOf('MAC')>=0 ? 'cmd' : 'ctrl';

  // initial state
  chrome.storage.sync.get({ checked: false }, function(item) {
    fun.checked = item.checked;
    if (fun.checked) {
      soundListener(true);
    }
  })

  // sends a message to the background script and saves option
  toggle.addEventListener('click', function() {
    fun.checked = !fun.checked;
    chrome.storage.sync.set({ checked: fun.checked });
    chrome.runtime.sendMessage({ type: 'toggle', checked: fun.checked });
    soundListener(fun.checked);
  }, false);

  // listens for messages from background
  chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'switch') {
      fun.checked = !fun.checked;
      soundListener(fun.checked);
    }
  });

}

document.addEventListener('DOMContentLoaded', init, false);
