// Videos page JavaScript
// Video modal functionality
function openVideo(embedUrl, title) {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('modalVideo');
    const videoTitle = document.getElementById('modalVideoTitle');
    
    // Set video source and title
    videoFrame.src = embedUrl + '?rel=0&autoplay=1';
    videoTitle.textContent = title;
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('modalVideo');
    
    // Stop video
    videoFrame.src = '';
    
    // Hide modal
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeVideo();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeVideo();
    }
});

// Smooth scroll for category links
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for videos
document.addEventListener('DOMContentLoaded', function() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        
        iframe.addEventListener('load', function() {
            wrapper.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'opacity 0.3s ease';
    });
});