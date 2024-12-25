(function () {
    const doc = document;
    const start = doc.getElementById("start");
    const stop = doc.getElementById("stop");
    let originalTextsStore = null;
    let replacementState;

    start.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: replaceLetters
            });
        });
    });

    stop.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: restoreText
            });
        });
    });

    function replaceLetters() {
        const originalTexts = new Map();
        replacementState = true;

        function getRandomDigit() {
            return Math.floor(Math.random() * 9) + 1;
        }

        function replaceTextContent(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (!originalTexts.has(node)) {
                    originalTexts.set(node, node.textContent);
                    originalTextsStore = originalTexts;
                }
                node.textContent = node.textContent.replace(/a/gi, getRandomDigit);
            } else {
                for (const child of node.childNodes) {
                    replaceTextContent(child);
                }
            }
        }

        if (replacementState) {
            replaceTextContent(document.body);
        }
    }

    function restoreText() {
        if (originalTextsStore) {
            for (const [node, text] of originalTextsStore.entries()) {
                node.textContent = text;
            }
            originalTextsStore = null;
            replacementState = false;
        }
    }
})();