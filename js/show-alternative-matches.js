const ENTITY_COLORS_PALETTE = [
    '#9fecfe',
    '#afffc8',
    '#d2c3ea',
    '#ffd1af',
    '#ffcdf6',
    '#dadfe3',
    '#d7ccc8',
    '#fffda6',
];

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
        const alternativeMatchesHtml = createAlternativeMatchesHtml(alternativeMatches, originalResponse.text);
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


function createAlternativeMatchesHtml(matches, input) {
    const container = document.createElement('div');
    container.id = 'sfw-alt-matches-container-id';
    container.className = 'sfw-alt-matches-container';

    const parameterColors = assignColorsToParameters(matches);
    const matchesHtml = [];
    matches.forEach(({ DisplayName, Score, Parameters }, idx) => {
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
            ${createParametersHtml(Parameters, input, parameterColors)}
        </div>`);
    });

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

function createParametersHtml(parameters, input, parameterColors) {
    if (!parameters) {
        return `<div class="sfw-intent-utterance">${input}</div>`;
    }

    let utteranceWithSpans = input;
    Object.entries(parameters).forEach(([type, { original }], i) => {
        const color = parameterColors[type];
        utteranceWithSpans = utteranceWithSpans.replace(original,
             `<span class="sfw-alt-match-param" style="background-color: ${color}" title="@${type}">${original}</span>`
        );
    });

    return `<div class="sfw-intent-utterance">${utteranceWithSpans}</div>`;
}

function assignColorsToParameters(matches) {
    const parameterColors = {};
    matches.forEach(({ Parameters }) => {
        if (!Parameters) return;

        Object.keys(Parameters).forEach((type, i) => {
            if (parameterColors[type]) return;

            // get the first color not used by any parameter
            let color = ENTITY_COLORS_PALETTE.find(c =>
                Object.values(parameterColors).every(pc => pc !== c));
            if (!color) {
                color = ENTITY_COLORS_PALETTE[i % ENTITY_COLORS_PALETTE.length];
            }
            parameterColors[type] = color;
        });
    });
    return parameterColors;
}