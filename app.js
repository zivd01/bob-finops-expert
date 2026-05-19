/**
 * Draws a half-circle gauge on an HTML5 canvas element.
 * 
 * @param {string} canvasId - The ID of the canvas element to draw on.
 * @param {number} valuePercent - The percentage value to fill (0-100).
 * @param {string} colorPrimary - The starting color of the gauge arc.
 * @param {string} colorSecondary - The ending color of the gauge arc (for gradients), or null for solid color.
 * @param {string} colorTrack - The background color of the empty track.
 * @param {boolean} isSmall - Whether this is a small gauge (adjusts padding and removes the needle).
 */
function drawGauge(canvasId, valuePercent, colorPrimary, colorSecondary, colorTrack, isSmall = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Get the 2D rendering context
    const ctx = canvas.getContext('2d');
    
    // Calculate dimensions and positioning
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    // Small gauges have less bottom padding
    const centerY = height - (isSmall ? 10 : 20); 
    const radius = Math.min(centerX, centerY) - (isSmall ? 10 : 15);
    const lineWidth = isSmall ? 10 : 15;

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    // 1. Draw the background track (gray arc)
    ctx.beginPath();
    // Arc from PI (180 degrees) to 2*PI (360 degrees) for a top-half circle
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = colorTrack;
    ctx.stroke();

    // If value is 0, don't draw the filled portion or needle
    if (valuePercent <= 0) return;

    // 2. Draw the filled value arc
    // Calculate the ending angle based on the percentage
    const endAngle = Math.PI + (valuePercent / 100) * Math.PI;
    
    // Apply gradient if a secondary color is provided, otherwise use solid color
    if (colorSecondary) {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, colorPrimary);
        gradient.addColorStop(1, colorSecondary);
        ctx.strokeStyle = gradient;
    } else {
        ctx.strokeStyle = colorPrimary;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
    ctx.stroke();

    // 3. Draw the needle indicator (only for large gauges)
    if (!isSmall) {
        const needleLength = radius - 15;
        // The needle points to the exact value angle
        const needleAngle = Math.PI + (valuePercent / 100) * Math.PI;
        
        // Calculate the X and Y coordinates for the tip of the needle
        const needleX = centerX + needleLength * Math.cos(needleAngle);
        const needleY = centerY + needleLength * Math.sin(needleAngle);

        // Draw the needle line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(needleX, needleY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#6b7280'; // Gray color for the needle
        ctx.stroke();

        // Draw the circular pivot point at the base of the needle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#6b7280';
        ctx.fill();
    }
}

// Initialize all dashboard gauges once the HTML has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Define the color palette used for the gauges
    const green = '#22c55e';
    const blue = '#3b82f6';
    const red = '#ef4444';
    const track = '#e5e7eb';

    // --- Top Row (Large Gauges) ---
    // 1. Potential Monthly Savings: ~35% (Green to Red gradient style)
    drawGauge('gauge-savings', 35, green, red, track, false);

    // 2. Average Workload Consumption: ~12% (Solid blue)
    drawGauge('gauge-consumption', 12, blue, null, track, false);

    // --- Bottom Row (Small Gauges) ---
    // 3. CPU Reservation (10%, solid green)
    drawGauge('gauge-cpu-res', 10, green, null, track, true);
    
    // 4. CPU Namespace (0%, solid green)
    drawGauge('gauge-cpu-ns', 0, green, null, track, true);

    // 5. Memory Usage Cluster (0%, solid blue)
    drawGauge('gauge-mem-cluster', 0, blue, null, track, true);

    // 6. Memory Usage Namespace (28%, blue to red gradient)
    drawGauge('gauge-mem-ns', 28, blue, red, track, true);
});
