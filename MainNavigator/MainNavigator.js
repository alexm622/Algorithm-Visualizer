// Top Bar Functionality
document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById('customInput');
    const warningMessage = document.getElementById('inputWarningMessage');
    const listSizeInput = document.getElementById('listSize');
    const randomizeButton = document.getElementById('randomize');
    const customInputToggle = document.getElementById('customInputToggle');
    let customUserInput;
    let defaultInput;
    let currentInput; 
    let listSize = Math.floor(Math.random() * 21) + 2;
    createRandomInput(listSize);

    // Creates a randomized list with a length between 2-20 and values between 0-99 
    function createRandomInput(size) {
        defaultInput = new Array(size);
        for (let i=0; i < size; i++)
        {
            defaultInput[i] = Math.floor(Math.random() * 99);
        }
    }

    // Returns true if all the elements in the given list are whole numbers, else it returns false
    function isWholeNumbers(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] == NaN || !Number.isInteger(list[i])) {
              return false;
            }
        }
        return true;     
    }
    
    function isWhitespace(str) {
        const regex = /^\s*$/;
        return regex.test(str);
    }

    // Prevents the user from typing in their own input in the list size box
    listSizeInput.addEventListener('keydown', function(event) {
        event.preventDefault(); 
      });
    

    listSizeInput.addEventListener('input', function(event) {
        listSize = event.target.value; 
        randomizeButton.disabled = false;

    });

    randomizeButton.addEventListener('click', function(event) {
        createRandomInput(listSize);
    });

    customInputToggle.addEventListener('change', function()  {
        if (this.checked) 
        {    
            if (!inputElement.value)
            {
                warningMessage.textContent = "Invalid Input: Enter an input";
                warningMessage.style.color = "red";
                warningMessage.style.display = "block";
                customInputToggle.checked = false;
            }
            else
            {
                let inputList = inputElement.value.trim().split(/\s+/);
                inputList = inputList.map(Number);
                if (checkCustomInput(inputList) == true)
                {
                    console.log(inputList);
                    currentInput = inputList;
                }
                else
                {
                    customInputToggle.checked = false;
                }
            }
        }
        else
        {
            console.log('false');
            // Set current input equal to the default input
        }
    });

    function checkInputValues(inputList) {
        for (let i = 0; i < inputList.length; i++)
        {
            if (inputList[i] > 99 || inputList[i] < -99)
            {
                return false;
            }
        }
        return true;
    }

    function checkCustomInput(inputList) {
        if (inputList == ""){
            warningMessage.textContent = "Invalid Input: Enter an input";
            warningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length > 20 && isWholeNumbers(inputList) == false)
        {
            warningMessage.textContent = "Invalid Input: Only accepts integers and max 20 total values";
            warningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length < 2 && isWholeNumbers(inputList) == false){
            warningMessage.textContent = "Invalid Input: Only accepts integers and a minimum of 2 values";
            warningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length > 20){
            warningMessage.textContent = "Invalid Input: Only accepts a maximum of 20 values";
            warningMessage.style.color = "red";
            return false;
        }
        else if (isWholeNumbers(inputList) == false){
            warningMessage.textContent = "Invalid Input: Only accepts integers";
            warningMessage.style.color = "red";
            return false;
        }
        else if (inputList.length < 2){
            warningMessage.textContent = "Invalid Input: Only accepts a minimum of 2 values";
            warningMessage.style.color = "red";
            return false;
        }
        else{
            if (checkInputValues(inputList) == true){
                warningMessage.style.color = "#f4f4f4";
                return true;
            }
            else{
                warningMessage.textContent = "Invalid Input: Only accepts integers between -99 and 99";
                warningMessage.style.color = "red";
                return false;
            }
        }
    }
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
    // Clear the canvas
    let canvas = document.getElementById("graphCanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Ensure the canvas resizes correctly
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    // Reset text content for other display panels
    document.getElementById("boxListVisual").textContent = ``;
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
            window.stopDrawingQuicksort();
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
            console.error("Error: unknown algorithm selected");
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


// document.getElementById("algorithmInfo").innerHTML = `<h3>${name} Algorithm</h3><p>Description and pseudocode here...</p>`;

