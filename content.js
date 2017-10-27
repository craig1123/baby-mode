function keyboard(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({ type: 'sound', sound: e.key.toLowerCase() });
  return false;
};

chrome.runtime.onMessage.addListener(function(msg, sender, cb) {

  function toggle() {
    if (msg.checked) {
      document.addEventListener('keydown', keyboard);
      var section = document.createElement('section');
      var h1 = document.createElement('h1');
      var img = document.createElement('img');
      document.body.appendChild(section);
      section.id = 'baby-mode-enabled-overlay';
      section.style.position = 'fixed';
      section.style.display = 'flex';
      section.style.justifyContent = 'center';
      section.style.alignItems = 'center';
      section.style.zIndex = '9999';
      section.style.background = 'rgba(135, 206, 250, 0.8)';

      function cornerStyles() {
        section.style.top = 'inherit';
        section.style.left = 'inherit';
        section.style.right = '2.5%';
        section.style.bottom = '2.5%';
        section.style.width = '75px';
        section.style.height = '75px';
        section.style.borderRadius = '50%';
        h1.style.display = 'none';
        section.appendChild(img);
        img.src = chrome.extension.getURL("icon.png");
        img.style.webkitFilter = 'invert(1) contrast(500%)';
      };
      if (msg.once) {
        section.style.top = '2.5%';
        section.style.left = '2.5%';
        section.style.width = '95%';
        section.style.height = '95%';
        section.style.borderRadius = '50px';
        section.style.transition = '1.5s';
        section.appendChild(h1);
        h1.textContent = 'Baby Mode enabled';
        h1.style.fontSize = '5em';
        h1.style.color = '#fff';

        setTimeout(cornerStyles, 1000);
      } else {
        cornerStyles();
      }
    } else if(!msg.checked && !!document.getElementById('baby-mode-enabled-overlay')) {
      document.removeEventListener('keydown', keyboard);
      document.getElementById('baby-mode-enabled-overlay').remove();
    }
  }

  function reset() {

  }

  if (msg.type === 'toggle') {
    toggle();
  }
});