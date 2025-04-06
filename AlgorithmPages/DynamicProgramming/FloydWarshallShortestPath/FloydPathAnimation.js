class MinPriorityQueue {
    constructor({ priority }) {
        this.priority = priority;
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
        this.items.sort((a, b) => this.priority(a) - this.priority(b));
    }

    dequeue() {
        const element = this.items.shift();
        return { element, priority: this.priority(element) };
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

window.loadDijkstraPath = function () {
    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const speedSlider = document.getElementById("speedSlider");
    const graphCanvas = document.getElementById('graphCanvas');
    const stepLog = document.getElementById("stepLog");

    const boxListVisual = document.getElementById('boxListVisual');
    const middlePanel = document.querySelector('.middle-panels');
    middlePanel.removeChild(boxListVisual);

    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;

    const graphCtx = graphCanvas.getContext('2d');

    let graphSize = Math.round(Math.random() * 7 + 3); // Random graph size of at least 3
    let currentEdges = createWeightedEdges(graphSize);
    let startingNode = selectStartingNode(graphSize);
    let distances = Array(graphSize).fill(Infinity);
    distances[startingNode] = 0;
    let visited = new Set();
    let frames = [];
    let currentFrame = 0;
    let isPlaying = false;

    const radius = 30;

    function drawFrame(frame) {
        if (!frame) return;
        ({ distances, visited } = frame);
        drawData();
        updateProgressBar();
        updateStepLog();
    }

    function drawData() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        drawGraphVisualization();
    }

    function drawGraphVisualization() {
        const numNodes = graphSize;
        const centerX = graphCanvas.width / 2;
        const centerY = graphCanvas.height / 2;
        const graphRadius = Math.min(graphCanvas.width, graphCanvas.height) / 2 - radius * 2;

        const nodePositions = [];

        graphCtx.font = `16px Arial`;
        graphCtx.textAlign = 'center';
        graphCtx.textBaseline = 'middle';

        for (let i = 0; i < numNodes; i++) {
            const angle = (i / numNodes) * (2 * Math.PI);
            const x = centerX + graphRadius * Math.cos(angle);
            const y = centerY + graphRadius * Math.sin(angle);
            nodePositions.push({ x, y });
        }

        // Draw edges
        for (let i = 0; i < currentEdges.length; i++) {
            for (let j = 0; j < currentEdges[i].length; j++) {
                const { node, weight } = currentEdges[i][j];
                const start = nodePositions[i];
                const end = nodePositions[node];
                graphCtx.beginPath();
                graphCtx.moveTo(start.x, start.y);
                graphCtx.lineTo(end.x, end.y);
                graphCtx.strokeStyle = 'black';
                graphCtx.stroke();

                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;
                graphCtx.fillStyle = 'black';
                graphCtx.fillText(weight, midX, midY);
            }
        }

        // Draw nodes
        for (let i = 0; i < numNodes; i++) {
            const { x, y } = nodePositions[i];

            graphCtx.fillStyle = getColorNode(i);
            graphCtx.beginPath();
            graphCtx.arc(x, y, radius, 0, 2 * Math.PI);
            graphCtx.fill();
            graphCtx.strokeStyle = 'black';
            graphCtx.stroke();

            // Label inside node: distance
            graphCtx.fillStyle = 'black';
            const distText = distances[i] === Infinity ? 'INF' : distances[i];
            graphCtx.fillText(distText, x, y);

            // Label below node: index
            graphCtx.fillText(`(${i})`, x, y + radius + 12);
        }
    }

    function getColorNode(index) {
        const log = `Updating distance of node ${index} to ${distances[index]}`;
        if (frames[currentFrame].explanation.includes(log)) {
            return 'yellow';
        } 
        return visited.has(index) ? 'lightgreen' : 'lightblue';
    }

    function getColorEdge(node1, node2) {
        const edgeKey = node1 < node2 ? `${node1}-${node2}` : `${node2}-${node1}`;
        if (shortestPathEdges.includes(edgeKey)) {
            return 'lightgreen';
        }
        return 'black';
    }

    function updateProgressBar() {
        const progress = (currentFrame / (frames.length - 1)) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function updateStepLog() {
        stepLog.innerHTML = "";
        for (let i = 1; i <= currentFrame; i++) {
            if (frames[i].explanation) {
                stepLog.innerHTML += frames[i].explanation + "<br>";
            }
        }
        if (currentFrame === frames.length - 1) {
            stepLog.innerHTML += "<strong>Final Distances:</strong><br>";
            distances.forEach((d, i) => {
                stepLog.innerHTML += `Node ${i}: ${d === Infinity ? 'INF' : d}<br>`;
            });
        }
        stepLog.scrollTop = stepLog.scrollHeight;
    }

    function recordFrame(explanation = "") {
        frames.push({
            distances: [...distances],
            visited: new Set([...visited]),
            explanation
        });
    }

    async function dijkstra(adjList, start) {
        let pq = new MinPriorityQueue({ priority: x => x.dist });
        pq.enqueue({ node: start, dist: 0 });
        recordFrame(`Start at node ${start}`);

        while (!pq.isEmpty()) {
            let { element: { node }, priority } = pq.dequeue();
            if (visited.has(node)) continue;
            visited.add(node);
            recordFrame(`Visiting node ${node}`);

            for (let neighbor of adjList[node]) {
                const { node: nextNode, weight } = neighbor;
                if (distances[node] + weight < distances[nextNode]) {
                    distances[nextNode] = distances[node] + weight;
                    pq.enqueue({ node: nextNode, dist: distances[nextNode] });
                    recordFrame(`Updating distance of node ${nextNode} to ${distances[nextNode]}`);
                }
            }
        }
    }

    async function loadAnimation() {
        frames = [];
        currentFrame = 0;
        distances = Array(graphSize).fill(Infinity);
        distances[startingNode] = 0;
        visited = new Set();

        recordFrame();

        await dijkstra(currentEdges, startingNode);

        recordFrame();

        drawFrame(frames[currentFrame]);
    }

    function loadControlBar() {
        progressBar.disabled = false;
        speedSlider.disabled = false;
    }

    function playAnimation() {
        if (isPlaying) return;
        isPlaying = true;

        function getSpeed() {
            const fastest = 50;
            const slowest = 3000;
            return slowest - (speedSlider.value / 100) * (slowest - fastest);
        }

        function step() {
            if (!isPlaying || currentFrame >= frames.length - 1) {
                isPlaying = false;
                return;
            }
            currentFrame++;
            drawFrame(frames[currentFrame]);
            setTimeout(step, getSpeed());
        }
        step();
    }

    function pauseAnimation() { isPlaying = false; }
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
    function moveToFrame(event) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const progressPercent = clickX / rect.width;
        currentFrame = Math.round(progressPercent * (frames.length - 1));
        drawFrame(frames[currentFrame]);
    }

    function resetAnimation() {
        pauseAnimation();
        currentFrame = 0;
        drawFrame(frames[currentFrame]);
    }

    function createWeightedEdges(n) {
        let adj = Array.from({ length: n }, () => []);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (Math.random() > 0.5) {
                    const weight = Math.round(Math.random() * 10);
                    adj[i].push({ node: j, weight });
                    adj[j].push({ node: i, weight });
                }
            }
        }
        return adj;
    }

    // Selects a random node as the starting node
    function selectStartingNode(maxVal){
        return Math.round(Math.random() * maxVal);
    }
    
    // Ties animation functionality to main page
    window.activeController = new AnimationController(
        loadAnimation,
        loadControlBar,
        playAnimation,
        pauseAnimation,
        stepForward,
        stepBackward,
        moveToFrame,
        resetAnimation,
    );
};
