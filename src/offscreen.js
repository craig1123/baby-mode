// Handle audio playback for baby mode
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Offscreen received message:", request);
  if (request.type === "play-sound") {
    try {
      const audio = new Audio();
      audio.src = chrome.runtime.getURL(`sounds/${request.sound}`);
      audio.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
    } catch (error) {
      console.error("Error in audio playback:", error);
    }
  }
});

chrome.runtime.sendMessage({ type: "offscreen-ready" }).catch((error) => {
  console.error("Failed to send offscreen ready message:", error);
});
