let selectionMode = false;
let selectingParent = false;
let selectingChild = false;
let selectedElements = [];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action === 'startSelectingParent'){
            selectionMode = true;
            selectingParent = true;
            document.addEventListener('click', clickParentElement);
            document.addEventListener('mouseover', highlightElement);
            document.addEventListener('mouseout', unhighlightElement);
        }
        else if(request.action === 'startSelectingChild'){
            selectingChild = true;
            selectionMode = true;
            console.log("selecting child");
            document.addEventListener('click', clickChildElement);
            document.addEventListener('mouseover', highlightElement);
            document.addEventListener('mouseout', unhighlightElement);
        }
        else if(request.action === 'stopSelecting'){
            selectionMode = false;
            selectingParent = false;
            selectingChild = false;
            document.removeEventListener('click', clickParentElement);
            document.removeEventListener('mouseover', highlightElement);
            document.removeEventListener('mouseout', unhighlightElement);
        }
        sendResponse({ status: 'success' });
    }
)

function unhighlightElement(event) {
    event.target.style.border = '';
}

function highlightElement(event) {
    if (!selectionMode) return;
    event.target.style.border = '2px solid green';
};

function clickParentElement(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!selectionMode || !selectingParent) return;

    const element = event.target;
    element.style.outline = '3px solid blue';
    element.style.backgroundColor = 'rgba(49, 88, 237, 0.5)';

    selectedElements.push({
        name: element.tagName,
        html: element.outerHTML,
        childs: []
    });

    // console.log("Parent element selected:", element);
    sendSelectedElements();
    selectingParent = false;
}

function clickChildElement(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!selectionMode || !selectingChild) return;

    const element = event.target;
    element.style.outline = '3px solid green';
    element.style.backgroundColor = 'rgba(49, 237, 88, 0.5)';

    // Find the last selected parent
    const parentElement = selectedElements[selectedElements.length - 1];
    if (parentElement) {
        parentElement.childs.push({
            name: element.tagName,
            html: element.outerHTML
        });
    }
    sendSelectedElements();
    console.log("Child element selected:", selectedElements);
}

// chrome.runtime.sendMessage({ selectedElements: selectedElements });


function sendSelectedElements() {
    // Send selectedElements to the background script
    chrome.runtime.sendMessage({ selectedElements: selectedElements, message: "selectedElements" });
}


chrome.runtime.sendMessage({entireDocument: document.documentElement.outerHTML,message: "webPage"});