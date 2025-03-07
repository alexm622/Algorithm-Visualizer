// Middle Display Panels Animation - Quicksort
document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById('graphCanvas');

    // Set the canvas width and height to match its parent element's dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Get the 2D rendering context of the canvas
    const ctx = canvas.getContext('2d');

    let drawInterval;
    let data = [50, 150, 100, 200, 80];
    let currentIndex = -1;
    let pivotIndex = -1;
    let swapIndices = [];

    // Initialize a flag to indicate whether sorting is in progress
    let isSorting = false;

    // Function to draw the data as bars on the canvas
    function drawData() {

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        const barWidth = canvas.width / data.length;
        const padding = 30;

        // Loop through the data array and draw each bar
        for (let i = 0; i < data.length; i++) {

            // Calculate the height of the bar based on the data value
            const barHeight = data[i];

            // Calculate the x and y coordinates of the bar
            const x = i * barWidth;
            const y = canvas.height - barHeight;

            // Set the fill color of the bar based on its state
            if (swapIndices.includes(i)) {
                ctx.fillStyle = 'red';
            } else if (i === currentIndex || i === pivotIndex) {
                ctx.fillStyle = 'blue';
            } else {
                ctx.fillStyle = 'lightblue';
            }
            
            // Redraw each bar
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data[i], x + barWidth / 2, canvas.height - 10);
        }     
    }

    async function quickSort(arr, left, right) {

        // If left index is less than right index, continue sorting
        if (left < right) {

            // Get the partition index
            let partitionIndex = await partition(arr, left, right);

            // Recursively sort the left and right subarrays
            await quickSort(arr, left, partitionIndex - 1);
            await quickSort(arr, partitionIndex + 1, right);
        }
    }

    async function partition(arr, left, right) {

        // Chose the rightmost element as the pivot
        let pivot = arr[right];
        pivotIndex = right;

        await delay(1000);

        let i = left - 1;

        // Loop through the array from left to right
        for (let j = left; j < right; j++) {
            currentIndex = j;
            await delay(1000);

            // If the current element is less than the pivot
            if (arr[j] < pivot) {
                i++;
                swapIndices = [i, j];
                [arr[i], arr[j]] = [arr[j], arr[i]];
                await delay(1000);
                appendToExplanation(`Swapped ${arr[j]} and ${arr[i]}`);
            }
            swapIndices = [];
        }
        swapIndices = [i + 1, right];
        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        appendToExplanation(`Swapped ${arr[right]} and ${arr[i+1]}`);
        await delay(1000);
        currentIndex = -1;
        pivotIndex = -1;
        return i + 1;
    }

    // Function to start quicksort
    async function startQuickSort() {
        if (isSorting) return;

        // Draw initial state
        drawData();

        // Start bar-drawing loop
        startDrawing();
        
        isSorting = true;

        // Start the quicksort algorithm
        await quickSort(data, 0, data.length - 1);
        appendToExplanation("Sorting complete!");

        // Stop drawing bars
        stopDrawing();

        isSorting = false;
    }

    function startDrawing() {
        drawInterval = setInterval(drawData, 500); 
    }

    function stopDrawing() {
        clearInterval(drawInterval);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function appendToExplanation(text) {
        let box = document.getElementById("stepLog");
        box.innerHTML += text + "<br>";  
        box.scrollTop = box.scrollHeight;
    }

    // Expose functions for external triggering
    window.startQuicksort = startQuickSort;
    window.stopDrawingQuicksort = stopDrawing;
});


document.addEventListener("DOMContentLoaded", () => {
    const graphCanvas = document.getElementById('graphCanvas');
    const boxListCanvas = document.getElementById('boxListCanvas');
    
    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;
    
    const graphCtx = graphCanvas.getContext('2d');
    const boxListCtx = boxListCanvas.getContext('2d');
    
    let data = [7, 9, 5, 5, 5, 9, 9, 9, 5, 2, 9, 1, 9, 4, 3];
    let steps = [];
    let currentStep = 0;
    let isPlaying = false;
    let animationInterval;

    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");
    const progressFill = document.getElementById("progressFill");

    function drawData() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        boxListCtx.clearRect(0, 0, boxListCanvas.width, boxListCanvas.height);
        
        const barWidth = graphCanvas.width / data.length;
        const boxWidth = boxListCanvas.width / data.length;
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = data[i] * 10;
            const x = i * barWidth;
            const y = graphCanvas.height - barHeight;
            
            graphCtx.fillStyle = "lightblue";
            graphCtx.fillRect(x, y, barWidth, barHeight);
            graphCtx.fillStyle = "black";
            graphCtx.fillText(data[i], x + barWidth / 2, graphCanvas.height - 5);
            
            boxListCtx.fillStyle = "lightblue";
            boxListCtx.fillRect(x, 10, boxWidth - 5, 40);
            boxListCtx.fillStyle = "black";
            boxListCtx.fillText(data[i], x + boxWidth / 2, 35);
        }
    }

    function quickSort() {
        steps = [];
        function partition(arr, left, right) {
            let pivot = arr[right];
            let i = left - 1;
            for (let j = left; j < right; j++) {
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    steps.push([...arr]);
                }
            }
            [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
            steps.push([...arr]);
            return i + 1;
        }

        function sort(arr, left, right) {
            if (left < right) {
                let partitionIndex = partition(arr, left, right);
                sort(arr, left, partitionIndex - 1);
                sort(arr, partitionIndex + 1, right);
            }
        }
        let arrCopy = [...data];
        sort(arrCopy, 0, arrCopy.length - 1);
    }

    function updateFrame(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        data = steps[stepIndex];
        drawData();
        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = (currentStep / (steps.length - 1)) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function playAnimation() {
        if (isPlaying) return;
        isPlaying = true;
        animationInterval = setInterval(() => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateFrame(currentStep);
            } else {
                pauseAnimation();
            }
        }, 500);
    }

    function pauseAnimation() {
        isPlaying = false;
        clearInterval(animationInterval);
    }

    function stepForward() {
        if (!isPlaying && currentStep < steps.length - 1) {
            currentStep++;
            updateFrame(currentStep);
        }
    }

    function stepBackward() {
        if (!isPlaying && currentStep > 0) {
            currentStep--;
            updateFrame(currentStep);
        }
    }

    playButton.addEventListener("click", playAnimation);
    pauseButton.addEventListener("click", pauseAnimation);
    rightArrow.addEventListener("click", stepForward);
    leftArrow.addEventListener("click", stepBackward);
    
    window.loadQuicksort = function() {
        quickSort();
        currentStep = 0;
        updateFrame(currentStep);
    };
});
