let downloadAudiobook = document.getElementById('downloadAudiobook');
var query = {active: true, currentWindow: true };
chrome.tabs.query(query, function(tabs) {
  var url = tabs[0].url;
  if ((new URL(url)).host.includes("listen.overdrive.com")) {
    downloadAudiobook.disabled = false;
  }
});

downloadAudiobook.onclick = function(element) {
  var query = {active: true, currentWindow: true };
  chrome.tabs.query(query, function(tabs) {
    var url = tabs[0].url;
    var baseUrl = (new URL(url)).origin + "/";
    fetch(url)
      .then((response) => response.text())
      .then((text) => text.match(/window\.bData = ({.+?});/)[1])
      .then((jsonText) => JSON.parse(jsonText))
      .then((json) => {
        var author = json["creator"][0]["name"];
        var title = json["title"]["main"];
        for (var i=0; i < json["spine"].length; i++) {
          var downloadUrl = baseUrl + json["spine"][i]["path"];
          var leadingZeroFormat = new Intl.NumberFormat('en-US', {
              minimumIntegerDigits: 2
          });
          var param = {
            "author" : author,
            "title" : title,
            "downloadUrl" : downloadUrl,
            "part": leadingZeroFormat.format(i+1)
          };
          chrome.runtime.sendMessage(param);
          downloadAudiobook.disabled = true;
          downloadAudiobook.textContent = "Downloading...";
        };
      })
  });
}
