// Music page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to all favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const embedUrl = this.getAttribute('data-embed');
            const description = this.getAttribute('data-desc');
            
            toggleFavorite(this, title, embedUrl, description);
        });
    });
    
    updateFavoritesList();
});

function toggleFavorite(button, title, embedUrl, description) {
    let favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    const videoData = { title, embed_url: embedUrl, description };
    
    const existingIndex = favorites.findIndex(fav => fav.title === title);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        button.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
        button.classList.remove('favorited');
    } else {
        favorites.push(videoData);
        button.innerHTML = '<i class="fas fa-heart"></i> Favorited';
        button.classList.add('favorited');
    }
    
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
    updateFavoritesList();
}

function updateFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    const favoritesList = document.getElementById('favoritesList');
    const favoritesCount = document.getElementById('favoritesCount');
    
    // Update count
    favoritesCount.textContent = favorites.length;
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<div class="empty-favorites"><p>No favorites yet. Click the heart icon to add videos!</p></div>';
        return;
    }
    
    let html = '<div class="favorites-grid">';
    favorites.forEach(video => {
        html += `
            <div class="favorite-item">
                <div class="favorite-item-info">
                    <h5>${video.title}</h5>
                    <p>${video.description}</p>
                </div>
                <div class="favorite-item-actions">
                    <button class="play-favorite-btn" onclick="playFavoriteVideo('${video.embed_url}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button class="remove-favorite-btn" onclick="removeFavorite('${video.title.replace(/'/g, "\\'")}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    favoritesList.innerHTML = html;
}

function playFavoriteVideo(embedUrl) {
    const videoIframes = document.querySelectorAll('.video-wrapper iframe');
    videoIframes.forEach(iframe => {
        if (iframe.src.includes(embedUrl)) {
            iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const videoCard = iframe.closest('.video-card');
            videoCard.style.boxShadow = '0 0 0 3px #fbbf24';
            setTimeout(() => {
                videoCard.style.boxShadow = '';
            }, 2000);
        }
    });
}

function removeFavorite(title) {
    let favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    favorites = favorites.filter(fav => fav.title !== title);
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
    
    document.querySelectorAll('.favorite-btn').forEach(button => {
        if (button.getAttribute('data-title') === title) {
            button.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
            button.classList.remove('favorited');
        }
    });
    
    updateFavoritesList();
}