
let selectedElementArray = [];

// console.log("sidepanel.js loaded",startSelecting);
document.addEventListener('DOMContentLoaded', function () {

    startSelecting = document.getElementById('startSelectingButton');
    stopSelecting = document.getElementById('stopSelectingButton');
    saveButton = document.getElementById('saveButton');
    statusMessage = document.getElementById('status');
    const selectedElements = document.getElementById('elementsList');


    startSelecting.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: "startSelecting" });
        // do something with response here, not outside the function
        console.log(response);
    });

    stopSelecting.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: "stopSelecting" });
        // do something with response here, not outside the function
        console.log(response);
    });

    saveButton.addEventListener('click',()=>{
        let res = fetch('http://127.0.0.1:5000/message',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'selectedElements':selectedElementArray})
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            console.log('Success:', data.response);
            statusMessage.innerHTML = 'Success';
            statusMessage.style.color = 'green';
        })
        .catch((error) => {
            console.error('Error:', error);
            statusMessage.innerHTML = 'Error';
            statusMessage.style.color = 'red';
        });
        
    })


    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.greeting === 'clicked') {
            console.log("Received element HTML:", request.selectedElement);
            const escapedHtml = escapeHtml(request.selectedElement);
            const node = document.createElement("li");
            node.innerHTML = escapedHtml;
            selectedElementArray.push(request.selectedElement);
            selectedElements.appendChild(node);
            console.log(selectedElementArray);
            
        }
    });
    function escapeHtml(str) {
        if (typeof str !== 'string') {
            console.error("Expected a string but received:", str);
            return '';  // or handle this case accordingly
        }
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
