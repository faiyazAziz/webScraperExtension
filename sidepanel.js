let selectedElementArray = [];
let entireDocument = "";
document.addEventListener('DOMContentLoaded', function () {
    const startSelectingParentButton = document.getElementById('startSelectingParentButton');
    const startSelectingChildButton = document.getElementById('startSelectingChildButton');
    const stopSelectingButton = document.getElementById('stopSelectingButton');
    const saveButton = document.getElementById('saveButton');
    const statusMessage = document.getElementById('status');
    const selectedElementsList = document.getElementById('elementsList');

    startSelectingParentButton.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        console.log("Parent selection mode enabled");

        // Reinject the content script to ensure it's active
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
        });
        const res = await chrome.tabs.sendMessage(tab.id, { action: "startSelectingParent" });
        console.log(res);
    });

    startSelectingChildButton.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const res = await chrome.tabs.sendMessage(tab.id, { action: "startSelectingChild" });
    });

    stopSelectingButton.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const res = await chrome.tabs.sendMessage(tab.id, { action: "stopSelecting" });
    });

    saveButton.addEventListener('click', () => {
        fetch('http://127.0.0.1:5000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedElements: selectedElementArray, webPage: entireDocument })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data.response);
                statusMessage.innerHTML = 'Success';
                statusMessage.style.color = 'green';
                setTimeout(() => {
                    statusMessage.innerHTML = '';
                }, 2000);
            })
            .catch((error) => {
                console.error('Error:', error);
                statusMessage.innerHTML = 'Error';
                statusMessage.style.color = 'red';
                setTimeout(() => {
                    statusMessage.innerHTML = '';
                }, 2000);
            });

            
    });

    chrome.runtime.onMessage.addListener((request) => {
        if (request.message === 'selectedElements') {
            selectedElementArray = request.selectedElements;
            // renderSelectedElements(selectedElementArray, selectedElementsList);
            renderSelectedElements( selectedElementArray, selectedElementsList);
            
        }
        if(request.message === 'webPage') {
            entireDocument = request.entireDocument;
        }
    });

    function renderSelectedElements(elements, container) {
        container.innerHTML = '';
        elements.forEach((element, index) => {
            const li = document.createElement('li');
            
            const parentNameInput = document.createElement('input');
            parentNameInput.type = 'text';
            parentNameInput.value = element.name;
            parentNameInput.className = 'element-input';
    
            // Update the name in selectedElementArray when the input value changes
            parentNameInput.addEventListener('input', (e) => {
                elements[index].name = e.target.value;
            });
            
            const childrenList = document.createElement('ul');
            
            element.childs.forEach((child, childIndex) => {
                const childLi = document.createElement('li');
                
                const childNameInput = document.createElement('input');
                childNameInput.type = 'text';
                childNameInput.value = child.name;
                childNameInput.className = 'element-input';
    
                // Update the child name in selectedElementArray when the input value changes
                childNameInput.addEventListener('input', (e) => {
                    elements[index].childs[childIndex].name = e.target.value;
                });
                
                childLi.appendChild(childNameInput);
                childrenList.appendChild(childLi);
            });
            
            li.appendChild(parentNameInput);
            li.appendChild(childrenList);
            container.appendChild(li);
        });
    }
    
    
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
