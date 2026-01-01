function openProductModal(name, benefits, use, ingredients, image, link) {
  document.getElementById('modalTitle').innerText = name;
  document.getElementById('modalBenefits').innerText = benefits;
  document.getElementById('modalUse').innerText = use;
  document.getElementById('modalIngredients').innerText = ingredients;
  document.getElementById('modalImage').src = image;
  document.getElementById('modalBuyLink').href = link;
  document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

// Optional: close when clicking outside modal
window.onclick = function(event) {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};
