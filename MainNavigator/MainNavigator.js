// Opens Home Page by default upon page load
document.addEventListener("DOMContentLoaded", function () {
    selectAlgorithm('HomePage');

    const listSizeInput = document.getElementById('listSize');

    // Prevents the user from typing in their own input in the list size box
    listSizeInput.addEventListener('keydown', function(event) {
        event.preventDefault(); 
    });
});

// Left Accordion Menu Functionality
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

// Right Info Panel Functionality
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

    // Clear the top panel
    resetTopPanel();

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
            window.setupQuicksort();
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

function resetTopPanel(){
    const inputElement = document.getElementById('customInput');
    const warningMessage = document.getElementById('inputWarningMessage');
    const listSize = document.getElementById('listSize');
    const randomizeButton = document.getElementById('randomizeButton');
    const inputToggle = document.getElementById('customInputToggle');
    const speedSlider = document.getElementById("speedSlider");

    inputElement.value = "";
    randomizeButton.disabled = true;
    listSize.value = NaN;
    inputToggle.checked = false;
    speedSlider.value = 0;
    warningMessage.style.color = "#f4f4f4";
}

// document.getElementById("algorithmInfo").innerHTML = `<h3>${name} Algorithm</h3><p>Description and pseudocode here...</p>`;

