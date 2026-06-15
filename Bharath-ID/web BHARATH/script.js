/**
 * BHARATH ID - Website Interactions and Chart Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Background on Scroll ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- Chart.js Implementations ---

    // Global Chart Settings
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = "'Inter', sans-serif";
    const gridColor = 'rgba(255, 255, 255, 0.05)';

    // 1. Success vs Failed Attempts (Bar Chart)
    const ctxSuccess = document.getElementById('successFailedChart');
    if (ctxSuccess) {
        new Chart(ctxSuccess, {
            type: 'bar',
            data: {
                labels: ['Traditional Aadhaar', 'BHARATH ID'],
                datasets: [
                    {
                        label: 'Successful',
                        data: [6600, 8300],
                        backgroundColor: 'rgba(34, 197, 94, 0.8)', // Green
                        borderRadius: 4
                    },
                    {
                        label: 'Failed',
                        data: [3400, 1700],
                        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, grid: { display: false } },
                    y: { stacked: true, grid: { color: gridColor } }
                },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // 2. Failure Rate Trend Over Time (Line Chart)
    const ctxTrend = document.getElementById('trendChart');
    if (ctxTrend) {
        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Failure Rate % (Baseline vs BHARATH ID Implementation)',
                    data: [36, 38, 40, 39, 36, 25, 20, 15, 13, 11], // Drop starts mid-year with implementation
                    borderColor: '#06b6d4', // Cyan
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#050b14',
                    pointBorderColor: '#06b6d4',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: gridColor },
                        min: 0,
                        max: 40,
                        ticks: { callback: value => value + '%' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.raw + '%'
                        }
                    }
                }
            }
        });
    }

    // 3. Quality Score Distribution (Histogram implementation using Bar)
    const ctxQuality = document.getElementById('qualityDistChart');
    if (ctxQuality) {
        new Chart(ctxQuality, {
            type: 'bar',
            data: {
                labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
                datasets: [{
                    label: 'Sample Frequency in Manual Laborers',
                    data: [15, 30, 85, 120, 240, 190, 140, 90, 50, 20], // Skewed left due to erosion
                    backgroundColor: (context) => {
                        const score = context.dataIndex;
                        if (score < 4) return 'rgba(239, 68, 68, 0.6)'; // Red for low
                        if (score < 7) return 'rgba(234, 179, 8, 0.6)'; // Yellow for med
                        return 'rgba(34, 197, 94, 0.6)'; // Green for high
                    },
                    borderRadius: 2,
                    barPercentage: 0.95,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: gridColor } }
                }
            }
        });
    }

    // 4. Failure Causes (Pie/Doughnut Chart)
    const ctxCauses = document.getElementById('causesChart');
    if (ctxCauses) {
        new Chart(ctxCauses, {
            type: 'doughnut',
            data: {
                labels: ['Low Ridge Clarity', 'Partial Contact', 'Sensor Noise', 'Excessive Dryness', 'Other'],
                datasets: [{
                    data: [45, 20, 15, 15, 5],
                    backgroundColor: [
                        'rgba(6, 182, 212, 0.8)',   // Cyan
                        'rgba(59, 130, 246, 0.8)',  // Blue
                        'rgba(99, 102, 241, 0.8)',  // Indigo
                        'rgba(168, 85, 247, 0.8)',  // Purple
                        'rgba(75, 85, 99, 0.8)'     // Gray
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12 }
                    }
                }
            }
        });
    }

    // 5. Scatter Plot: Quality vs Confidence
    const ctxScatter = document.getElementById('scatterChart');
    if (ctxScatter) {
        // Generate pseudo-realistic cluster data
        const generateScatterData = () => {
            const data = [];
            for (let i = 0; i < 150; i++) {
                // Low quality tends to have low and highly variable confidence
                // High quality has high confidence
                const quality = Math.random() * 100;
                let confidence;

                if (quality < 40) {
                    confidence = Math.random() * 50 + (quality * 0.5);
                } else if (quality < 70) {
                    confidence = 40 + Math.random() * 40 + ((quality - 40) * 0.6);
                } else {
                    confidence = 80 + Math.random() * 19;
                }

                // Cap
                confidence = Math.min(100, Math.max(0, confidence));

                // Color based on success threshold (e.g. 70 confidence)
                data.push({
                    x: quality,
                    y: confidence,
                    status: confidence >= 70 ? 'Pass' : 'Fail'
                });
            }
            return data;
        };

        const scatterData = generateScatterData();

        new Chart(ctxScatter, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Successful Verification',
                        data: scatterData.filter(d => d.status === 'Pass'),
                        backgroundColor: 'rgba(34, 197, 94, 0.6)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Failed Verification',
                        data: scatterData.filter(d => d.status === 'Fail'),
                        backgroundColor: 'rgba(239, 68, 68, 0.6)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Fingerprint Quality Score (0-100)', color: '#9ca3af' },
                        grid: { color: gridColor },
                        min: 0,
                        max: 100
                    },
                    y: {
                        title: { display: true, text: 'Match Confidence (%)', color: '#9ca3af' },
                        grid: { color: gridColor },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    annotation: {
                        // Assuming basic Chart.js without annotation plugin, 
                        // we drew the threshold line contextually in data, 
                        // but a real project might include chartjs-plugin-annotation
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Quality: ${context.raw.x.toFixed(1)}, Confidence: ${context.raw.y.toFixed(1)}%`
                        }
                    }
                }
            }
        });
    }
});
