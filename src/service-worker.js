console.log("Baby Mode Service Worker loaded");

var attachSounds = {
  a: "a.m4a",
  b: "b.m4a",
  c: "c.m4a",
  d: "d.m4a",
  e: "e.m4a",
  f: "f.m4a",
  g: "g.m4a",
  h: "h.m4a",
  i: "i.m4a",
  j: "j.m4a",
  k: "k.m4a",
  l: "l.m4a",
  m: "m.m4a",
  n: "n.m4a",
  o: "o.m4a",
  p: "p.m4a",
  q: "q.m4a",
  r: "r.m4a",
  s: "s.m4a",
  t: "t.m4a",
  u: "u.m4a",
  v: "v.m4a",
  w: "w.m4a",
  x: "x.m4a",
  y: "y.m4a",
  z: "z.m4a",
  0: "0.m4a",
  1: "1.m4a",
  2: "2.m4a",
  3: "3.m4a",
  4: "4.m4a",
  5: "5.m4a",
  6: "6.m4a",
  7: "7.m4a",
  8: "8.m4a",
  9: "9.m4a",
  control: "bird.mp3",
  "`": "cow.mp3",
  alt: "sheep.mp3",
  meta: "dog.mp3",
  shift: "duck.mp3",
  capslock: "rooster.mp3",
  tab: "dolphin.mp3",
  escape: "chicken.mp3",
  " ": "base.mp3",
  arrowup: "clave.mp3",
  arrowdown: "clap.mp3",
  arrowleft: "snaredrum1.mp3",
  arrowright: "electrohihat.mp3",
  ",": "electrowow.mp3",
  ".": "hihat.mp3",
  "'": "hihat2.mp3",
  ";": "hihat3.mp3",
  enter: "snaredrum2.mp3",
  "]": "tom2.mp3",
  "[": "tom1.mp3",
  "\\": "electrolong.mp3",
  "=": "crash.mp3",
  "-": "thump.mp3",
  "/": "ah.mp3",
};

let offscreenReady = false;
let offscreenReadyPromise = null;
let resolveOffscreenReady = null;
let pendingSounds = [];

function waitForOffscreenReady() {
  if (offscreenReady) {
    return Promise.resolve();
  }
  if (!offscreenReadyPromise) {
    offscreenReadyPromise = new Promise((resolve) => {
      resolveOffscreenReady = resolve;
      setTimeout(() => {
        if (!offscreenReady) {
          console.warn(
            "Offscreen document did not signal ready; continuing after timeout.",
          );
          resolve();
        }
      }, 500);
    });
  }
  return offscreenReadyPromise;
}

function markOffscreenReady() {
  offscreenReady = true;
  if (resolveOffscreenReady) {
    resolveOffscreenReady();
  }
}

async function setupOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl],
  });

  if (existingContexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Playing audio for baby mode keyboard interactions",
  });
}

function sendMsgToCS(checked, once) {
  const msgObj = { type: "toggle", checked: checked };
  if (once !== undefined) msgObj.once = once;
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, msgObj).catch((error) => {
        console.debug("Could not send message to tab:", error);
      });
    });
  });
}

function updateState(cb) {
  chrome.storage.sync.get({ checked: false }, cb);
}

updateState(function (item) {
  sendMsgToCS(item.checked);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "sound") {
    const soundFile = attachSounds[request.sound];
    if (!soundFile) {
      console.warn("No sound mapping for key:", request.sound);
      return;
    }

    setupOffscreenDocument()
      .then(waitForOffscreenReady)
      .then(() => {
        if (!offscreenReady) {
          pendingSounds.push(soundFile);
          return;
        }

        chrome.runtime
          .sendMessage({
            type: "play-sound",
            sound: soundFile,
          })
          .catch((error) => {
            console.error("Failed to send message to offscreen:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to setup offscreen document:", error);
      });
  } else if (request.type === "offscreen-ready") {
    markOffscreenReady();
    if (pendingSounds.length > 0) {
      pendingSounds.forEach((soundFile) => {
        chrome.runtime
          .sendMessage({ type: "play-sound", sound: soundFile })
          .catch((error) => {
            console.error("Failed to send queued sound to offscreen:", error);
          });
      });
      pendingSounds = [];
    }
  } else if (request.type === "toggle") {
    sendMsgToCS(request.checked, true);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    updateState(function (item) {
      sendMsgToCS(item.checked);
    });
  }
});

chrome.tabs.onActivated.addListener(function () {
  updateState(function (item) {
    sendMsgToCS(item.checked);
  });
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-baby-mode") {
    updateState(function (item) {
      chrome.storage.sync.set({ checked: !item.checked });
      sendMsgToCS(!item.checked, true);
    });
  }
});
