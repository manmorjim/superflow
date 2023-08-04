
function showEntityDetails (targetElem) {
    if (
        targetElem.classList.contains('menu-content') &&
        targetElem.children[0].classList.contains('remove-button') &&
        targetElem.children[1].tagName === 'MAT-DIVIDER'
    ) {
        const altMatchesContainer = document.getElementById('sfw-alt-matches-container-id');
        if (altMatchesContainer) {
            return;
        }

        const tagText = targetElem.querySelector('button > span > span > span').textContent;
        const entity = tagText.replaceAll(/\s*\@(.+)\s*/g, '$1');
        const entityDetailsHtml = createEntityDetailsHtml(entity);
        // TODO
    }
}


function createEntityDetailsHtml(entity) {
    // https://dialogflow.clients6.google.com/v3alpha1/projects/tl-6ijm8f26nm79optunasm/locations/global/agents/d676684e-e109-4387-8a7f-22e52aa03d9e/entityTypes?languageCode=en&pageSize=200&key=AIzaSyD1dO8oRagJkmtkSJ9oLI289jIT8M4Zk5s
    console.log('----------------');
    console.log(entity);
    console.log('----------------');
}