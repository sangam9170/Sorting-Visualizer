// script.js

const arrayContainer = document.getElementById('array-container');
const arraySizeInput = document.getElementById('array-size');
const speedInput = document.getElementById('speed');
const startSortButton = document.getElementById('start-sort');
const swapCountDisplay = document.getElementById('swap-count'); // New element to display swap count
const sortingAlgorithms = document.querySelectorAll('input[name="sort"]');

let array = [];
let swapCount = 0; // Initialize swap count

// Initialize the array with random values
function initArray(size) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 400) + 1);
    drawArray();
    swapCount = 0; // Reset swap count for new array
    updateSwapCountDisplay(); // Update display
}

// Draw the array as bars
function drawArray() {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

// Swap function for the visualizer
function swapElements(element1, element2) {
    const tempHeight = element1.style.height;
    element1.style.height = element2.style.height;
    element2.style.height = tempHeight;
    swapCount++; // Increment swap count
    updateSwapCountDisplay(); // Update display
}

// Function to update swap count display
function updateSwapCountDisplay() {
    swapCountDisplay.textContent = `Swap Count: ${swapCount}`; // Display current swap count
}

// Bubble Sort Implementation
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            const bars = document.querySelectorAll('.bar');
            bars[j].classList.add('active');
            bars[j + 1].classList.add('active');

            await new Promise(resolve => setTimeout(resolve, speedInput.value));

            if (array[j] > array[j + 1]) {
                swapElements(bars[j], bars[j + 1]);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }

            bars[j].classList.remove('active');
            bars[j + 1].classList.remove('active');
        }
        drawArray();
    }
    markSorted();
}

// Insertion Sort Implementation
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        const key = array[i];
        let j = i - 1;
        const bars = document.querySelectorAll('.bar');

        while (j >= 0 && array[j] > key) {
            bars[j].classList.add('active');

            await new Promise(resolve => setTimeout(resolve, speedInput.value));

            array[j + 1] = array[j];
            swapElements(bars[j], bars[j + 1]); // Call swap function

            j--;
        }
        array[j + 1] = key;
        drawArray();
        markSorted();
    }
}

// Selection Sort Implementation
async function selectionSort() {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        const bars = document.querySelectorAll('.bar');
        
        bars[i].classList.add('active');
        
        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add('active');

            await new Promise(resolve => setTimeout(resolve, speedInput.value));

            if (array[j] < array[minIndex]) {
                if (minIndex !== i) {
                    bars[minIndex].classList.remove('active');
                }
                minIndex = j;
            }
            bars[j].classList.remove('active');
        }

        if (minIndex !== i) {
            swapElements(bars[i], bars[minIndex]); // Call swap function
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
        drawArray();
        markSorted();
    }
}

// Merge Sort Implementation
async function mergeSort(array) {
    if (array.length <= 1) return array;

    const mid = Math.floor(array.length / 2);
    const left = await mergeSort(array.slice(0, mid));
    const right = await mergeSort(array.slice(mid));

    return await merge(left, right);
}

async function merge(left, right) {
    const sortedArray = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            sortedArray.push(left[i++]);
        } else {
            sortedArray.push(right[j++]);
        }
    }
    while (i < left.length) sortedArray.push(left[i++]);
    while (j < right.length) sortedArray.push(right[j++]);

    drawArray();
    await new Promise(resolve => setTimeout(resolve, speedInput.value * sortedArray.length));

    return sortedArray;
}

// Quick Sort Implementation
async function quickSort(array, left = 0, right = array.length - 1) {
    if (left < right) {
        const pivotIndex = await partition(array, left, right);
        await quickSort(array, left, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, right);
    }
}

async function partition(array, left, right) {
    const pivot = array[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        const bars = document.querySelectorAll('.bar');
        bars[j].classList.add('active');

        await new Promise(resolve => setTimeout(resolve, speedInput.value));

        if (array[j] <= pivot) {
            i++;
            swapElements(bars[i], bars[j]); // Call swap function
            [array[i], array[j]] = [array[j], array[i]];
        }
        bars[j].classList.remove('active');
    }

    swapElements(bars[i + 1], bars[right]); // Call swap function
    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    return i + 1;
}

// Function to mark sorted bars
function markSorted() {
    const bars = document.querySelectorAll('.bar');
    bars[array.length - 1].classList.add('sorted');
}

// Start sorting based on selected algorithm
startSortButton.addEventListener('click', async () => {
    const selectedAlgorithm = document.querySelector('input[name="sort"]:checked').value;
    initArray(arraySizeInput.value);

    await new Promise(resolve => setTimeout(resolve, 500)); // Wait before starting
    switch (selectedAlgorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort(array);
            drawArray();
            break;
        case 'quick':
            await quickSort(array);
            drawArray();
            break;
    }
    updateSwapCountDisplay(); // Update the final swap count display
});

// Initialize with default array size
initArray(arraySizeInput.value);

// Update array size on input change
arraySizeInput.addEventListener('input', () => {
    initArray(arraySizeInput.value);
});
