// Kindle-compatible dot drawing canvas - ES5/CSS2/HTML4 only



/// VARIABLES /// 
var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var title = document.getElementById('title');
var submenuToggle = document.getElementById('submenuToggle');
var submenu = document.getElementById('submenu');
var clearButton = document.getElementById('clearButton');
var decreaseButton = document.getElementById('decreaseSize');
var increaseButton = document.getElementById('increaseSize');
var sizeValueSpan = document.getElementById('sizeValue');
var drawingModeButtonsContainer = document.getElementById('drawingModeButtons');
var colorSwatchesContainer = document.getElementById('colorSwatches');

var currentSize = 5;
var drawingMode = 'dot'; // 'dot', 'line', 'linkedLines', 'curve', etc
var lineStartPoint = null;
var lastLinkedLinePoint = null;
var curveLinePoints = []; 
var linkedCurvePoints = [];



// FUNCTIONS //
function handleCanvasClick(e) {
    function getCanvasPointerCoordinates(e) {
        if (e.clientX === undefined || e.clientY === undefined) return null;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        return [x, y];
    }

    function handleDrawingMode(x, y) {
        function drawDot(x, y) {
            var radius = currentSize/2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 6.283185); // Tau instead of Pi*2 as it is the superior circle constant (see: https://www.tauday.com/tau-manifesto)
            ctx.fill();
        }
        
        function drawLine(x, y) {
            if (!lineStartPoint) {
                lineStartPoint = { x: x, y: y };
            } else {
                ctx.beginPath();
                ctx.moveTo(lineStartPoint.x, lineStartPoint.y);
                ctx.lineTo(x, y);
                ctx.stroke();
                lineStartPoint = null; // Reset for the next line
            }
        }
        
        function drawLinkedLines(x, y) {
            if (!lastLinkedLinePoint) {
                lastLinkedLinePoint = { x: x, y: y };
            } else {
                ctx.beginPath();
                ctx.moveTo(lastLinkedLinePoint.x, lastLinkedLinePoint.y);
                ctx.lineTo(x, y);
                ctx.stroke();
                lastLinkedLinePoint = { x: x, y: y };
            }
        }
        
        function drawCurveLine(x, y) {
                // To draw arches we use Bezier curves with the quadraticCurveTo() function, which uses 3 points.
                // however this way only the origin and the end (curveLinePoints[0] and curveLinePoints[2]) are interpolated in the curve,
                // while the middle point (i.e. the control point) is be outside of the curve.
                // from a mathematical point of view this this is the correct aproach, but it is absolutely counterintuitive for the drawing users, 
                // as they expect for the drawn curve to pass in the points of the screen they tapped.
                // (i.e. to have each point interpolated in the line).
                // to fix this we have to calculate the control point of the line that pass through them all. 
                // The Bezier equation is the following:
                //    x(t) = (1-t)^2*x_0 + 2(1-t)t*x_1 + t^2*x_2 
                //    y(t) = (1-t)^2*y_0 + 2(1-t)t*y_1 + t^2*y_2
                // since t goes from 0 to 1 and we want to calculate the control point at half time so at t=1/2 (i.e. in the "middle")
                //    x_middle = (1/4)x_0 + (1/2)*x_1 + (1/4)*x_2
                //    x_1 = 2*x_middle - (1/2)x_0 - (1/2)*x_2  -> same for y_middle
            curveLinePoints.push({ x: x, y: y });
            if (curveLinePoints.length === 3) {
                ctx.beginPath();
                var controlPoint = {
                    x: 2*curveLinePoints[1].x - 0.5*curveLinePoints[0].x - 0.5*curveLinePoints[2].x ,
                    y: 2*curveLinePoints[1].y - 0.5*curveLinePoints[0].y - 0.5*curveLinePoints[2].y 
                };
                ctx.moveTo(curveLinePoints[0].x, curveLinePoints[0].y);
                ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, curveLinePoints[2].x, curveLinePoints[2].y);
                ctx.stroke();
                curveLinePoints = []; // Reset for the next curve line
            }
        }
        
        function drawLinkedCurve(x, y) {
            linkedCurvePoints.push({ x: x, y: y });
        
            if (linkedCurvePoints.length === 3) {
                ctx.beginPath();
                var controlPoint = {
                    x: 2 * linkedCurvePoints[1].x - 0.5 * linkedCurvePoints[0].x - 0.5 * linkedCurvePoints[2].x,
                    y: 2 * linkedCurvePoints[1].y - 0.5 * linkedCurvePoints[0].y - 0.5 * linkedCurvePoints[2].y
                };
                ctx.moveTo(linkedCurvePoints[0].x, linkedCurvePoints[0].y);
                ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, linkedCurvePoints[2].x, linkedCurvePoints[2].y);
                ctx.stroke();
        
                linkedCurvePoints = [{ x: linkedCurvePoints[2].x, y: linkedCurvePoints[2].y }];
            }
        }

        if (drawingMode === 'dot') {
            drawDot(x, y);
        } else if (drawingMode === 'line') {
            drawLine(x, y);
        } else if (drawingMode === 'linkedLines') {
            drawLinkedLines(x, y);
        } else if (drawingMode === 'curve') {
            drawCurveLine(x, y);
        } else if (drawingMode === 'linkedCurve') {
            drawLinkedCurve(x, y);
        }
    }
    
    coordinates = getCanvasPointerCoordinates(e);
    handleDrawingMode(coordinates[0], coordinates[1]);
};

