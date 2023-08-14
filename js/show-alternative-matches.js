
function showAlternativeMatches (targetElem) {
    if (targetElem.className === 'CodeMirror-code') {
        const altMatchesContainer = document.getElementById('sfw-alt-matches-container-id');
        if (altMatchesContainer) {
            return;
        }

        // get alternative matches
        const originalResponse = getOriginalResponse(targetElem);
        const alternativeMatches = originalResponse.diagnosticInfo['Alternative Matched Intents'];

        // create html element
        const alternativeMatchesHtml = createAlternativeMatchesHtml(alternativeMatches);
        const editorElem = document.getElementsByTagName('df-json-editor')[0];
        editorElem.parentElement.insertBefore(alternativeMatchesHtml, editorElem);
    }
}

function getOriginalResponse (container) {
    const jsonText = getTextFromElement(container);
    const originalResponse = JSON.parse(jsonText);

    return originalResponse;
}

function getTextFromElement (element) {
    let text = '';
    for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent.trim();
        } else {
            text += getTextFromElement(child);
        }
  }
  return text;
}


function createAlternativeMatchesHtml(matches) {
    const container = document.createElement('div');
    container.id = 'sfw-alt-matches-container-id';
    container.className = 'sfw-alt-matches-container';
    const matchesHtml = []
    matches.forEach(({ DisplayName, Score }, idx) => {
        let color = 'high';
        if (Score < 0.5) {
            color = 'low';
        } else if (Score < 0.7) {
            color = 'medium';
        }
        const differenceWithPrevious = idx !== 0 ? scoreDifferenceHtml(matches[idx-1].Score, Score) : ``
        matchesHtml.push(`<div class="sfw-alt-match">
            <span class="sfw-alt-match-name">${DisplayName}</span>
            <span class="sfw-alt-match-score ${color}">${Score.toFixed(4)}${differenceWithPrevious}</span>
        </div>`)
    })

    container.innerHTML = `
      <h3 class="gmat-subhead-2">Alternative matches</h3>
      ${matchesHtml.join('')}
    `;

    return container;
}

function scoreDifferenceHtml(previousScore, currentScore) {
    const diff = currentScore-previousScore
    const diffColor = Math.abs(diff) < 0.1 ? 'low' : Math.abs(diff) < 0.2 ? 'medium' : 'high'
    return `<span class="sfw-alt-match-score ${diffColor}"> (${(diff).toFixed(4)})</span>`
}