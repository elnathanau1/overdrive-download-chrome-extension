//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(arg, sender, sendResponse) {
    var author = arg["author"];
    var title = arg["title"];
    var downloadUrl = arg["downloadUrl"];
    var i = arg["part"];

    chrome.downloads.download({
      url: downloadUrl,
      filename: `${author} - ${title}/${author} - ${title} - Part${i}.mp3`
    }, function(id) {});
  });