function resetDrawingPoints(){
    lineStartPoint = null; 
    lastLinkedLinePoint = null;
    curveLinePoints = [];
    linkedCurvePoints = [];
};

/// PAGE SET UP ///
window.onload = function() {
    function setCanvasDimensions() {
        var container = canvas.parentElement;
        var containerWidth = container.clientWidth;
        var containerHeight = window.innerHeight;
    
        canvas.width = containerWidth;
        canvas.height = containerHeight;
    }
    function setFonts() {
        var screenWidth = window.innerWidth;
        var FontSize = screenWidth * 0.03;
        title.style.fontSize = FontSize + 'px';
        submenuToggle.style.fontSize = FontSize + 'px';
        submenu.style.fontSize = FontSize + 'px';     
    }
    function defaultSelection() {
        var selectedSwatch = document.querySelector('.color-swatch.selected');
        var selectedColor = '#000000'; // Default to black for first-load robustness
        if (selectedSwatch && selectedSwatch.getAttribute) {
            selectedColor = selectedSwatch.getAttribute('data-color');
        }
        ctx.fillStyle = selectedColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        var defaultColorSwatch = document.querySelector('.color-swatch[data-color="#000000"]');
        defaultColorSwatch.className += ' selected';
    }
    setCanvasDimensions();
    setFonts();
    defaultSelection();
};

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
sizeValueSpan.innerHTML = currentSize;



/// EVENT LISTENING ///
canvas.addEventListener('mousedown', function(e) {
        handleCanvasClick(e);
        if (submenu.style.display !== 'none') {
            submenu.style.display = 'none';
            submenuToggle.textContent = 'OPEN';
        }
});
    
if (window.kindle && kindle.gestures) { // screen tap (I copied this)
    try {kindle.gestures.init(); } catch (ignore) {}    
    kindle.gestures.ontap = function(e) {
        handleCanvasClick(e);
    };
    kindle.gestures.onswipe = function(e) {
        handleCanvasClick(e);
    };
}

submenuToggle.addEventListener('click', function () {
    if (submenu.style.display === 'none') {
      submenu.style.display = 'block';
      submenuToggle.textContent = 'CLOSE';
    } else {
      submenu.style.display = 'none';
      submenuToggle.textContent = 'OPEN';
    }
  });
  

clearButton.addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetDrawingPoints();
});

drawingModeButtonsContainer.addEventListener('click', function(e) {
    var target = e.target || e.srcElement;

    if (target.className && target.className.indexOf('drawing-mode-button') !== -1) {
        var modeButtons = document.querySelectorAll('.drawing-mode-button');
        for (var i = 0; i < modeButtons.length; i++) {
            modeButtons[i].className = modeButtons[i].className.replace(/\bselected\b/g, '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
        }
        target.className += ' selected';
        
        if (target.id === 'dotButton') {
            drawingMode = 'dot';
        } else if (target.id === 'lineButton') {
            drawingMode = 'line';
        } else if (target.id === 'linkedLinesButton') {
            drawingMode = 'linkedLines';
        } else if (target.id === 'curveButton') {
            drawingMode = 'curve';
        } else if (target.id === 'linkedCurveButton') {
            drawingMode = 'linkedCurve';
        }

        ctx.fillStyle = ctx.strokeStyle; // Make sure fillStyle matches strokeStyle for dots
        ctx.lineWidth = currentSize; // Set line width for lines and dot radius
        resetDrawingPoints();

    }
});

colorSwatchesContainer.addEventListener('click', function(e) {
    var target = e.target || e.srcElement; // srcElement for old devices compatibility
    
    if (target.className && target.className.indexOf('color-swatch') !== -1) {
        var swatchesList = document.querySelectorAll('.color-swatch');
        for (var i = 0; i < swatchesList.length; i++) { 
            swatchesList[i].className = swatchesList[i].className.replace(/\bselected\b/g, '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''); // Remove 'selected' class from all swatches
        }
        target.className += ' selected';
        
        var dataColor = target.getAttribute('data-color');
        ctx.fillStyle = dataColor;
        ctx.strokeStyle = dataColor; // Also set stroke style for lines
        resetDrawingPoints();
    }
});

decreaseButton.addEventListener('click', function() { // size control
    if (currentSize > 1) { // Minimum size of 1
        currentSize--;
        sizeValueSpan.innerHTML = currentSize;
        ctx.lineWidth = currentSize; // Update line width
        resetDrawingPoints();
    }
});

increaseButton.addEventListener('click', function() { // size control
    if (currentSize < 50) { // Maximum size of 50
        currentSize++;
        sizeValueSpan.innerHTML = currentSize;
        ctx.lineWidth = currentSize; // Update line width
        resetDrawingPoints();
    }
});