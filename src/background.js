var attachSounds = {
  a: 'a.m4a',
  b: 'b.m4a',
  c: 'c.m4a',
  d: 'd.m4a',
  e: 'e.m4a',
  f: 'f.m4a',
  g: 'g.m4a',
  h: 'h.m4a',
  i: 'i.m4a',
  j: 'j.m4a',
  k: 'k.m4a',
  l: 'l.m4a',
  m: 'm.m4a',
  n: 'n.m4a',
  o: 'o.m4a',
  p: 'p.m4a',
  q: 'q.m4a',
  r: 'r.m4a',
  s: 's.m4a',
  t: 't.m4a',
  u: 'u.m4a',
  v: 'v.m4a',
  w: 'w.m4a',
  x: 'x.m4a',
  y: 'y.m4a',
  z: 'z.m4a',
  0: '0.m4a',
  1: '1.m4a',
  2: '2.m4a',
  3: '3.m4a',
  4: '4.m4a',
  5: '5.m4a',
  6: '6.m4a',
  7: '7.m4a',
  8: '8.m4a',
  9: '9.m4a',
  control: 'bird.mp3',
  '`': 'cow.mp3',
  alt: 'sheep.mp3',
  meta: 'dog.mp3',
  shift: 'duck.mp3',
  capslock: 'rooster.mp3',
  tab: 'dolphin.mp3',
  escape: 'chicken.mp3',
  ' ': 'base.mp3',
  arrowup: 'clave.mp3',
  arrowdown: 'clap.mp3',
  arrowleft: 'snaredrum1.mp3',
  arrowright: 'electrohihat.mp3',
  ',': 'electrowow.mp3',
  '.': 'hihat.mp3',
  "'": 'hihat2.mp3',
  ';': 'hihat3.mp3',
  enter: 'snaredrum2.mp3',
  ']': 'tom2.mp3',
  '[': 'tom1.mp3',
  delete: 'electrolong.mp3',
  '=': 'crash.mp3',
  '-': 'thump.mp3',
  '/': 'ah.mp3',
};

function sendMsgToCS(checked, once) {
  const msgObj = { type: 'toggle', checked: checked };
  if (once !== undefined) msgObj.once = once;
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, msgObj, function(res) {});
    });
  });
};

function updateState(cb) {
  chrome.storage.sync.get({ checked: false }, cb);
};
updateState(function(item) {
  sendMsgToCS(item.checked);
});

chrome.runtime.onMessage.addListener(function(request) {
  if (request.type === 'sound') {
    var myAudio = new Audio();
    myAudio.src = `./sounds/${attachSounds[request.sound]}`;
    myAudio.play();
  } else if (request.type === 'toggle') {
    sendMsgToCS(request.checked, true);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    updateState(function(item) {
      sendMsgToCS(item.checked);
    });
  }
})

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'toggle-baby-mode') {
    chrome.runtime.sendMessage({ type: 'switch' });
    updateState(function(item) {
      sendMsgToCS(!item.checked);
      chrome.storage.sync.set({ checked: !item.checked });
    });
  }
});