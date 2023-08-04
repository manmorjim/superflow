
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

    const matchesHtml = matches.map(({ DisplayName, Score }) => {
        let color = 'high';
        if (Score < 0.5) {
            color = 'low';
        } else if (Score < 0.7) {
            color = 'medium';
        }
        return `<div class="sfw-alt-match">
            <span class="sfw-alt-match-name">${DisplayName}</span>
            <span class="sfw-alt-match-score ${color}">${Score}</span>
        </div>`
    }).join('');

    container.innerHTML = `
      <h3 class="gmat-subhead-2">Alternative matches</h3>
      ${matchesHtml}
    `;

    return container;
}