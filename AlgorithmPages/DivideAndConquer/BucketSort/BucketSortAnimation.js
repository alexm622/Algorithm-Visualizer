// Middle Display Panels Animation - BucketSort 
window.loadBucketSort = function () {
    console.log("loading bucket sort")
    const randListSize = document.getElementById('randListSize');
    const sizeWarningMessage = document.getElementById('sizeWarningMessage');
    const randomizeButton = document.getElementById('randomizeButton');
    const inputElement = document.getElementById('customInput');
    const customInputToggle = document.getElementById('customInputToggle');
    const inputWarningMessage = document.getElementById('inputWarningMessage');
    const progressFill = document.getElementById("progressFill");
    const graphCanvas = document.getElementById('graphCanvas');
    const bucketSortCanvas = document.getElementById('boxListCanvas');
    const stepLog = document.getElementById("stepLog");
    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    bucketSortCanvas.width = bucketSortCanvas.parentElement.clientWidth;
    bucketSortCanvas.height = bucketSortCanvas.parentElement.clientHeight;

    const graphCtx = graphCanvas.getContext('2d');
    const buckerSortCtx = bucketSortCanvas.getContext('2d');

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
        buckerSortCtx.clearRect(0, 0, bucketSortCanvas.width, bucketSortCanvas.height);
        drawGraphVisualization();
        drawBucketSortVisualization();
    }

    function drawGraphVisualization() {
        console.log("trying to draw graph")
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

    function drawBucketSortVisualization() {
        const numBuckets = 5; // You can adjust this based on your needs
        const numBoxes = data.length;
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const bucketSize = (maxValue - minValue) / numBuckets;
    
        // Create empty buckets
        const buckets = Array.from({ length: numBuckets }, () => []);
    
        // Sort the data into buckets
        for (let i = 0; i < numBoxes; i++) {
            const bucketIndex = Math.floor((data[i] - minValue) / bucketSize);
            if (bucketIndex === numBuckets) {
                // Ensure max value goes into the last bucket
                buckets[bucketIndex - 1].push(data[i]);
            } else {
                buckets[bucketIndex].push(data[i]);
            }
        }
    
        // Sort the contents of each bucket
        buckets.forEach(bucket => bucket.sort((a, b) => a - b));
    
        // Visualization parameters
        const boxSize = Math.min(bucketSortCanvas.width / numBuckets, bucketSortCanvas.height);
        const fontSize = Math.max(12, boxSize * 0.3);
        buckerSortCtx.font = `${fontSize}px Arial`;
        buckerSortCtx.textAlign = 'center';
        buckerSortCtx.textBaseline = 'middle';
    
        let currentX = (bucketSortCanvas.width - (numBuckets * boxSize)) / 2; // Center the buckets horizontally
        const y = (bucketSortCanvas.height - boxSize) / 2; // Center vertically
    
        // Draw the buckets and their contents
        for (let i = 0; i < numBuckets; i++) {
            const bucket = buckets[i];
            const bucketWidth = boxSize * bucket.length;
    
            buckerSortCtx.fillStyle = getColor(i);
            buckerSortCtx.fillRect(currentX, y, bucketWidth, boxSize); // Draw the bucket area
            buckerSortCtx.strokeStyle = 'black';
            buckerSortCtx.strokeRect(currentX, y, bucketWidth, boxSize); // Draw bucket border
    
            // Draw the individual boxes inside the bucket
            bucket.forEach((value, index) => {
                const boxX = currentX + index * boxSize;
                buckerSortCtx.fillStyle = getColor(i); // Use the same color for all boxes in this bucket
                buckerSortCtx.fillRect(boxX, y, boxSize, boxSize); // Draw box
                buckerSortCtx.strokeStyle = 'black';
                buckerSortCtx.strokeRect(boxX, y, boxSize, boxSize); // Box border
    
                // Draw text inside the box
                buckerSortCtx.fillStyle = 'black';
                buckerSortCtx.fillText(value, boxX + boxSize / 2, y + boxSize / 2); // Center text in the box
            });
    
            currentX += bucketWidth; // Move to the next bucket position
        }
    }

    function getColor(index) {
        if (swapIndices.includes(index)) return 'red';
        if (index === currentIndex || index === pivotIndex) return 'blue';
        return 'lightblue';
    }

    async function bucketSort(arr) {
        const max = Math.max(...arr);
        const min = Math.min(...arr);
        const bucketCount = Math.floor((max - min) / arr.length) + 1; // Number of buckets

        // Step 1: Create empty buckets
        const buckets = Array.from({ length: bucketCount }, () => []);

        // Step 2: Distribute elements into buckets
        for (let i = 0; i < arr.length; i++) {
            const index = Math.floor((arr[i] - min) / arr.length);
            buckets[index].push(arr[i]);
            appendToExplanation(`Placed ${arr[i]} in bucket ${index}`);
        }

        // Step 3: Sort each bucket (using Insertion Sort for simplicity)
        for (let i = 0; i < buckets.length; i++) {
            await insertionSort(buckets[i], `Sorting bucket ${i}`);
        }

        // Step 4: Concatenate all sorted buckets into the original array
        let index = 0;
        for (let i = 0; i < buckets.length; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index++] = buckets[i][j];
                appendToExplanation(`Placed ${buckets[i][j]} in position ${index - 1}`);
            }
        }
    }

    async function insertionSort(arr, bucketExplanation) {
        for (let i = 1; i < arr.length; i++) {
            const key = arr[i];
            let j = i - 1;

            // Move elements of arr[0..i-1] that are greater than key to one position ahead of their current position
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                appendToExplanation(`${arr[j]} shifted to the right in bucket`);
                j = j - 1;
            }
            arr[j + 1] = key;
            appendToExplanation(`${key} inserted in the correct position in bucket`);
        }
    }

    function recordFrame(explanation = "") {
        frames.push(JSON.parse(JSON.stringify({
            data: [...data],  // Assuming `data` is the array you are sorting
            currentIndex,
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
        await bucketSort(data, 0, data.length - 1);

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
            if (inputList[i] > 200 || inputList[i] < -200) {
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