// Middle Display Panels Animation - Quicksort 
document.addEventListener("DOMContentLoaded", () => {
    const graphCanvas = document.getElementById('graphCanvas');
    const boxListCanvas = document.getElementById('boxListCanvas');
    let listSize = document.getElementById("listSize");
    let randomizeButton = document.getElementById("randomizeButton");
    let customInput = document.getElementById("customInput");
    let warningMessage = document.getElementById("inputWarningMessage");
    let inputToggle = document.getElementById("customInputToggle");
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const resetButton = document.getElementById("resetButton");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");
    let progressFill = document.getElementById("progressFill");
    let speedSlider = document.getElementById("speedSlider")
    const stepLog = document.getElementById("stepLog");

    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;

    const graphCtx = graphCanvas.getContext('2d');
    const boxListCtx = boxListCanvas.getContext('2d');

    let originalData = getRandomArray(getRandomNumber(), 99);
    let data = [...originalData];
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
        const fontSize = Math.max(12, barWidth * 0.3);
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
        stepLog.innerHTML += `Initial List: ${originalData.join(", ")}<br>`; // Initial list

        for (let i = 0; i <= currentFrame; i++) {
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
            setTimeout(step, 200);
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

    function getRandomArray(length, max) {
        return Array.from({ length }, () => Math.floor(Math.random() * max));
    }

    function getRandomNumber(){
        return Math.floor(Math.random() * (20 - 2 + 1)) + 2;
    }
      
    playButton.addEventListener("click", playAnimation);
    pauseButton.addEventListener("click", pauseAnimation);
    rightArrow.addEventListener("click", stepForward);
    leftArrow.addEventListener("click", stepBackward);


    function setupQuicksort(){
    
        listSize.min = 2;
        listSize.max = 20;
        customInput.placeholder = "Enter 2-20 integers (value -99-99) separated by spaces";

        listSize.addEventListener('input', function(event) {
            console.log("oh gosh");
            listSize = event.target.value; 
            randomizeButton.disabled = false;
        });

        /*
        
        randomizeButton.addEventListener('click', function(event) {
            createRandomInput(listSize);
        });
        */
        
        inputToggle.addEventListener('change', function()  {
            console.log("this");
            if (this.checked) 
            {    
                if (!customInput.value) {
                    warningMessage.textContent = "Invalid Input: Enter an input";
                    warningMessage.style.color = "red";
                    warningMessage.style.display = "block";
                    customInputToggle.checked = false;
                }
                else {
                    let inputList = customInput.value.trim().split(/\s+/);
                    inputList = inputList.map(Number);
                    if (checkCustomInput(inputList, warningMessage) == true) {
                        currentInput = inputList;
                    }
                    else {
                        customInputToggle.checked = false;
                    }
                }
            }
            else {
                console.log('false');
                // Set current input equal to the default input
            }
        });
    }

    async function startQuickSort() {
        frames = [];
        currentFrame = 0;
        data = [...originalData];
        await quickSort(data, 0, data.length - 1);
        drawFrame(frames[currentFrame]);
    }

    window.startQuicksort = startQuickSort;
    window.setupQuicksort = setupQuicksort;
});

// Returns true if all the elements in the given list are whole numbers, else it returns false
function isWholeNumbers(list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] == NaN || !Number.isInteger(list[i])) {
            return false;
        }
    }
    return true;     
}

function checkInputValues(inputList) {
    for (let i = 0; i < inputList.length; i++) {
        if (inputList[i] > 99 || inputList[i] < -99)
        {
            return false;
        }
    }
    return true;
}

function checkCustomInput(inputList, warningMessage) {
    if (inputList == "") {
        warningMessage.textContent = "Invalid Input: Enter an input";
        warningMessage.style.color = "red";
        return false;
    }
    else if (inputList.length > 20 && isWholeNumbers(inputList) == false) {
        warningMessage.textContent = "Invalid Input: Only accepts integers and max 20 total values";
        warningMessage.style.color = "red";
        return false;
    }
    else if (inputList.length < 2 && isWholeNumbers(inputList) == false) {
        warningMessage.textContent = "Invalid Input: Only accepts integers and a minimum of 2 values";
        warningMessage.style.color = "red";
        return false;
    }
    else if (inputList.length > 20) {
        warningMessage.textContent = "Invalid Input: Only accepts a maximum of 20 values";
        warningMessage.style.color = "red";
        return false;
    }
    else if (isWholeNumbers(inputList) == false) {
        warningMessage.textContent = "Invalid Input: Only accepts integers";
        warningMessage.style.color = "red";
        return false;
    }
    else if (inputList.length < 2) {
        warningMessage.textContent = "Invalid Input: Only accepts a minimum of 2 values";
        warningMessage.style.color = "red";
        return false;
    }
    else {
        if (checkInputValues(inputList) == true) {
            warningMessage.style.color = "#f4f4f4";
            return true;
        }
        else {
            warningMessage.textContent = "Invalid Input: Only accepts integers between -99 and 99";
            warningMessage.style.color = "red";
            return false;
        }
    }
}

// Creates a randomized list with a length between 2-20 and values between 0-99 
function createRandomInput() {
    let listSize = Math.floor(Math.random() * 21) + 2;
    let defaultInput = new Array(listSize);
    for (let i=0; i < listSize; i++) {
        defaultInput[i] = Math.floor(Math.random() * 99);
    }
}
