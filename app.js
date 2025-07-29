const inputLengthX = document.getElementById('high-tile');
const inputLengthY = document.getElementById('width-tile');
const inputTotalArea = document.getElementById('length-area');
const resultX = document.getElementById('result-x');
const resultY = document.getElementById('result-y');
const resultSpacersNumber = document.getElementById('result-spacers-number');
const resultSpacersCovers = document.getElementById('result-spacers-covers');
const resultSpacersUnits = document.getElementById('result-spacers-units');
const resultCoversWedges = document.getElementById('result-covers-wedges');
const resultWedgesUnits = document.getElementById('result-wedges-units');

const STANDARD_MEASURE = 36;
const UNITS_PER_COVER = 50;
const WEDGES_PER_COVER_RATIO = 5;
const UNITS_PER_WEDGE = 50;
const SAFETY_MARGIN = 1.15;

function isValidNumber(value, minimum = 0) {
    const number = parseFloat(value);
    return !isNaN(number) && number >= minimum && number > 0;
}

function cleanInput(value, minimum = 0) {
    if (!value || value.trim() === '') return null;
    
    const number = parseFloat(value.replace(',', '.'));
    
    if (!isValidNumber(number, minimum)) return null;
    
    return number;
}

function calculateSpacersPerSide(measure) {
    return Math.max(1, Math.round(measure / STANDARD_MEASURE));
}

function calculateSpacersPerTile(width, height) {
    const spacersWidth = calculateSpacersPerSide(width);
    const spacersHeight = calculateSpacersPerSide(height);
    return spacersWidth + spacersHeight;
}

function calculateTotalSpacers(width, height, areaM2) {
    const tileArea = (width * height) / 10000;
    
    const numberOfTiles = Math.ceil(areaM2 / tileArea);
    
    const spacersPerTile = calculateSpacersPerTile(width, height);
    
    const totalSpacers = spacersPerTile * numberOfTiles;
    
    // const recommendedSpacers = Math.ceil(totalSpacers * SAFETY_MARGIN);
    const recommendedSpacers = totalSpacers;
    
    return {
        spacersPerSide: {
            width: calculateSpacersPerSide(width),
            height: calculateSpacersPerSide(height)
        },
        spacersPerTile,
        numberOfTiles,
        totalSpacers,
        recommendedSpacers,
        tileArea: tileArea.toFixed(4)
    };
}

function calculateWedgesFromSpacerCovers(spacerCovers) {
    if (!spacerCovers || spacerCovers <= 0) {
        return {
            wedges: 0,
            units: UNITS_PER_WEDGE
        };
    }
    
    const exactWedgeCovers = spacerCovers / WEDGES_PER_COVER_RATIO;
    let wedgeCovers;
    
    if (spacerCovers < 5) {
        wedgeCovers = 1;
    } else {
        wedgeCovers = Math.ceil(exactWedgeCovers);
    }
    
    return {
        wedges: wedgeCovers,
        units: UNITS_PER_WEDGE
    };
}

function calculateCoversAndUnits(totalSpacers) {
    if (!totalSpacers || totalSpacers <= 0) {
        return {
            covers: 0,
            units: UNITS_PER_COVER
        };
    }
    
    const exactCovers = totalSpacers / UNITS_PER_COVER;
    const covers = Math.ceil(exactCovers);
    
    return {
        covers,
        units: UNITS_PER_COVER
    };
}

function updateResults() {
    try {
        const width = cleanInput(inputLengthX.value, 1);
        const height = cleanInput(inputLengthY.value, 1);
        const areaM2 = cleanInput(inputTotalArea.value, 0.1);
        
        if (width !== null) {
            const spacersWidth = calculateSpacersPerSide(width);
            resultX.textContent = spacersWidth;
        } else {
            resultX.textContent = 'x';
        }
        
        if (height !== null) {
            const spacersHeight = calculateSpacersPerSide(height);
            resultY.textContent = spacersHeight;
        } else {
            resultY.textContent = 'y';
        }
        
        if (width !== null && height !== null && areaM2 !== null) {
            const spacerResults = calculateTotalSpacers(width, height, areaM2);
            const coverResults = calculateCoversAndUnits(spacerResults.recommendedSpacers);
            const wedgeResults = calculateWedgesFromSpacerCovers(coverResults.covers);
            
            resultSpacersNumber.textContent = spacerResults.recommendedSpacers;
            resultSpacersCovers.textContent = coverResults.covers;
            resultSpacersUnits.textContent = coverResults.units;
        
            resultCoversWedges.textContent = wedgeResults.wedges;
            resultWedgesUnits.textContent = wedgeResults.units;
        } else {
            resultSpacersNumber.textContent = '0';
            resultSpacersCovers.textContent = '0';
            resultSpacersUnits.textContent = '0';
            resultCoversWedges.textContent = '0';
            resultWedgesUnits.textContent = '0';
        }
        
    } catch (error) {
        console.error('Error in calculation:', error);
        clearResults();
    }
}

function clearResults() {
    resultX.textContent = 'x';
    resultY.textContent = 'y';
    resultSpacersNumber.textContent = '0';
    resultSpacersCovers.textContent = '0';
    resultSpacersUnits.textContent = '0';
    resultCoversWedges.textContent = '0';
    resultWedgesUnits.textContent = '0';
}

function handleInput(event) {
    const value = event.target.value;
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    
    if (value !== cleanValue) {
        event.target.value = cleanValue;
    }
    
    clearTimeout(event.target.timeoutId);
    event.target.timeoutId = setTimeout(updateResults, 300);
}

function handleChange() {
    updateResults();
}

        
function initializeCalculator() {
    clearResults();
    
    [inputLengthX, inputLengthY, inputTotalArea].forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('change', handleChange);
        
        input.addEventListener('keypress', (e) => {
            const char = String.fromCharCode(e.which);
            if (!/[0-9.,]/.test(char)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('blur', () => {
            setTimeout(updateResults, 100);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSpacersPerSide,
        calculateSpacersPerTile,
        calculateTotalSpacers,
        calculateWedgesFromSpacerCovers,
        calculateCoversAndUnits,
        isValidNumber,
        cleanInput,
        STANDARD_MEASURE
    };
}