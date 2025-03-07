document.addEventListener("DOMContentLoaded", () => {

    const graphCanvas = document.getElementById('graphCanvas');
    const boxListCanvas = document.getElementById('boxListCanvas');

    // Set the canvas width and height to match its parent element's dimensions
    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;

    // Get the 2D rendering context of the canvas
    const graphCtx = graphCanvas.getContext('2d');
    const boxListCtx = boxListCanvas.getContext('2d');

    let drawInterval;
    let data = [50, 150, 100, 200, 80];
    let currentIndex = -1;
    let pivotIndex = -1;
    let swapIndices = [];

    // Flag to indicate whether sorting is in progress
    let isSorting = false;

    function drawData() {
        // Clear canvases
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        boxListCtx.clearRect(0, 0, boxListCanvas.width, boxListCanvas.height);

        drawGraphVisualization();
        drawBoxListVisualization();
    }

     // Draw graph visual
    function drawGraphVisualization() {
        const barWidth = graphCanvas.width / data.length;
        for (let i = 0; i < data.length; i++) {
            // Gather rectangle dimensions
            const barHeight = data[i];
            const x = i * barWidth;
            const y = graphCanvas.height - barHeight;

            // Draw each rectangle
            graphCtx.fillStyle = getColor(i);
            graphCtx.fillRect(x, y, barWidth, barHeight);
            graphCtx.fillStyle = 'black';
            graphCtx.font = '14px Arial';
            graphCtx.textAlign = 'center';
            graphCtx.fillText(data[i], x + barWidth / 2, graphCanvas.height - 10);
        }
    }

    // Draw box-list visual
    function drawBoxListVisualization() {
        const numBoxes = data.length;
        const boxSize = Math.min(boxListCanvas.width / numBoxes, boxListCanvas.height); // Ensure square shape
        const totalWidth = numBoxes * boxSize; // Total width of the box-list
        const startX = (boxListCanvas.width - totalWidth) / 2; // Center box-list horizontally
        const y = (boxListCanvas.height - boxSize) / 2; // Center box-list vertically
    
        // Draw outer border
        boxListCtx.strokeStyle = 'grey';
        boxListCtx.lineWidth = 3;
        boxListCtx.strokeRect(startX, y, totalWidth, boxSize);
    
        for (let i = 0; i < numBoxes; i++) {
            const x = startX + i * boxSize;
    
            // Draw each square
            boxListCtx.fillStyle = getColor(i);
            boxListCtx.fillRect(x, y, boxSize, boxSize);

            // Draw separator lines between boxes
            if (i > 0) {
                boxListCtx.strokeStyle = 'grey';
                boxListCtx.lineWidth = 2;
                boxListCtx.beginPath();
                boxListCtx.moveTo(x, y);
                boxListCtx.lineTo(x, y + boxSize);
                boxListCtx.stroke();
            }
    
            // Center text
            boxListCtx.fillStyle = 'black';
            boxListCtx.font = `${boxSize / 3}px Arial`; // Adjust font size relative to box
            boxListCtx.textAlign = 'center';
            boxListCtx.textBaseline = 'middle';
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
        await delay(1000);
        let i = left - 1;
        for (let j = left; j < right; j++) {
            currentIndex = j;
            await delay(1000);
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

    async function startQuickSort() {
        if (isSorting) return;
        drawData();
        startDrawing();
        isSorting = true;
        await quickSort(data, 0, data.length - 1);
        appendToExplanation("Sorting complete!");
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

    window.startQuicksort = startQuickSort;
    window.stopDrawingQuicksort = stopDrawing;
});
