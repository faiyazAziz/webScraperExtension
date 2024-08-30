document.addEventListener('DOMContentLoaded', function () {
    const toggleSelectionButton = document.getElementById('toggle-selection');
    const viewStoredElementsButton = document.getElementById('view-elements');
    const clearStoredElementsButton = document.getElementById('clear-elements');
  
    toggleSelectionButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['contentScript.js']
        }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSelectionMode' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }
            toggleSelectionButton.textContent = response.status ? 'Selection Mode Enabled' : 'Selection Mode Disabled';
          });
        });
      });
    });
  
    viewStoredElementsButton.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('display.html') });
    });
  
    clearStoredElementsButton.addEventListener('click', () => {
      chrome.storage.local.set({ savedElements: [] }, () => {
        alert('Stored elements cleared.');
      });
    });
  });
  