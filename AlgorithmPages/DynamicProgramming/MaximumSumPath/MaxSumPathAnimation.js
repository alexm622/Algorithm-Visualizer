window.loadMaxSumPath = function () {
    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const speedSlider = document.getElementById("speedSlider");
    const graphCanvas = document.getElementById("graphCanvas");
    const stepLog = document.getElementById("stepLog");

    const boxListVisual = document.getElementById("boxListVisual");
    const middlePanel = document.querySelector(".middle-panels");
    if (boxListVisual) middlePanel.removeChild(boxListVisual);

    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    const graphCtx = graphCanvas.getContext("2d");

    let frames = [];
    let currentFrame = 0;
    let isPlaying = false;

    let treeRoot = null;
    let highlightedNodes = [];
    let highlightedEdges = [];
    let maxSum = -Infinity;
    let panX = 0, panY = 0, zoom = 1;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    class TreeNode {
        constructor(id, value) {
            this.id = id;
            this.value = value;
            this.left = null;
            this.right = null;
            this.x = 0;
            this.y = 0;
        }
    }

    function createRandomTree(depth = 4, id = 0, x = 0, y = 0) {
        if (depth === 0 || id > 20) return null;
        const node = new TreeNode(id, Math.floor(Math.random() * 40 - 10));
        if (Math.random() < 0.8) node.left = createRandomTree(depth - 1, id * 2 + 1);
        if (Math.random() < 0.8) node.right = createRandomTree(depth - 1, id * 2 + 2);
        return node;
    }

    function setNodePositions(node, x, y, spacing) {
        if (!node) return;
        node.x = x;
        node.y = y;
        if (node.left) setNodePositions(node.left, x - spacing, y + 120, spacing / 1.8);
        if (node.right) setNodePositions(node.right, x + spacing, y + 120, spacing / 1.8);
    }

    function drawTree(node) {
        graphCtx.save();
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        graphCtx.translate(panX, panY);
        graphCtx.scale(zoom, zoom);

        graphCtx.font = "16px Arial";
        graphCtx.textAlign = "center";
        graphCtx.textBaseline = "middle";

        function drawEdges(n) {
            if (!n) return;
            if (n.left) {
                graphCtx.beginPath();
                graphCtx.moveTo(n.x, n.y);
                graphCtx.lineTo(n.left.x, n.left.y);
                graphCtx.strokeStyle = isEdgeHighlighted(n, n.left) ? "orange" : "black";
                graphCtx.stroke();
                drawEdges(n.left);
            }
            if (n.right) {
                graphCtx.beginPath();
                graphCtx.moveTo(n.x, n.y);
                graphCtx.lineTo(n.right.x, n.right.y);
                graphCtx.strokeStyle = isEdgeHighlighted(n, n.right) ? "orange" : "black";
                graphCtx.stroke();
                drawEdges(n.right);
            }
        }

        function drawNodes(n) {
            if (!n) return;
            graphCtx.beginPath();
            graphCtx.arc(n.x, n.y, 25, 0, 2 * Math.PI);
            graphCtx.fillStyle = highlightedNodes.includes(n.id) ? "yellow" : "lightblue";
            graphCtx.fill();
            graphCtx.strokeStyle = "black";
            graphCtx.stroke();

            graphCtx.fillStyle = "black";
            graphCtx.fillText(n.value, n.x, n.y); // inside node value
            graphCtx.fillText(`ID ${n.id}`, n.x, n.y - 35); // label outside
            drawNodes(n.left);
            drawNodes(n.right);
        }

        function isEdgeHighlighted(parent, child) {
            return highlightedEdges.some(([a, b]) => (a === parent.id && b === child.id) || (a === child.id && b === parent.id));
        }

        drawEdges(node);
        drawNodes(node);

        graphCtx.restore();
    }

    function recordFrame(explanation) {
        frames.push({
            explanation,
            highlightedNodes: [...highlightedNodes],
            highlightedEdges: [...highlightedEdges],
        });
    }

    function drawFrame(frame) {
        highlightedNodes = frame.highlightedNodes;
        highlightedEdges = frame.highlightedEdges;
        drawTree(treeRoot);
        updateStepLog();
        updateProgressBar();
    }

    function updateStepLog() {
        stepLog.innerHTML = "";
        for (let i = 1; i <= currentFrame; i++) {
            stepLog.innerHTML += frames[i].explanation + "<br>";
        }
        if (currentFrame === frames.length - 1) {
            stepLog.innerHTML += `<strong>Maximum Path Sum: ${maxSum}</strong><br>`;
        }
        stepLog.scrollTop = stepLog.scrollHeight;
    }

    function updateProgressBar() {
        const percent = (currentFrame / (frames.length - 1)) * 100;
        progressFill.style.width = `${percent}%`;
    }

    function maxPathSumHelper(node, path = []) {
        if (!node) return 0;

        highlightedNodes = [node.id];
        recordFrame(`Visiting node ${node.id} (${node.value}), current path: [${[...path, node.id].join(" → ")}]`);

        path.push(node.id);

        const left = maxPathSumHelper(node.left, path);
        if (node.left) highlightedEdges.push([node.id, node.left.id]);

        const right = maxPathSumHelper(node.right, path);
        if (node.right) highlightedEdges.push([node.id, node.right.id]);

        const currentMax = node.value + Math.max(0, left) + Math.max(0, right);
        maxSum = Math.max(maxSum, currentMax);

        path.pop();

        return node.value + Math.max(0, Math.max(left, right));
    }

    async function loadAnimation() {
        frames = [];
        currentFrame = 0;
        maxSum = -Infinity;
        highlightedNodes = [];
        highlightedEdges = [];

        treeRoot = createRandomTree();
        setNodePositions(treeRoot, 0, 0, 220);
        recordFrame("Initialized binary tree");

        maxPathSumHelper(treeRoot);

        recordFrame("Finished Maximum Path Sum traversal");
        drawFrame(frames[0]);
    }

    function playAnimation() {
        if (isPlaying) return;
        isPlaying = true;

        const getSpeed = () => {
            const fastest = 50;
            const slowest = 3000;
            return slowest - (speedSlider.value / 100) * (slowest - fastest);
        };

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

    function moveToFrame(event) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percent = clickX / rect.width;
        currentFrame = Math.round(percent * (frames.length - 1));
        drawFrame(frames[currentFrame]);
    }

    function resetAnimation() {
        pauseAnimation();
        currentFrame = 0;
        drawFrame(frames[0]);
    }

    function loadControlBar() {
        progressBar.disabled = false;
        speedSlider.disabled = false;
    }

    // Mouse interactions for pan & zoom
    graphCanvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        zoom += e.deltaY < 0 ? zoomIntensity : -zoomIntensity;
        zoom = Math.max(0.2, Math.min(3, zoom));
        drawFrame(frames[currentFrame]);
    });

    graphCanvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStart = { x: e.clientX - panX, y: e.clientY - panY };
    });

    graphCanvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            panX = e.clientX - dragStart.x;
            panY = e.clientY - dragStart.y;
            drawFrame(frames[currentFrame]);
        }
    });

    graphCanvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    graphCanvas.addEventListener("mouseleave", () => {
        isDragging = false;
    });

    window.activeController = new AnimationController(
        loadAnimation,
        loadControlBar,
        playAnimation,
        pauseAnimation,
        stepForward,
        stepBackward,
        moveToFrame,
        resetAnimation
    );
};
