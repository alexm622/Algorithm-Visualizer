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
    const bucketSortCtx = bucketSortCanvas.getContext('2d');

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
    
        // Ensure frame.buckets is defined
        if (!frame.buckets) {
            console.error("Buckets are undefined in the current frame.");
            return;
        }
    
        drawData();
        drawBucketSortVisualization(frame.buckets); // Pass the current frame's buckets
        updateProgressBar();
        updateStepLog();
    }

    // Corrected typo: Changed 'buckerSortCtx' to 'bucketSortCtx'
    function drawData() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        bucketSortCtx.clearRect(0, 0, bucketSortCanvas.width, bucketSortCanvas.height); // Fixed typo here
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

    function drawBucketSortVisualization(frameBuckets) {
        if (!frameBuckets || frameBuckets.length === 0) {
            console.error("Invalid frameBuckets passed to drawBucketSortVisualization.");
            return;
        }
    
        const numBuckets = frameBuckets.length;
        const spacing = 20; // Add spacing between buckets
        const totalSpacing = (numBuckets - 1) * spacing; // Total spacing between buckets
        const bucketWidth = Math.min((bucketSortCanvas.width - totalSpacing) / numBuckets, 150); // Adjust bucket width
        const boxHeight = Math.min(bucketSortCanvas.height * 0.1, 50); // Adjust box height
        const fontSize = Math.max(12, bucketWidth * 0.15);
        bucketSortCtx.font = `${fontSize}px Arial`;
        bucketSortCtx.textAlign = 'center';
        bucketSortCtx.textBaseline = 'middle';
    
        // Adjust the starting Y position to shift everything down
        const startY = bucketSortCanvas.height * 0.2; // Start drawing boxes further down (20% from the top)
        let currentX = (bucketSortCanvas.width - (numBuckets * bucketWidth + totalSpacing)) / 2; // Center the buckets horizontally
    
        // Draw the buckets and their contents
        for (let i = 0; i < numBuckets; i++) {
            const bucket = frameBuckets[i];
    
            // Label the partition with the bucket number
            bucketSortCtx.fillStyle = 'black';
            bucketSortCtx.fillText(i, currentX + bucketWidth / 2, startY - fontSize * 1.5); // Label above the partition
    
            // Draw dividing line between buckets
            if (i > 0) {
                bucketSortCtx.strokeStyle = 'black';
                bucketSortCtx.lineWidth = 2;
                bucketSortCtx.beginPath();
                bucketSortCtx.moveTo(currentX - spacing / 2, startY);
                bucketSortCtx.lineTo(currentX - spacing / 2, bucketSortCanvas.height);
                bucketSortCtx.stroke();
            }
    
            // Draw the individual boxes in the bucket
            bucket.forEach((value, index) => {
                const boxX = currentX; // Align boxes horizontally
                const boxY = startY + index * (boxHeight + 10); // Stack boxes vertically with spacing
    
                // Ensure boxes fit within the canvas height
                if (boxY + boxHeight > bucketSortCanvas.height) {
                    console.warn(`Bucket ${i} has too many entries to fit.`);
                    return;
                }
    
                bucketSortCtx.fillStyle = 'white'; // Box background
                bucketSortCtx.fillRect(boxX, boxY, bucketWidth, boxHeight); // Draw box
                bucketSortCtx.strokeStyle = 'black';
                bucketSortCtx.strokeRect(boxX, boxY, bucketWidth, boxHeight); // Box border
    
                // Draw text inside the box
                bucketSortCtx.fillStyle = 'black';
                bucketSortCtx.fillText(value, boxX + bucketWidth / 2, boxY + boxHeight / 2); // Center text in the box
            });
    
            currentX += bucketWidth + spacing; // Add spacing between buckets
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
        const bucketCount = Math.floor((max - min) / arr.length) + 1;
    
        const buckets = Array.from({ length: bucketCount }, () => []);
        recordFrame("Initialized empty buckets", buckets);
    
        for (let i = 0; i < arr.length; i++) {
            const index = Math.floor((arr[i] - min) / arr.length);
            buckets[index].push(arr[i]);
            recordFrame(`Placed ${arr[i]} in bucket ${index}`, buckets);
        }
    
        for (let i = 0; i < buckets.length; i++) {
            await insertionSort(buckets[i], `Sorting bucket ${i}`);
            recordFrame(`Sorted bucket ${i}`, buckets);
        }
    
        let index = 0;
        for (let i = 0; i < buckets.length; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index++] = buckets[i][j];
                recordFrame(`Placed ${buckets[i][j]} in position ${index - 1}`, buckets);
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

    function recordFrame(explanation = "", buckets = []) {
        frames.push(JSON.parse(JSON.stringify({
            data: [...data],  // Current data array
            currentIndex,
            pivotIndex,
            swapIndices: [...swapIndices],
            buckets: buckets ? buckets.map(bucket => [...bucket]) : [], // Deep copy of buckets
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
        await bucketSort(data);
    
        // Last frame: final sorted array, no highlights
        frames.push({
            data: [...data],
            currentIndex: -1,
            pivotIndex: -1,
            swapIndices: [],
            explanation: ""
        });
    
        drawFrame(frames[currentFrame]); // Draw the first frame
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