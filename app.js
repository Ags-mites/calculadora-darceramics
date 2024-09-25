(() => {
    const data = [
        { area: 10 * 10, spacers: 200 },
        { area: 15 * 15, spacers: 89 },
        { area: 20 * 20, spacers: 50 },
        { area: 25 * 25, spacers: 32 },
        { area: 30 * 30, spacers: 33 },
        { area: 35 * 35, spacers: 28 },
        { area: 40 * 40, spacers: 25 },
        { area: 45 * 45, spacers: 20 },
        { area: 50 * 50, spacers: 16 },
        { area: 55 * 55, spacers: 13 },
        { area: 60 * 60, spacers: 13 },
        { area: 65 * 65, spacers: 11 },
        { area: 70 * 70, spacers: 10 },
        { area: 80 * 80, spacers: 9 },
        { area: 90 * 90, spacers: 7 },
        { area: 100 * 100, spacers: 6 },
        { area: 110 * 110, spacers: 5 },
        { area: 120 * 120, spacers: 5 },
        { area: 140 * 140, spacers: 4 },
        { area: 150 * 150, spacers: 3 },
        { area: 180 * 180, spacers: 3 },
        { area: 200 * 200, spacers: 3 },
    ];

    const highTile = document.querySelector('#high-tile');
    const widthTile = document.querySelector('#width-tile');
    const lengthArea = document.querySelector('#length-area');
    const resultX = document.querySelector('#result-x');
    const resultY = document.querySelector('#result-y');
    const resultSpacers = document.querySelector('#result-spacers');

    const calculateSpacers = (high, width, aream2 ) => {
        if (!high || !width) throw new Error("Es necesario el ingreso del alto y ancho de la baldosa");
        
        const area = high * width;
        let point1 = data[0];
        let point2 = data[data.length - 1];
        const Ntile = ((aream2*10000) / area)*2;
        
        for (let i = 0; i < data.length - 1; i++) {
            if (area >= data[i].area && area <= data[i + 1].area) {
                point1 = data[i];
                point2 = data[i + 1];
                break;
            }
        }

        const spacers = (point1.spacers + (area - point1.area) * (point2.spacers - point1.spacers) / (point2.area - point1.area))*aream2;
        const spacersSide = Math.ceil(spacers/Ntile);
        
        renderResult(Math.round(spacers),spacersSide);
    };

    const renderResult = (spacers,spacersSide) => {
        if (!spacers) return;
        resultSpacers.innerHTML = `${spacers} espaciadores`;
        resultX.innerHTML = `${spacersSide}`;
        resultY.innerHTML = `${spacersSide}`;
    }

    const updateSpacers = () => {
        const high = parseFloat(highTile.value);
        const width = parseFloat(widthTile.value);
        const aream2 = parseFloat(lengthArea.value);
        calculateSpacers(high, width, aream2);
    };


    highTile.addEventListener('change', updateSpacers);
    widthTile.addEventListener('change', updateSpacers);
    lengthArea.addEventListener('change', updateSpacers);
})();
