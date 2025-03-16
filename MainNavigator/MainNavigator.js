// --- GLOBAL ANIMATION CONTROLLER ---
class AnimationController {
    constructor(loadAnimation, playAnimation, pauseAnimation, stepForward, stepBackward, resetAnimation, 
    randomizeInput, toggleCustomInput) {
        this.loadAlgorithmAnimation = loadAnimation ?? this.emptyFunction;
        this.playAlgorithmAnimation = playAnimation ?? this.emptyFunction;
        this.pauseAlgorithmAnimation = pauseAnimation ?? this.emptyFunction;
        this.stepForwardOneFrame = stepForward ?? this.emptyFunction;
        this.stepBackwardOneFrame = stepBackward ?? this.emptyFunction;
        this.resetAlgorithmAnimation = resetAnimation ?? this.emptyFunction;
        this.randomizeAlgorithmInput = randomizeInput ?? this.emptyFunction;
        this.toggleCustomAlgorithmInput = toggleCustomInput ?? this.emptyFunction;
    }

    emptyFunction() {}

    loadAnimation() {
        this.loadAlgorithmAnimation();
    }

    playAnimation() {
        this.playAlgorithmAnimation();
    }

    pauseAnimation() {
        this.pauseAlgorithmAnimation();
    }

    stepForward() {
        this.stepForwardOneFrame();
    }

    stepBackward() {
        this.stepBackwardOneFrame();
    }

    resetAnimation() {
        this.resetAlgorithmAnimation();
    }

    randomizeInput() {
        this.randomizeAlgorithmInput();
    }

    toggleCustomInput() {
        this.toggleCustomAlgorithmInput();
    }
}

// --- GLOBAL CONTROLLER INSTANCE ---
window.activeController;




// --- HOME PAGE OPEN BY DEFAULT ---
document.addEventListener("DOMContentLoaded", function () {
    // initialize activeController & open to home page
    window.loadHomePage();
    selectAlgorithm('HomePage');
    // --- TOP CONTROLLER BAR FUNCTIONALITIES ---
    document.getElementById("randomizeButton").addEventListener("click", () => window.activeController.randomizeInput());
    document.getElementById("customInputToggle").addEventListener("change", () => window.activeController.toggleCustomInput());
    document.getElementById("playButton").addEventListener("click", () => window.activeController.playAnimation());
    document.getElementById("pauseButton").addEventListener("click", () => window.activeController.pauseAnimation());
    document.getElementById("resetButton").addEventListener("click", () => window.activeController.resetAnimation());
    document.getElementById("rightArrow").addEventListener("click", () => window.activeController.stepForward());
    document.getElementById("leftArrow").addEventListener("click", () => window.activeController.stepBackward());
});




// --- LEFT ACCORDION MENU TAB SELECTING/OPENING ---
window.onload = function () {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            let content = header.nextElementSibling;
            if (content && content.classList.contains('accordion-content')) {
                content.style.display = content.style.display === "block" ? "none" : "block";
            }
        });
    });
}




// --- RIGHT INFO PANEL TAB SWITCHING  ---
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    let elementChosen = document.getElementById(tabName);
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}




