// Middle Display Panels Animation - Quicksort 
window.loadPageRank = function () {
    // Get references to various DOM elements used for user input, warnings, and animation rendering
    const randListSize = document.getElementById('randListSize');
    const sizeWarningMessage = document.getElementById('sizeWarningMessage');
    const randomizeButton = document.getElementById('randomizeButton');
    const inputElement = document.getElementById('customInput');
    const customInputToggle = document.getElementById('customInputToggle');
    const inputWarningMessage = document.getElementById('inputWarningMessage');
    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const speedSlider = document.getElementById("speedSlider");
    const graphCanvas = document.getElementById('graphCanvas');
    const boxListCanvas = document.getElementById('boxListCanvas');
    const stepLog = document.getElementById("stepLog");

    // Set canvas dimensions dynamically to fit their parent containers
    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;
    console.log(graphCanvas.height);

    // Get 2D drawing contexts for rendering animations
    const graphCtx = graphCanvas.getContext('2d');
    const boxListCtx = boxListCanvas.getContext('2d');

    // Initialize data for visualization
    let defaultData = generateRandomList(Math.round(Math.random() * 10 + 10)); // Generates random list of at least size 10
    let currentData = [...defaultData];
    let data = [...currentData];
    let frames = []; // Stores animation frames for step-by-step playback
    let currentFrame = 0;
    let isPlaying = false;
    let currentIndex = -1;
    let pivotIndex = -1;
    let swapIndices = [];
    let adjacencyMatrix = [];

    const VERTICAL_PADDING = 60; // Minimum spacing of graph bars from top and bottom of container

    // Draws current animation frame based on stored frame data
    function drawFrame(frame) {
        if (!frame) return;
        ({ data, currentIndex, pivotIndex, swapIndices, adjacencyMatrix } = frame);
        drawData();
        updateProgressBar();
        updateStepLog();
    }

    // Clears and redraws both visualization canvases
    function drawData() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        boxListCtx.clearRect(0, 0, boxListCanvas.width, boxListCanvas.height);
        drawGraphVisualization();
        drawBoxListVisualization();
    }

    // Draws the node graph representation of the PageRank algorithm
    // Draws the node graph representation of the PageRank algorithm
    // Draws the node graph representation of the PageRank algorithm
    function drawGraphVisualization() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

        const nodeRadius = 20;
        const centerX = graphCanvas.width / 2;
        const centerY = graphCanvas.height / 2;
        const numNodes = data.length;
        const angleStep = (2 * Math.PI) / numNodes;

        // Calculate positions of nodes in a circular layout
        const nodePositions = data.map((_, i) => ({
            x: centerX + Math.cos(i * angleStep) * (graphCanvas.width / 3),
            y: centerY + Math.sin(i * angleStep) * (graphCanvas.height / 3),
        }));

        // Draw edges (connections between nodes)
        for (let i = 0; i < numNodes; i++) {
            for (let j = 0; j < numNodes; j++) {
                if (adjacencyMatrix[i][j] > 0) { // Check if there's a connection
                    graphCtx.beginPath();
                    graphCtx.moveTo(nodePositions[i].x, nodePositions[i].y);
                    graphCtx.lineTo(nodePositions[j].x, nodePositions[j].y);
                    graphCtx.strokeStyle = 'gray';
                    graphCtx.stroke();
                }
            }
        }

        // Draw nodes
        for (let i = 0; i < numNodes; i++) {
            const { x, y } = nodePositions[i];
            graphCtx.beginPath();
            graphCtx.arc(x, y, nodeRadius, 0, 2 * Math.PI);

            // Highlight the current node being processed in red
            if (i === currentIndex) {
                graphCtx.fillStyle = 'red';
            }
            // Highlight related nodes in yellow
            else if (adjacencyMatrix[currentIndex]?.[i] > 0 || adjacencyMatrix[i]?.[currentIndex] > 0) {
                graphCtx.fillStyle = 'yellow';
            } else {
                graphCtx.fillStyle = getColor(i);
            }

            graphCtx.fill();
            graphCtx.strokeStyle = 'black';
            graphCtx.stroke();

            // Draw node labels (PageRank values and node numbers)
            graphCtx.fillStyle = 'black';
            graphCtx.font = '14px Arial';
            graphCtx.textAlign = 'center';
            graphCtx.textBaseline = 'middle';
            graphCtx.fillText(`${i}`, x, y - 25); // Node number above the node
            graphCtx.fillText(data[i].toFixed(2), x, y); // PageRank value inside the node
        }
    }

    // Draws the adjacency matrix representation of the PageRank algorithm
    // Draws the adjacency matrix representation of the PageRank algorithm
    function drawBoxListVisualization() {
        boxListCtx.clearRect(0, 0, boxListCanvas.width, boxListCanvas.height);

        const numNodes = data.length;
        const cellSize = Math.min(boxListCanvas.width / numNodes, boxListCanvas.height / numNodes);

        // Draw matrix cells
        for (let i = 0; i < numNodes; i++) {
            for (let j = 0; j < numNodes; j++) {
                const x = j * cellSize;
                const y = i * cellSize;

                // Highlight the current cell being processed in red
                if (i === currentIndex || j === currentIndex) {
                    boxListCtx.fillStyle = 'red';
                }
                // Highlight related cells in yellow
                else if (adjacencyMatrix[currentIndex]?.[j] > 0 || adjacencyMatrix[i]?.[currentIndex] > 0) {
                    boxListCtx.fillStyle = 'yellow';
                } else {
                    boxListCtx.fillStyle = adjacencyMatrix[i][j] > 0 ? 'lightblue' : 'white';
                }

                // Draw cell background
                boxListCtx.fillRect(x, y, cellSize, cellSize);

                // Draw cell border
                boxListCtx.strokeStyle = 'black';
                boxListCtx.strokeRect(x, y, cellSize, cellSize);

                // Draw cell value
                boxListCtx.fillStyle = 'black';
                boxListCtx.font = `${Math.min(14, cellSize * 0.5)}px Arial`;
                boxListCtx.textAlign = 'center';
                boxListCtx.textBaseline = 'middle';
                boxListCtx.fillText(adjacencyMatrix[i][j].toFixed(2), x + cellSize / 2, y + cellSize / 2);
            }
        }
    }

    // Updates the PageRank values and adjacency matrix for visualization
    // Updates the PageRank values and adjacency matrix for visualization
    async function calculatePageRank() {
        const dampingFactor = 0.85;
        const numNodes = data.length;
        const tolerance = 1e-6;

        let ranks = Array(numNodes).fill(1 / numNodes);
        let newRanks = Array(numNodes).fill(0);

        let converged = false;
        while (!converged) {
            for (let i = 0; i < numNodes; i++) {
                currentIndex = i; // Highlight the current node being processed
                newRanks[i] = (1 - dampingFactor) / numNodes;
                for (let j = 0; j < numNodes; j++) {
                    if (adjacencyMatrix[j][i] > 0) {
                        const outDegree = adjacencyMatrix[j].reduce((sum, val) => sum + val, 0);
                        newRanks[i] += dampingFactor * (ranks[j] / outDegree);
                    }
                }
                recordFrame(`Updated PageRank value for node ${i}: ${newRanks[i].toFixed(2)}`);
            }

            converged = newRanks.every((rank, i) => Math.abs(rank - ranks[i]) < tolerance);
            ranks = [...newRanks];
        }

        data = ranks; // Update the data array with final PageRank values
        currentIndex = -1; // Reset currentIndex after calculation
    }


    // Records a snapshot of the current PageRank step, adds frame to animation
    function recordFrame(explanation = "") {
        frames.push({
            data: [...data], // Copy the current PageRank values
            adjacencyMatrix: JSON.parse(JSON.stringify(adjacencyMatrix)), // Deep copy of the adjacency matrix
            currentIndex, // Current node being processed (if applicable)
            explanation // Explanation of the current step
        });
    }

    // Initializes and starts animation playback
    function playAnimation() {
        if (isPlaying) return; // Prevent multiple play calls
        isPlaying = true;

        // Sets animation play speed based on speedSlider value
        function getAnimationSpeed() {
            const fastestSpeed = 50;  // (ms)
            const slowestSpeed = 3000; // (ms)
            return slowestSpeed - (speedSlider.value / 100) * (slowestSpeed - fastestSpeed);
        }

        // Replaces current frame with the next frame at a set speed
        function step() {
            if (!isPlaying || currentFrame >= frames.length - 1) {
                isPlaying = false;
                return;
            }
            currentFrame++;
            drawFrame(frames[currentFrame]); // Draw the next frame
            setTimeout(step, getAnimationSpeed()); // Recursively calls step function
        }
        step();
    }

    // Generates a random adjacency matrix for the graph
    function generateRandomAdjacencyMatrix(size) {
        const matrix = Array.from({ length: size }, () => Array(size).fill(0));
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i !== j) {
                    matrix[i][j] = Math.random() > 0.7 ? 1 : 0; // Randomly create edges
                }
            }
        }
        return matrix;
    }

    // Determines the color of nodes in the visualization
    function getColor(index) {
        if (index === currentIndex) return 'blue';
        return 'lightblue';
    }

    // Increases or decreases fill of progress bar based on how far into animation the user is
    function updateProgressBar() {
        const progress = (currentFrame / (frames.length - 1)) * 100;
        progressFill.style.width = `${progress}%`;
    }

    // Adds, into step log, all steps up to current frame (clears before adding)
    function updateStepLog() {
        stepLog.innerHTML = ""; // Reset log
        stepLog.innerHTML += `Initial List: ${currentData.join(", ")}<br>`; // Initial list

        for (let i = 1; i <= currentFrame; i++) {
            if (frames[i].explanation) {
                stepLog.innerHTML += frames[i].explanation + "<br>";
            }
        }

        if (currentFrame === frames.length - 1) {
            stepLog.innerHTML += `Final PageRank Values: ${data.map(v => v.toFixed(2)).join(", ")}`; // Final list
        }

        stepLog.scrollTop = stepLog.scrollHeight;
    }

    // Initializes and starts animation playback
    // Initializes and starts animation playback
    function playAnimation() {
        if (isPlaying) return; // Prevent multiple play calls
        isPlaying = true;

        // Sets animation play speed based on speedSlider value
        function getAnimationSpeed() {
            const fastestSpeed = 50;  // (ms)
            const slowestSpeed = 3000; // (ms)
            return slowestSpeed - (speedSlider.value / 100) * (slowestSpeed - fastestSpeed);
        }

        // Replaces current frame with the next frame at a set speed
        function step() {
            if (!isPlaying || currentFrame >= frames.length - 1) {
                isPlaying = false;
                return;
            }
            currentFrame++;
            drawFrame(frames[currentFrame]); // Draw the next frame
            setTimeout(step, getAnimationSpeed()); // Recursively calls step function
        }
        step();
    }

    // Pauses animation
    function pauseAnimation() {
        isPlaying = false;
    }

    // Moves forward 1 frame
    function stepForward() {
        if (currentFrame < frames.length - 1) {
            currentFrame++;
            drawFrame(frames[currentFrame]);
        }
    }

    // Moves backward 1 frame
    function stepBackward() {
        if (currentFrame > 0) {
            currentFrame--;
            drawFrame(frames[currentFrame]);
        }
    }

    // Moves to specific frame based on where in the progress bar the user clicks
    function moveToFrame(event) {
        const rect = progressBar.getBoundingClientRect(); // Get progress bar dimensions
        const clickX = event.clientX - rect.left; // Click-position within progress bar
        const progressPercent = clickX / rect.width; // Determine how far in the progress bar the user clicked
        currentFrame = Math.round(progressPercent * (frames.length - 1)); // Determine which frame to move to
        drawFrame(frames[currentFrame]); // Move to frame
    }

    // Enables and contextualizes parts of top control bar relevant to Quicksort
    function loadControlBar() {
        randListSize.disabled = false;
        randomizeButton.disabled = false;
        inputElement.placeholder = "Enter a list of 2-20 integers between -200 & 200 (ex. 184 -23 14 -75 198)";
        inputElement.disabled = false;
        customInputToggle.disabled = false;
        progressBar.disabled = false;
        speedSlider.disabled = false;
    }

    // Pauses animation and goes back to frame 1
    function resetAnimation() {
        pauseAnimation();
        currentFrame = 0;
        drawFrame(frames[currentFrame]);
    }

    // Generates new list with user given size, loads animation for new random list
    function randomizeInput() {
        if (!randListSize.value) {
            sizeWarningMessage.textContent = "Error: Enter an integer";
            sizeWarningMessage.style.color = "red";
        }
        else {
            let inputList = randListSize.value.trim().split(/\s+/); // turns input into a string list
            inputList = inputList.map(Number); // turns string list into a number list
            if (checkRandomizeInput(inputList)) {
                pauseAnimation();
                defaultData = generateRandomList(inputList[0]);
                currentData = [...defaultData];
                loadAnimation();
            }
        }
    }

    // Generates custom user-given list, loads animation for new custom list
    // Loads back animation for default list when toggled off
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

    // Validates user input for random list size
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
            sizeWarningMessage.textContent = "Error: Enter 1 integer only";
            sizeWarningMessage.style.color = "red";
            return false;
        }
        if (inputList[0] < 2 || inputList[0] > 4) { // Restrict size to a maximum of 4
            sizeWarningMessage.textContent = "Error: Enter an integer between 2-4";
            sizeWarningMessage.style.color = "red";
            return false;
        }
        sizeWarningMessage.textContent = "---";
        sizeWarningMessage.style.color = "#f4f4f4";
        return true;
    }

    // Validates user input for custom list
    function checkCustomInput(inputList) {
        if (inputList == "") {
            inputWarningMessage.textContent = "Error: Enter an input";
            inputWarningMessage.style.color = "red";
            return false;
        }
        if (!isWholeNumbers(inputList)) {
            inputWarningMessage.textContent = "Error: Enter integers only";
            inputWarningMessage.style.color = "red";
            return false;
        }
        if (inputList.length > 4 || inputList.length < 2) { // Restrict size to a maximum of 4
            inputWarningMessage.textContent = "Error: Enter 2 to 4 integers only";
            inputWarningMessage.style.color = "red";
            return false;
        }
        if (checkInputValues(inputList)) {
            inputWarningMessage.style.color = "#f4f4f4";
            return true;
        } else {
            inputWarningMessage.textContent = "Error: Enter integer values between -200 and 200 only";
            inputWarningMessage.style.color = "red";
            return false;
        }
    }

    // Returns true if all the elements in the given list are whole numbers, else returns false
    function isWholeNumbers(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] == NaN || !Number.isInteger(list[i])) {
                return false;
            }
        }
        return true;
    }

    // Returns true if all the elements in the given list are between -200 & 200, else returns false
    function checkInputValues(inputList) {
        for (let i = 0; i < inputList.length; i++) {
            if (inputList[i] > 200 || inputList[i] < -200) {
                return false;
            }
        }
        return true;
    }

    // Generates random list of given size
    function generateRandomList(size = 4) {
        let randomArray = new Array(size);
        for (let i = 0; i < size; i++) {
            const randomSeed = 0.5 - Math.random(); // used to generate random signage
            randomArray[i] = Math.round(randomSeed / Math.abs(randomSeed) * Math.random() * 200);
        }
        return randomArray;
    }
    // Initializes and prepares the animation frames for playback
    function loadAnimation() {
        frames = []; // Clear any existing frames
        currentFrame = 0; // Reset to the first frame

        // Generate a random adjacency matrix for 4 nodes
        adjacencyMatrix = generateRandomAdjacencyMatrix(4);
        data = Array(4).fill(1 / 4); // Initialize PageRank values for 4 nodes

        // Record the initial state
        recordFrame("Initial state of the graph and PageRank values.");

        // Calculate PageRank and record frames
        calculatePageRank().then(() => {
            // Record the final state
            recordFrame("Final PageRank values calculated.");
            drawFrame(frames[currentFrame]); // Draw the first frame
        });
    }

    // Ties Quicksort animation functionality to main page
    window.activeController = new AnimationController(loadAnimation, loadControlBar, playAnimation, pauseAnimation, stepForward, stepBackward,
        moveToFrame, resetAnimation, randomizeInput, toggleCustomInput);
};