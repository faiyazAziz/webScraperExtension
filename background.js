chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js']
    });
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    await chrome.sidePanel.setOptions({
        tabId,
        path: 'sidepanel.html',
        enabled: true
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("tab activated", activeInfo.tabId,"hbdhgdh");
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'openSidePanel',
        title: 'Open side panel',
        contexts: ['all']
    });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel') {
      chrome.sidePanel.setOptions({
        tabId: tab.id,  // This ensures that the side panel opens only for the current tab
        path: 'sidepanel.html', // Replace with your actual side panel HTML file
        enabled: true
      });
    }
  });