// --- ALGORITHM SELECTOR (cleans up previous content, loads current algorithm content) ---
function selectAlgorithm(algorithmName) {
    // Stop playing previous animation
    window.activeController.pauseAnimation();

    // Clear the graph and boxlist canvases
    const graphCanvas = document.getElementById("graphCanvas");
    const boxListCanvas = document.getElementById("boxListCanvas");
    [graphCanvas, boxListCanvas].forEach(canvas => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    });
    // Reset text content for step-log
    document.getElementById("stepLog").textContent = ``;
    // Clear previous algorithm right info-panel content
    document.getElementById('description').innerHTML = '';
    document.getElementById('pseudocode').innerHTML = '';
    document.getElementById('references').innerHTML = '';

    // Tie top control-bar and right info-panel to current algorithm
    var algorithmPath;
    switch(algorithmName) {
        // ** Home Page ** //
        case "HomePage":
            algorithmPath = '../HomePage/HomePage.html';
            window.loadHomePage();            
            break;
        // ** Brute Force ** //
        case "BinaryTree":
            algorithmPath = '../AlgorithmPages/BruteForce/BinaryTreeTraversal/' + algorithmName + 'Info.html';
            break;
        case "BFS":
            algorithmPath = '../AlgorithmPages/BruteForce/BreadthFirstSearch/' + algorithmName + 'Info.html';
            break;
        case "BubbleSort":
            algorithmPath = '../AlgorithmPages/BruteForce/BubbleSort/' + algorithmName + 'Info.html';
            break;
        case "DFS":
            algorithmPath = '../AlgorithmPages/BruteForce/DepthFirstSearch/' + algorithmName + 'Info.html';
            break;
        case "Heapsort":
            algorithmPath = '../AlgorithmPages/BruteForce/Heapsort/' + algorithmName + 'Info.html';
            break;
        case "InsertionSort":
            algorithmPath = '../AlgorithmPages/BruteForce/InsertionSort/' + algorithmName + 'Info.html';
            break;
        case "PageRank":
            algorithmPath = '../AlgorithmPages/BruteForce/PageRank/' + algorithmName + 'Info.html';
            break;
        case "SelectionSort":
            algorithmPath = '../AlgorithmPages/BruteForce/SelectionSort/' + algorithmName + 'Info.html';
            break;
        // ** Divide and Conquer ** // 
        case "BucketSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/BucketSort/' + algorithmName + 'Info.html';
            break;
        case "CountingSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/CountingSort/' + algorithmName + 'Info.html';
            break;
        case "MergeSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/MergeSort/' + algorithmName + 'Info.html';
            break;
        case "Quicksort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/Quicksort/' + algorithmName + 'Info.html';
            window.loadQuicksort();
            break;
        case "RadixSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/RadixSort/' + algorithmName + 'Info.html';
            break;
        // ** Dynamic Programming ** //
        case "Fibonacci":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/FibonacciSequence/' + algorithmName + 'Info.html';
            break;
        case "FlyodPath":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/FlyodWarshallShortestPath/' + algorithmName + 'Info.html';
            break;
        case "Knapsack":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/KnapsackProblem/' + algorithmName + 'Info.html';
            break;
        case "MaxSumPath":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/MaximumSumPath/' + algorithmName + 'Info.html';
            break;
        case "SlidingWindow":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/SlidingWindow/' + algorithmName + 'Info.html';
            break;
        // ** Greedy ** //
        case "DijkstraPath":
            algorithmPath = '../AlgorithmPages/Greedy/DijkstraShortestPath/' + algorithmName + 'Info.html';
            break;
        case "PrimMinTree":
            algorithmPath = '../AlgorithmPages/Greedy/PrimMinimumSpanningTree/' + algorithmName + 'Info.html';
            break;
        default:
            algorithmPath = '../HomePage/HomePage.html';
            window.loadHomePage();
            console.error(`Error - Unknown Algorithm: ${algorithmName}`);
    }

    // Load middle display-panels content for current algorithm
    window.activeController.loadAnimation();

    // Load right info-panel content for current algorithm
    fetch(algorithmPath)
        .then(response => response.text())
        .then(html => {
            // Create a temporary div to hold the fetched HTML content
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Extract the specific sections (description, references, pseudocode) from the fetched HTML
            var descriptionContent = tempDiv.querySelector('#description');
            var pseudocodeContent = tempDiv.querySelector('#pseudocode');
            var referencesContent = tempDiv.querySelector('#references');

            // Populate the content into the appropriate tabs
            document.getElementById('description').appendChild(descriptionContent);
            document.getElementById('references').appendChild(referencesContent);
            document.getElementById('pseudocode').appendChild(pseudocodeContent);

            // Open first tab by default (description tab)
            document.querySelector(".tablinks").click();
        })
        .catch(error => {
            console.error('Error fetching right panel content:', error);
        });
}






