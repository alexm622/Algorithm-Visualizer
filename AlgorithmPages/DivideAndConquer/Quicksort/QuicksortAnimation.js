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