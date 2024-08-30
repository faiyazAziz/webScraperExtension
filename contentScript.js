let selectionMode = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === 'startSelecting') {
            selectionMode = true;
            console.log("selection mode enabled");  
            document.addEventListener('click', clickElement);
            document.addEventListener('mouseover', highlightElement);
            document.addEventListener('mouseout', unhighlightElement);  
        }
        if(request.action === 'stopSelecting') {
            selectionMode = false;
            console.log("selection mode disabled");
            document.removeEventListener('click', clickElement);
            document.removeEventListener('mouseover', highlightElement);
            document.removeEventListener('mouseout', unhighlightElement);
        }
        // sendResponse({farewell: "goodbye"});
    },
    
);

 function highlightElement(event) {
    if (!selectionMode) return;
    event.target.style.border = '2px solid green';
};

function unhighlightElement(event) {
    event.target.style.border = '';
}

function clickElement(event) {
    event.preventDefault();
    event.stopPropagation();
    if(!selectionMode) return;
    const element = event.target;
    element.style.backgroundColor = 'green';
    // selectedElements.push(element.outerHTML); // Store the selected element's HTML
    // updateSidePanel();
    console.log(element);

    chrome.runtime.sendMessage({ selectedElement: element.outerHTML,greeting:"clicked" });
    
}