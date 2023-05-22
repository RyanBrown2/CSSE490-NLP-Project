
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}



async function processPage(results) {
  // const resultText = document.querySelector('#result');
  // resultText.innerHTML = "Test"
  // document.querySelector('h1').innerText="Beep"
  let pos = [];
  let neg = [];
  // const reviewList = document.querySelector('#cm-cr-dp-review-list');
  const divs = document.getElementsByClassName('review-text-content');
  for (var i = 0; i < divs.length; i++) {
      // divs[i].getElementsByTagName('span')[0].innerText = 'Found Review Text';
      let reviewText = divs[i].getElementsByTagName('span')[0].innerText;
      await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      },
      body: reviewText
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          pos.push(data.pos);
          neg.push(data.neg);
        });
  }

  // let avgPos = pos.reduce((a, b) => a + b, 0) / pos.length;
  // return avgPos;
  let avgTotal = 0;
  for (var i = 0; i < pos.length; i++) {
    avgTotal += pos[i];
    // console.log(pos[i]);
  }

  let averagePos = avgTotal/pos.length;

  console.log("Positive Average: " + averagePos);
  return averagePos;

}

getCurrentTab().then(tab1 => {
  chrome.scripting.executeScript({
    target: {tabId: tab1.id, allFrames: true},
    func: processPage
  }).then(results => {
    console.log(results);
    document.querySelector('h1').innerText=results[0].result;
  });
});