// Middle Display Panels Animation - Quicksort 
document.addEventListener("DOMContentLoaded", () => {
    const graphCanvas = document.getElementById('graphCanvas');
    const boxListCanvas = document.getElementById('boxListCanvas');
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");
    const progressFill = document.getElementById("progressFill");
    const stepLog = document.getElementById("stepLog");

    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;

    const graphCtx = graphCanvas.getContext('2d');
    const boxListCtx = boxListCanvas.getContext('2d');

    let originalData = [50, 150, 100, 200, -80, 60, 100, -200, -150, 200, 175, -125, -20, 20, 30, -40, 70, 120, -200];
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

    playButton.addEventListener("click", playAnimation);
    pauseButton.addEventListener("click", pauseAnimation);
    rightArrow.addEventListener("click", stepForward);
    leftArrow.addEventListener("click", stepBackward);

    async function startQuickSort() {
        frames = [];
        currentFrame = 0;
        data = [...originalData];
        await quickSort(data, 0, data.length - 1);
        drawFrame(frames[currentFrame]);
    }

    window.startQuicksort = startQuickSort;
});
