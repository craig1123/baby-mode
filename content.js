chrome.runtime.onMessage.addListener((msg, sender, cb) => {
  var addedListeners = {};

  function addWindowListenerIfNone(eventType, fun) {
    if (addedListeners[eventType]) return;
    addedListeners[eventType] = fun;
    window.addEventListener(eventType, fun);
  }

  function keyboard(e) {
    console.log(e.key);
    // var myAudio = new Audio();        // create the audio object
    // myAudio.src = "path/to/file.mp3"; // assign the audio file to its src
    // myAudio.play();
    e.preventDefault();
    return false;
  };

  console.log(msg);

  if (msg.checked) {
    console.log('heyooo');
    addWindowListenerIfNone('keydown', keyboard);
  } else {
    window.removeEventListener('keydown', keyboard);
  }
});