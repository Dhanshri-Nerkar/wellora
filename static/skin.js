// static/skin.js

/**
 * Calculates the progress score out of 10 based on 7 criteria.
 * @param {object} item - A single history record from the Flask backend.
 * @returns {number} The calculated score rounded to two decimals.
 */
function calculateProgressScore(item) {
    let score = 0;
    // Each of the 7 criteria contributes 10/7 points (~1.4286)
    const point = 10 / 7; 
    
    // --- 1. Sleep Hrs (7 - 9 hours) ---
    const sleepValue = item.sleep_hours ? String(item.sleep_hours).trim() : '0';
    const sleep = parseFloat(sleepValue);
    if (!isNaN(sleep) && sleep >= 7 && sleep <= 9) score += point;

    // --- 2. Water Intake ('high' gives points) ---
    const water = item.water_intake ? String(item.water_intake).trim().toLowerCase() : '';
    if(water === 'high') score += point;

    // --- 3-7. Boolean Fields (0 or 1 from DB) ---
    // These boolean fields must be strictly equal to 1 to award points.
    if(item.follow_morning_routine === 1) score += point;
    if(item.follow_night_routine === 1) score += point;
    if(item.products_made_change === 1) score += point;
    if(item.remedies_helpful === 1) score += point;
    if(item.problem_solved === 1) score += point;

    // Round to 2 decimals
    return Math.round(score * 100) / 100; 
}


/**
 * Initializes and draws the progress bar chart.
 * @param {Array<object>} historyData - Array of history records from Flask.
 */
function renderProgressChart(historyData) {
    // Data is reversed so the chart displays chronologically (oldest first)
    const labels = historyData.map(item => item.date_submitted).reverse();
    const progressScores = historyData.map(calculateProgressScore).reverse();

    const ctx = document.getElementById('progressChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [{
                label: 'Progress Score (out of 10)',
                data: progressScores,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Score (Max 10)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (context) => `Feedback Date: ${context[0].label}`,
                        label: (context) => `Score: ${context.parsed.y}`
                    }
                }
            }
        }
    });
}

// Global function to start the chart drawing process
document.addEventListener('DOMContentLoaded', () => {
    // Check if the historyData element exists and extract data
    const dataElement = document.getElementById('historyDataJson');
    if (dataElement) {
        try {
            const historyData = JSON.parse(dataElement.textContent);
            if (historyData && historyData.length > 0) {
                renderProgressChart(historyData);
            }
        } catch (e) {
            console.error("Error parsing history data for chart:", e);
        }
    }
});