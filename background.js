// function getToggle(callback) { // expects function(value){...}
//   chrome.storage.local.get('toggle', function(data){
//     if (data.toggle === undefined) {
//       callback(false); // default value
//     } else {
//       callback(data.toggle);
//     }
//   });
// }
//
// function setToggle(value, callback){ // expects function(){...}
//   chrome.storage.local.set({toggle : value}, function(){
//     if(chrome.runtime.lastError) {
//       throw Error(chrome.runtime.lastError);
//     } else {
//       callback();
//     }
//   });
// }
//
// chrome.browserAction.onClicked.addListener(function(tab) {
//   getToggle(function(toggle){
//     toggle = !toggle;
//     setToggle(toggle, function(){
//       /* The rest of your code; at this point toggle is saved */
//     });
//   });
// });