var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    showEntityDetails(mutation.target);
    showAlternativeMatches(mutation.target);
  });
});

// Observe the body (and its descendants) for `childList` changes.
observer.observe(document.body, {
  childList: true, 
  subtree: true
});

// Stop the observer, when it is not required any more.
// observer.disconnect();