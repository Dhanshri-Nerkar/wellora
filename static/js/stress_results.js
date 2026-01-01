// Results page JavaScript
function playVideo(button) {
    const videoItem = button.closest('.video-item');
    const iframe = videoItem.querySelector('iframe');
    const videoUrl = iframe.src;
    
    // Add autoplay to the video
    if (!videoUrl.includes('autoplay=1')) {
        iframe.src = videoUrl + (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1';
    }
    
    // Scroll to video
    videoItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Show playing state
    button.innerHTML = '<i class="fas fa-pause"></i> Playing...';
    button.style.background = '#28a745';
    
    // Reset after 3 seconds
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-play"></i> Watch Now';
        button.style.background = '#4a90e2';
    }, 3000);
}

// Add loading animation for videos
document.addEventListener('DOMContentLoaded', function() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        
        iframe.addEventListener('load', function() {
            wrapper.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        wrapper.style.opacity = '0.7';
        wrapper.style.transition = 'opacity 0.3s ease';
    });
});
function goToFeedback(stressType) {
    // Get stress data from the form (you might need to store this in sessionStorage)
    const stressData = {
        stress_level: sessionStorage.getItem('stress_level') || '5',
        stress_duration: sessionStorage.getItem('stress_duration') || '',
        lifestyle: sessionStorage.getItem('lifestyle') || '',
        sleep_hours: sessionStorage.getItem('sleep_hours') || ''
    };
    
    // Build URL with query parameters
    const params = new URLSearchParams(stressData);
    window.location.href = `/feedback/${stressType}?${params.toString()}`;
}