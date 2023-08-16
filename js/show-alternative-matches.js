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
    const matchesHtml = matches.map(({ DisplayName, Score, Parameters }) => {
        let color = 'high';
        if (Score < 0.5) {
            color = 'low';
        } else if (Score < 0.7) {
            color = 'medium';
        }
        return `<div class="sfw-alt-match">
            <span class="sfw-alt-match-name">${DisplayName}</span>
            <span class="sfw-alt-match-score ${color}">${Score}</span>
            ${createParametersHtml(Parameters, input, parameterColors)}
        </div>`
    }).join('');

    container.innerHTML = `
      <h3 class="gmat-subhead-2">Alternative matches</h3>
      ${matchesHtml}
    `;

    return container;
}

function createParametersHtml(parameters, input, parameterColors) {
    if (!parameters) {
        return '';
    }

    let utteranceWithSpans = input;
    Object.values(parameters).forEach(({type, original}, i) => {
        const color = parameterColors[type];
        utteranceWithSpans = utteranceWithSpans.replace(original,
             `<span class="sfw-alt-match-param" style="background-color: ${color}" title="${type}">${original}</span>`
        );
    });

    return `<div class="sfw-intent-utterance">${utteranceWithSpans}</div>`;
}

function assignColorsToParameters(matches) {
    const parameterColors = {};
    matches.forEach(({ Parameters }) =>
        Object.values(Parameters).forEach(({ type }, i) => {
            if (parameterColors[type]) return;


            const color = ENTITY_COLORS_PALETTE[i % ENTITY_COLORS_PALETTE.length];
            parameterColors[type] = color;
        }));
    return parameterColors;
}