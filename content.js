chrome.runtime.onMessage.addListener((msg, sender, cb) => {
  if (msg.checked) {
    console.log('heyooo');
    window.addEventListener('keydown', (e) => {
      console.log(e.key);
    })
  }
});