// Middle Display Panels Animation - Quicksort 
window.loadQuicksort = function () {
    const randListSize = document.getElementById('randListSize');
    const sizeWarningMessage = document.getElementById('sizeWarningMessage');
    const randomizeButton = document.getElementById('randomizeButton');
    const inputElement = document.getElementById('customInput');
    const customInputToggle = document.getElementById('customInputToggle');
    const inputWarningMessage = document.getElementById('inputWarningMessage');
    const progressFill = document.getElementById("progressFill");
    const graphCanvas = document.getElementById('graphCanvas');
    const boxListCanvas = document.getElementById('boxListCanvas');
    const stepLog = document.getElementById("stepLog");

    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;

    const graphCtx = graphCanvas.getContext('2d');
    const boxListCtx = boxListCanvas.getContext('2d');

    let randomDataSize = 0;
    let defaultData = [50, 150, 100, 200, -80, 60, 100, -200, -150, 200, 175, -125, -20, 20, 30, -40, 70, 120, -200, -90];
    let currentData = [...defaultData];
    let data = [...currentData];
    let frames = [];
    let currentFrame = 0;
    let isPlaying = false;
    let currentIndex = -1;
    let pivotIndex = -1;
    let swapIndices = [];

    const VERTICAL_PADDING = 30; // Spacing from top and bottom

    function drawFrame(frame) {
        if (!frame) return;
        ({ data, currentIndex, pivotIndex, swapIndices } = frame);
        drawData();
        updateProgressBar();
        updateStepLog();
    }

    function drawData() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        boxListCtx.clearRect(0, 0, boxListCanvas.width, boxListCanvas.height);
        drawGraphVisualization();
        drawBoxListVisualization();
    }

    function drawGraphVisualization() {
        const barWidth = graphCanvas.width / data.length;
        const fontSize = Math.min(24, Math.max(12, barWidth * 0.3));
        graphCtx.font = `${fontSize}px Arial`;
        graphCtx.textAlign = 'center';
        graphCtx.textBaseline = 'middle';

        const maxAbsValue = Math.max(...data.map(Math.abs));
        const centerY = graphCanvas.height / 2;
        const graphHeight = graphCanvas.height - VERTICAL_PADDING * 2;

        for (let i = 0; i < data.length; i++) {
            const value = data[i];
            const barHeight = (value / maxAbsValue) * (graphHeight / 2);
            const x = i * barWidth;
            const y = barHeight >= 0 ? centerY - barHeight : centerY;

            graphCtx.fillStyle = getColor(i);
            graphCtx.fillRect(x, y, barWidth, Math.abs(barHeight));

            // Draw bar outline (skip bottom edge)
            graphCtx.strokeStyle = 'black';
            graphCtx.beginPath();
            graphCtx.moveTo(x, y);
            graphCtx.lineTo(x + barWidth, y);
            graphCtx.lineTo(x + barWidth, y + Math.abs(barHeight));
            graphCtx.lineTo(x, y + Math.abs(barHeight));
            graphCtx.closePath();
            graphCtx.stroke();

            // Draw number slightly outside the bar (with buffer)
            graphCtx.fillStyle = 'black';
            const numberOffset = fontSize * 0.6; // Extra buffer for clarity
            const numberY = barHeight >= 0 ? y - numberOffset : y + Math.abs(barHeight) + numberOffset;
            graphCtx.fillText(value, x + barWidth / 2, numberY);
        }
    }

    function drawBoxListVisualization() {
        const numBoxes = data.length;
        const boxSize = Math.min(boxListCanvas.width / numBoxes, boxListCanvas.height);
        const totalWidth = numBoxes * boxSize;
        const startX = (boxListCanvas.width - totalWidth) / 2;
        const y = (boxListCanvas.height - boxSize) / 2;

        const fontSize = Math.max(12, boxSize * 0.3);
        boxListCtx.font = `${fontSize}px Arial`;
        boxListCtx.textAlign = 'center';
        boxListCtx.textBaseline = 'middle';

        for (let i = 0; i < numBoxes; i++) {
            const x = startX + i * boxSize;
            boxListCtx.fillStyle = getColor(i);
            boxListCtx.fillRect(x, y, boxSize, boxSize);
            boxListCtx.strokeStyle = 'black';
            boxListCtx.strokeRect(x, y, boxSize, boxSize); // Full border

            // Centered text
            boxListCtx.fillStyle = 'black';
            boxListCtx.fillText(data[i], x + boxSize / 2, y + boxSize / 2);
        }
    }

    function getColor(index) {
        if (swapIndices.includes(index)) return 'red';
        if (index === currentIndex || index === pivotIndex) return 'blue';
        return 'lightblue';
    }

    async function quickSort(arr, left, right) {
        if (left < right) {
            let partitionIndex = await partition(arr, left, right);
            await quickSort(arr, left, partitionIndex - 1);
            await quickSort(arr, partitionIndex + 1, right);
        }
    }

    async function partition(arr, left, right) {
        let pivot = arr[right];
        pivotIndex = right;
        appendToExplanation(`Choosing pivot: ${pivot}`);
        let i = left - 1;
        for (let j = left; j < right; j++) {
            currentIndex = j;
            recordFrame();
            if (arr[j] < pivot) {
                i++;
                swapIndices = [i, j];
                [arr[i], arr[j]] = [arr[j], arr[i]];
                appendToExplanation(`Swapped ${arr[i]} and ${arr[j]}`);
                swapIndices = [];
            }
        }
        swapIndices = [i + 1, right];
        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        appendToExplanation(`Swapped ${arr[i + 1]} and ${arr[right]} (pivot to correct position)`);
        swapIndices = [];
        return i + 1;
    }

    function recordFrame(explanation = "") {
        frames.push(JSON.parse(JSON.stringify({
            data: [...data],
            currentIndex,
            pivotIndex,
            swapIndices: [...swapIndices],
            explanation
        })));
    }

    function appendToExplanation(text) {
        recordFrame(text);
    }

    function updateProgressBar() {
        const progress = (currentFrame / (frames.length - 1)) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function updateStepLog() {
        stepLog.innerHTML = ""; // Reset log
        stepLog.innerHTML += `Initial List: ${currentData.join(", ")}<br>`; // Initial list

        for (let i = 1; i <= currentFrame; i++) {
            if (frames[i].explanation) {
                stepLog.innerHTML += frames[i].explanation + "<br>";
            }
        }

        if (currentFrame === frames.length - 1) {
            stepLog.innerHTML += `Sorted List: ${data.join(", ")}`; // Final list
        }

        stepLog.scrollTop = stepLog.scrollHeight;
    }

    function playAnimation() {
        if (isPlaying) return;
        isPlaying = true;
        function step() {
            if (!isPlaying || currentFrame >= frames.length - 1) {
                isPlaying = false;
                return;
            }
            currentFrame++;
            drawFrame(frames[currentFrame]);
            setTimeout(step, 100);
        }
        step();
    }

    function pauseAnimation() {
        isPlaying = false;
    }

    function stepForward() {
        if (currentFrame < frames.length - 1) {
            currentFrame++;
            drawFrame(frames[currentFrame]);
        }
    }

    function stepBackward() {
        if (currentFrame > 0) {
            currentFrame--;
            drawFrame(frames[currentFrame]);
        }
    }

    async function loadAnimation() {
        frames = [];
        currentFrame = 0;
        data = [...currentData];

        // First frame: initial array, no highlights
        frames.push({
            data: [...data],
            currentIndex: -1,
            pivotIndex: -1,
            swapIndices: [],
            explanation: ""
        });

        // Middle frames: has highlights
        await quickSort(data, 0, data.length - 1);

        // Last frame: final sorted array, no highlights
        frames.push({
            data: [...data],
            currentIndex: -1,
            pivotIndex: -1,
            swapIndices: [],
            explanation: ""
        });

        drawFrame(frames[currentFrame]);
    }

    function loadControlBar() {
        randListSize.disabled = false;
        randomizeButton.disabled = false;
        inputElement.placeholder = "Enter a list of integers (ex. 184 -23 14 -75 198)";
        inputElement.disabled = false;
        customInputToggle.disabled = false;
    }

    function resetAnimation() {
        pauseAnimation();
        currentFrame = 0;
        drawFrame(frames[currentFrame]);
    }

    function randomizeInput() {
        if (!randListSize.value) {
            sizeWarningMessage.textContent = "Error: Enter an integer";
            sizeWarningMessage.style.color = "red";
        }
        else {
            let inputList = randListSize.value.trim().split(/\s+/);
            inputList = inputList.map(Number);
            if (checkRandomizeInput(inputList)) {
                pauseAnimation();
                randomDataSize = inputList;
                defaultData = new Array(randomDataSize);
                for (let i = 0; i < randomDataSize; i++) {
                    if (Math.random() > 0.5) {
                        defaultData[i] = Math.round(Math.random() * 200)
                    }
                    else {
                        defaultData[i] = Math.round(Math.random() * -200); 
                    }
                }
                currentData = [...defaultData];
                loadAnimation();
            }
        }
    }

    function checkRandomizeInput(inputList) {
        if (inputList == "") {
            sizeWarningMessage.textContent = "Error: Enter an integer";
            sizeWarningMessage.style.color = "red";
            return false;
        }
        if (!isWholeNumbers(inputList)) {
            sizeWarningMessage.textContent = "Error: Enter integers only";
            sizeWarningMessage.style.color = "red";
            return false;
        }
        if (inputList.length > 1) {
            sizeWarningMessage.textContent = "Error: Enter only 1 integer";
            sizeWarningMessage.style.color = "red";
            return false;
        }
        if (inputList[0] < 2 || inputList[0] > 20) {
            sizeWarningMessage.textContent = "Error: Enter an integer between 2-20";
            sizeWarningMessage.style.color = "red";
            return false;
        }
        sizeWarningMessage.textContent = "---";
        sizeWarningMessage.style.color = "#f4f4f4";
        return true;
    }

    function toggleCustomInput() {
        if (customInputToggle.checked) {  
            if (!inputElement.value) {
                inputWarningMessage.textContent = "Invalid Input: Enter an input";
                inputWarningMessage.style.color = "red";
                customInputToggle.checked = false;
            }
            else {
                let inputList = inputElement.value.trim().split(/\s+/);
                inputList = inputList.map(Number);
                if (checkCustomInput(inputList)) {
                    randListSize.disabled = true;
                    randomizeButton.disabled = true;
                    inputElement.disabled = true;
                    pauseAnimation();
                    currentData = inputList;
                    loadAnimation();
                }
                else {
                    customInputToggle.checked = false;
                }
            }
        }
        else {
            pauseAnimation();
            currentData = [...defaultData];
            loadAnimation();
            randListSize.disabled = false;
            randomizeButton.disabled = false;
            inputElement.disabled = false;
        }
    }

    // Returns true if all the elements in the given list are whole numbers, else it returns false
    function isWholeNumbers(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] == NaN || !Number.isInteger(list[i])) {
              return false;
            }
        }
        return true;     
    }
    
    function isWhitespace(str) {
        const regex = /^\s*$/;
        return regex.test(str);
    }

    function checkInputValues(inputList) {
        for (let i = 0; i < inputList.length; i++) {
            if (inputList[i] > 200 || inputList[i] < -200)
            {
                return false;
            }
        }
        return true;
    }

    function checkCustomInput(inputList) {
        if (inputList == "") {
            inputWarningMessage.textContent = "Invalid Input: Enter an input";
            inputWarningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length > 20 && isWholeNumbers(inputList)) {
            inputWarningMessage.textContent = "Invalid Input: Only accepts integers and max 20 total values";
            inputWarningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length < 2 && !isWholeNumbers(inputList)) {
            inputWarningMessage.textContent = "Invalid Input: Only accepts integers and a minimum of 2 values";
            inputWarningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length > 20) {
            inputWarningMessage.textContent = "Invalid Input: Only accepts a maximum of 20 values";
            inputWarningMessage.style.color = "red";
            return false;
        }
        else if (!isWholeNumbers(inputList)) {
            inputWarningMessage.textContent = "Invalid Input: Only accepts integers";
            inputWarningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length < 2) {
            inputWarningMessage.textContent = "Invalid Input: Only accepts a minimum of 2 values";
            inputWarningMessage.style.color = "red";
            return false;
        }
        else {
            if (checkInputValues(inputList)) {
                inputWarningMessage.style.color = "#f4f4f4";
                return true;
            }
            else {
                inputWarningMessage.textContent = "Invalid Input: Only accepts integers between -200 and 200";
                inputWarningMessage.style.color = "red";
                return false;
            }
        }
    }

    window.activeController = new AnimationController(loadAnimation, loadControlBar, playAnimation, pauseAnimation, stepForward, stepBackward, 
        resetAnimation, randomizeInput, toggleCustomInput);
    
};