/*
// Global variable to track the last selected algorithm
window.previousAlgorithm = null;

// Algorithm Data Fetcher
function selectAlgorithm(algorithmName) {
    // Clear the graph and boxlist canvases
    let graphCanvas = document.getElementById("graphCanvas");
    let boxListCanvas = document.getElementById("boxListCanvas");
    let graphCtx = graphCanvas.getContext("2d");
    let boxListCtx = boxListCanvas.getContext("2d");
    graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
    boxListCtx.clearRect(0, 0, boxListCanvas.width, boxListCanvas.height);

    // Ensure the canvases resize correctly
    graphCanvas.width = graphCanvas.parentElement.clientWidth;
    graphCanvas.height = graphCanvas.parentElement.clientHeight;
    boxListCanvas.width = boxListCanvas.parentElement.clientWidth;
    boxListCanvas.height = boxListCanvas.parentElement.clientHeight;

    // Reset text content for step log
    document.getElementById("stepLog").textContent = ``;

    // Stop previous algorithm animation
    switch(window.previousAlgorithm) {
        // ** Brute Force ** //
        case "BinaryTree":
            break;
        case "BFS":
            break;
        case "BubbleSort":
            break;
        case "DFS":
            break;
        case "Heapsort":
            break;
        case "InsertionSort":
            break;
        case "PageRank":
            break;
        case "SelectionSort":
            break;
        // ** Divide and Conquer ** // 
        case "BucketSort":
            break;
        case "CountingSort":
            break;
        case "MergeSort":
            break;
        case "Quicksort":
            break;
        case "RadixSort":
            break;
        // ** Dynamic Programming ** //
        case "Fibonacci":
            break;
        case "FlyodPath":
            break;
        case "Knapsack":
            break;
        case "MaxSumPath":
            break;
        case "SlidingWindow":
            break;
        // ** Greedy ** //
        case "DijikstraPath":
            break;
        case "PrimMinTree":
            break;
        default:
            console.error("Error: unknown algorithm previously selected");
    }

    // Clear previous algorithm right panel content
    document.getElementById('description').innerHTML = '';
    document.getElementById('pseudocode').innerHTML = '';
    document.getElementById('references').innerHTML = '';

    // Start current algorithm animation
    var algorithmPath;
    switch(algorithmName) {
        // ** Home Page ** //
        case "HomePage":
            algorithmPath = '../HomePage/HomePage.html';
            break;
        // ** Brute Force ** //
        case "BinaryTree":
            algorithmPath = '../AlgorithmPages/BruteForce/BinaryTreeTraversal/' + algorithmName + 'Info.html';
            break;
        case "BFS":
            algorithmPath = '../AlgorithmPages/BruteForce/BreadthFirstSearch/' + algorithmName + 'Info.html';
            break;
        case "BubbleSort":
            algorithmPath = '../AlgorithmPages/BruteForce/BubbleSort/' + algorithmName + 'Info.html';
            break;
        case "DFS":
            algorithmPath = '../AlgorithmPages/BruteForce/DepthFirstSearch/' + algorithmName + 'Info.html';
            break;
        case "Heapsort":
            algorithmPath = '../AlgorithmPages/BruteForce/Heapsort/' + algorithmName + 'Info.html';
            break;
        case "InsertionSort":
            algorithmPath = '../AlgorithmPages/BruteForce/InsertionSort/' + algorithmName + 'Info.html';
            break;
        case "PageRank":
            algorithmPath = '../AlgorithmPages/BruteForce/PageRank/' + algorithmName + 'Info.html';
            break;
        case "SelectionSort":
            algorithmPath = '../AlgorithmPages/BruteForce/SelectionSort/' + algorithmName + 'Info.html';
            break;
        // ** Divide and Conquer ** // 
        case "BucketSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/BucketSort/' + algorithmName + 'Info.html';
            break;
        case "CountingSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/CountingSort/' + algorithmName + 'Info.html';
            break;
        case "MergeSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/MergeSort/' + algorithmName + 'Info.html';
            break;
        case "Quicksort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/Quicksort/' + algorithmName + 'Info.html';
            window.startQuicksort();
            break;
        case "RadixSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/RadixSort/' + algorithmName + 'Info.html';
            break;
        // ** Dynamic Programming ** //
        case "Fibonacci":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/FibonacciSequence/' + algorithmName + 'Info.html';
            break;
        case "FlyodPath":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/FlyodWarshallShortestPath/' + algorithmName + 'Info.html';
            break;
        case "Knapsack":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/KnapsackProblem/' + algorithmName + 'Info.html';
            break;
        case "MaxSumPath":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/MaximumSumPath/' + algorithmName + 'Info.html';
            break;
        case "SlidingWindow":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/SlidingWindow/' + algorithmName + 'Info.html';
            break;
        // ** Greedy ** //
        case "DijkstraPath":
            algorithmPath = '../AlgorithmPages/Greedy/DijkstraShortestPath/' + algorithmName + 'Info.html';
            break;
        case "PrimMinTree":
            algorithmPath = '../AlgorithmPages/Greedy/PrimMinimumSpanningTree/' + algorithmName + 'Info.html';
            break;
        default:
            algorithmPath = '../HomePage/HomePage.html';
            console.error("Error: unknown algorithm currently selected");
    }

    // Fetch current algorithm right panel content
    fetch(algorithmPath)
        .then(response => response.text())
        .then(html => {
            // Create a temporary div to hold the fetched HTML content
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Extract the specific sections (description, references, pseudocode) from the fetched HTML
            var descriptionContent = tempDiv.querySelector('#description');
            var pseudocodeContent = tempDiv.querySelector('#pseudocode');
            var referencesContent = tempDiv.querySelector('#references');

            // Populate the content into the appropriate tabs
            document.getElementById('description').appendChild(descriptionContent);
            document.getElementById('references').appendChild(referencesContent);
            document.getElementById('pseudocode').appendChild(pseudocodeContent);
            // Open first tab by default (description tab)
            document.querySelector(".tablinks").click();
        })
        .catch(error => {
            console.error('Error fetching algorithm content:', error);
        });

    window.previousAlgorithm = algorithmName;
}
*/

// document.getElementById("algorithmInfo").innerHTML = `<h3>${name} Algorithm</h3><p>Description and pseudocode here...</p>`;

