// --- GLOBAL ANIMATION CONTROLLER ---
class AnimationController {
    constructor(loadAnimation, loadControlBar, playAnimation, pauseAnimation, stepForward, stepBackward, moveToFrame, 
    resetAnimation, randomizeInput, toggleCustomInput) {
        this.loadAlgorithmAnimation = loadAnimation ?? this.emptyFunction;
        this.loadAlgorithmControlBar = loadControlBar ?? this.emptyFunction;
        this.playAlgorithmAnimation = playAnimation ?? this.emptyFunction;
        this.pauseAlgorithmAnimation = pauseAnimation ?? this.emptyFunction;
        this.stepForwardOneFrame = stepForward ?? this.emptyFunction;
        this.stepBackwardOneFrame = stepBackward ?? this.emptyFunction;
        this.moveToAlgorithmFrame = moveToFrame ?? this.emptyFunction;
        this.resetAlgorithmAnimation = resetAnimation ?? this.emptyFunction;
        this.randomizeAlgorithmInput = randomizeInput ?? this.emptyFunction;
        this.toggleCustomAlgorithmInput = toggleCustomInput ?? this.emptyFunction;
    }

    emptyFunction() {}

    loadAnimation() {
        this.loadAlgorithmAnimation();
    }

    loadControlBar() {
        this.loadAlgorithmControlBar();
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

    moveToFrame(event) {
        this.moveToAlgorithmFrame(event);
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
    document.getElementById("progressBar").addEventListener("click", (event) => window.activeController.moveToFrame(event));
});




// --- LEFT NAVIGATOR DROPDOWN SELECTING/OPENING & SEARCH FUNCTIONALITY ---
window.onload = function () {
    // search functionality
    document.getElementById('searchInput').addEventListener('input', function () {
        let filter = this.value.toLowerCase();
        let accordionItems = document.querySelectorAll('.accordion-item');
    
        accordionItems.forEach(item => {
            let header = item.querySelector('.accordion-header');
            let content = item.querySelector('.accordion-content');
            let links = content ? content.querySelectorAll('a') : [];
            let headerText = header.textContent.toLowerCase();
            let matchFound = false;
    
            // Check if the header matches the search
            let headerMatches = headerText.includes(filter);
    
            // Check if any links (algorithms) match the search
            let matchingLinks = [];
            links.forEach(link => {
                if (link.textContent.toLowerCase().includes(filter)) {
                    matchingLinks.push(link);
                }
            });
    
            // If header matches but no algorithms do, show but collapse
            if (headerMatches && matchingLinks.length === 0) {
                item.style.display = "block";
                content.style.display = "none"; // Keep collapsed
            } 
            // If some algorithms match, show and expand the section
            else if (matchingLinks.length > 0) {
                item.style.display = "block";
                content.style.display = "block"; // Expand section
                links.forEach(link => {
                    link.style.display = matchingLinks.includes(link) ? "block" : "none";
                });
            } 
            // If nothing matches, hide the whole section
            else {
                item.style.display = "none";
            }
        });
    });
    
    // dropdown functionality
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
    // Reset text content for step log
    document.getElementById("stepLog").textContent = ``;

    // Clear previous algorithm right info panel content
    document.getElementById('description').innerHTML = '';
    document.getElementById('pseudocode').innerHTML = '';
    document.getElementById('references').innerHTML = '';

    // Clear/Reset top control bar 
    document.getElementById('randListSize').value = NaN;
    document.getElementById('randListSize').disabled = true;
    document.getElementById('randomizeButton').disabled = true;
    document.getElementById('sizeWarningMessage').textContent = "-";
    document.getElementById('sizeWarningMessage').style.color = "#f4f4f4";
    document.getElementById('customInput').value = "";
    document.getElementById('customInput').placeholder = "";
    document.getElementById('customInput').disabled = true;
    document.getElementById('customInputToggle').checked = false;
    document.getElementById('customInputToggle').disabled = true;
    document.getElementById('inputWarningMessage').textContent= "-";
    document.getElementById('inputWarningMessage').style.color = "#f4f4f4";
    document.getElementById("progressBar").disabled = true;
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("speedSlider").disabled = true;
    document.getElementById("speedSlider").value = 50;

    // Tie top control bar, middle display panels, and right info panel to current algorithm
    // activeController is tied to current algorithm too
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
            window.loadBinaryTree();
            break;
        case "BFS":
            algorithmPath = '../AlgorithmPages/BruteForce/BreadthFirstSearch/' + algorithmName + 'Info.html';
            window.loadBFS();
            break;
        case "BubbleSort":
            algorithmPath = '../AlgorithmPages/BruteForce/BubbleSort/' + algorithmName + 'Info.html';
            window.loadBubbleSort();
            break;
        case "DFS":
            algorithmPath = '../AlgorithmPages/BruteForce/DepthFirstSearch/' + algorithmName + 'Info.html';
            window.loadDFS();
            break;
        case "Heapsort":
            algorithmPath = '../AlgorithmPages/BruteForce/Heapsort/' + algorithmName + 'Info.html';
            window.loadHeapsort();
            break;
        case "InsertionSort":
            algorithmPath = '../AlgorithmPages/BruteForce/InsertionSort/' + algorithmName + 'Info.html';
            window.loadInsertionSort();
            break;
        case "PageRank":
            algorithmPath = '../AlgorithmPages/BruteForce/PageRank/' + algorithmName + 'Info.html';
            window.loadPageRank();
            break;
        case "SelectionSort":
            algorithmPath = '../AlgorithmPages/BruteForce/SelectionSort/' + algorithmName + 'Info.html';
            window.loadSelectionSort();
            break;
        // ** Divide and Conquer ** // 
        case "BucketSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/BucketSort/' + algorithmName + 'Info.html';
            window.loadBucketSort();
            break;
        case "CountingSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/CountingSort/' + algorithmName + 'Info.html';
            window.loadCountingSort();
            break;
        case "MergeSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/MergeSort/' + algorithmName + 'Info.html';
            window.loadMergeSort();
            break;
        case "Quicksort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/Quicksort/' + algorithmName + 'Info.html';
            window.loadQuicksort();
            break;
        case "RadixSort":
            algorithmPath = '../AlgorithmPages/DivideAndConquer/RadixSort/' + algorithmName + 'Info.html';
            window.loadRadixSort();
            break;
        // ** Dynamic Programming ** //
        case "Fibonacci":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/FibonacciSequence/' + algorithmName + 'Info.html';
            window.loadFibonacci();
            break;
        case "FlyodPath":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/FlyodWarshallShortestPath/' + algorithmName + 'Info.html';
            window.loadFlyodPath();
            break;
        case "Knapsack":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/KnapsackProblem/' + algorithmName + 'Info.html';
            window.loadKnapsack();
            break;
        case "MaxSumPath":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/MaximumSumPath/' + algorithmName + 'Info.html';
            window.loadMaxSumPath();
            break;
        case "SlidingWindow":
            algorithmPath = '../AlgorithmPages/DynamicProgramming/SlidingWindow/' + algorithmName + 'Info.html';
            window.loadSlidingWindow();
            break;
        // ** Greedy ** //
        case "DijkstraPath":
            algorithmPath = '../AlgorithmPages/Greedy/DijkstraShortestPath/' + algorithmName + 'Info.html';
            window.loadDijkstraPath();
            break;
        case "PrimMinTree":
            algorithmPath = '../AlgorithmPages/Greedy/PrimMinimumSpanningTree/' + algorithmName + 'Info.html';
            window.loadPrimMinTree();
            break;
        default:
            algorithmPath = '../HomePage/HomePage.html';
            window.loadHomePage();
            console.error(`Error - Unknown Algorithm: ${algorithmName}`);
    }

    // Load middle display panels content for current algorithm
    window.activeController.loadAnimation();

    // Load top control bar for current algorithm
    window.activeController.loadControlBar();

    // Load right info panel content for current algorithm
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