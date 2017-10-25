
function sendMsgToCS(checked) {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'toggle', checked: checked }, function(res) {});
    });
  });
}

function toggleState() {
  chrome.storage.sync.get({ checked: false }, function(item) {
    sendMsgToCS(!item.checked);
    chrome.storage.sync.set({ checked: !item.checked });
  });
};

function restoreState(opposite) {
  chrome.storage.sync.get({ checked: false }, function(item) {
    sendMsgToCS(item.checked);
  });
};
restoreState();

chrome.runtime.onMessage.addListener(function(request) {
  if (request.type === 'toggle') {
    sendMsgToCS(request.checked);
  } else if (request.type === 'sound') {
    var myAudio = new Audio();        // create the audio object
    myAudio.src = `./sounds/${request.sound}.m4a`; // assign the audio file to its src
    myAudio.play();
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    restoreState();
  }
})

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'toggle-baby-mode') {
    chrome.runtime.sendMessage({ type: 'switch' });
    toggleState();
  }
});