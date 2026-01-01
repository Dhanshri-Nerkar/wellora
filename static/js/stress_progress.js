// Progress page - Shows only current stress type data
document.addEventListener('DOMContentLoaded', function() {
    console.log('Progress dashboard loaded ✅');

    const tabs = document.querySelectorAll('.stress-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadProgressData(type);
        });
    });

    // Load default type (work) or from URL
    const urlParams = new URLSearchParams(window.location.search);
    const defaultType = urlParams.get('stress_type') || 'work';
    document.querySelector(`.stress-tab[data-type="${defaultType}"]`).classList.add('active');
    loadProgressData(defaultType);
});

function loadProgressData(stressType) {
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('progressHistory').style.display = 'none';
    document.getElementById('chartSection').style.display = 'none';

    fetch(`/stress/get-progress?stress_type=${stressType}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('loadingIndicator').style.display = 'none';
            if (data.success && data.history.length > 0) {
                displayProgressTable(data.history, stressType);
                displayProgressChart(data.history, stressType);
            } else {
                showNoDataMessage(stressType);
            }
        })
        .catch(err => {
            console.error("Error fetching progress:", err);
            showNoDataMessage(stressType);
        });
}


function getCurrentStressType() {
    // Try to get from URL first (if coming from feedback form)
    const urlParams = new URLSearchParams(window.location.search);
    let stressType = urlParams.get('stress_type');
    
    // If not in URL, try to get from the most recent progress data
    if (!stressType) {
        // Get all possible stress types and find the most recent one
        const stressTypes = ['work', 'relationship', 'academic' ];
        let latestStressType = null;
        let latestTimestamp = 0;
        
        stressTypes.forEach(type => {
            const history = JSON.parse(localStorage.getItem(`progressHistory_${type}`) || '[]');
            if (history.length > 0) {
                const lastEntry = history[history.length - 1];
                const entryTime = new Date(lastEntry.timestamp).getTime();
                if (entryTime > latestTimestamp) {
                    latestTimestamp = entryTime;
                    latestStressType = type;
                }
            }
        });
        
        stressType = latestStressType;
    }
    
    return stressType;
}

function updatePageTitle(stressType) {
    const header = document.querySelector('.progress-header h1');
    if (header && stressType) {
        header.textContent = `${stressType.replace(/_/g, ' ').toUpperCase()} Progress Dashboard`;
    }
}

function displayProgressTable(history, stressType) {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('progressHistory').style.display = 'block';

    const historyBody = document.getElementById('historyBody');

    const columnsMap = {
        'work': ['sleep_hours', 'manage_workload', 'short_breaks', 'support_team', 'stress_decrease', 'rating'],
        'academic': ['sleep_hours', 'task_completion', 'academic_confidence', 'study_breaks', 'stress_reduce', 'rating'],
        'relationship': ['sleep_quality', 'communication', 'conflict_avoidance', 'emotional_support', 'stress_reduction', 'rating']
        
    };

    const fields = columnsMap[stressType] || [];

    // ✅ Clean, fixed header layout — each column separate
    let headerHTML = `
        <div class="table-row table-header">
            <span>Date & Time</span>
            ${fields.map(f => `<span>${f.replace(/_/g, ' ')}</span>`).join('')}
        </div>
    `;

    // ✅ Proper body rows with clear date + fields
    let bodyHTML = history.map(entry => {
        let date = new Date(entry.submitted_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });

        return `
            <div class="table-row">
                <span>${date}</span>
                ${fields.map(f => `<span>${entry[f] || '-'}</span>`).join('')}
            </div>
        `;
    }).join('');

    historyBody.innerHTML = headerHTML + bodyHTML;
}


function displayProgressChart(history, stressType) {
    console.log('Displaying progress chart for', stressType);
    
    // Show chart section
    document.getElementById('chartSection').style.display = 'block';
    
    // Update chart title
    const chartTitle = document.querySelector('#chartSection h3');
    if (chartTitle) {
        chartTitle.innerHTML = `<i class="fas fa-chart-bar"></i> ${stressType.replace(/_/g, ' ').toUpperCase()} Progress Over Time`;
    }
    
    const ctx = document.getElementById('progressChart');
    
    if (history.length === 0) {
        ctx.parentElement.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #718096;">
                <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No progress data for ${stressType} yet. Complete feedback forms to see your progress chart.</p>
            </div>
        `;
        return;
    }
    
    // Sort history by timestamp to ensure correct order
    const sortedHistory = history.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));

    
    const dates = sortedHistory.map(entry => {
        const date = new Date(entry.submitted_at);
return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});

    });
    
    const scores = sortedHistory.map(entry => {
    let fields = Object.keys(entry).filter(f => !['id', 'username', 'submitted_at'].includes(f));
    let yesCount = fields.filter(f => entry[f] === 'Yes').length;
    let score = (yesCount / fields.length) * 100;
    return score;
});

    
    // Use consistent color for this stress type
    const stressTypeColor = getStressTypeColor(stressType);
    
    // Destroy existing chart if it exists
    if (window.progressChartInstance) {
        window.progressChartInstance.destroy();
    }
    
    window.progressChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: `${stressType.toUpperCase()} Progress Score %`,
                data: scores,
                backgroundColor: stressTypeColor,
                borderColor: stressTypeColor.replace('0.8', '1'),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Progress Score %'
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date & Time'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const entry = sortedHistory[context.dataIndex];
                            return [
                                `Progress: ${context.parsed.y}%`,
                                `Rating: ${entry.rating}/5 ⭐`,
                                `Tips Used: ${entry.tips_count}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

function getStressTypeColor(stressType) {
    // Rosy Palette Map
    const colors = {
        // Main Primary Rosy Color (From your CSS variable --button-color)
        'work': 'rgba(168, 118, 118, 0.8)',      // #A87676 (Primary Rosy)
        
        // Other complementary Rosy/Pink Shades
        'relationship': 'rgba(255, 99, 99, 0.8)',  // #FF6363 (Soft Red/Rose)
        'academic': 'rgba(204, 153, 153, 0.8)',    // #CC9999 (Websafe Old Rose)
        'financial': 'rgba(255, 179, 179, 0.8)'   // #FFB3B3 (Light Pink)
             // #FF6363 (Soft Red/Rose)
    };
    // Default fallback color
    return colors[stressType] || 'rgba(113, 128, 150, 0.8)'; // Rosy version of fallback
}

function showNoDataMessage(stressType) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.innerHTML = `
        <div style="text-align: center; color: white; padding: 2rem;">
            <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h2>No Progress Data for ${stressType.replace(/_/g, ' ').toUpperCase()}</h2>
            <p>Please complete a feedback form for ${stressType} stress to see your progress dashboard.</p>
            <button class="btn-primary" onclick="window.location.href='/'">
                <i class="fas fa-home"></i> Back to Home
            </button>
        </div>
    `;
}

function showNoStressTypeMessage() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.innerHTML = `
        <div style="text-align: center; color: white; padding: 2rem;">
            <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h2>No Stress Type Selected</h2>
            <p>Please complete a stress assessment first to view your progress.</p>
            <button class="btn-primary" onclick="window.location.href='/'">
                <i class="fas fa-home"></i> Back to Home
            </button>
        </div>
    `;
}