
const requestOnCompleted = (info) => {
  console.error(info)
}

chrome.webRequest.onCompleted.addListener(
    requestOnCompleted,
    {
      urls: ['<all_urls>']
    }
    // filter: RequestFilter,
    // extraInfoSpec?: OnCompletedOptions[],
  )

