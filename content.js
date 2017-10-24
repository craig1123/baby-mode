function keyboard(e) {
  e.preventDefault();
  console.log(e.key);
  // var myAudio = new Audio();        // create the audio object
  // myAudio.src = "path/to/file.mp3"; // assign the audio file to its src
  // myAudio.play();
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