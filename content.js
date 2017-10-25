function keyboard(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({ type: 'sound', sound: e.key });
  return false;
};

chrome.runtime.onMessage.addListener(function(msg, sender, cb) {

  function toggle() {
    if (msg.checked) {
      document.addEventListener('keydown', keyboard);
    } else {
      document.removeEventListener('keydown', keyboard);
    }
  }

  if (msg.type === 'toggle') {
    toggle();
  }
});