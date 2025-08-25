// Datos de productos
const products = [
  {
    id: 1,
    name: "Chaqueta Urban Elite",
    price: 299900,
    image: "img/coleccion/imagen1.webp",
    category: "Chaquetas"
  },
  {
    id: 2,
    name: "Sudadera Oversize Premium",
    price: 189900,
    image: "img/coleccion/imagen2.jfif",
    category: "Sudaderas"
  },
  {
    id: 3,
    name: "Camiseta Vintage Limited",
    price: 99900,
    image: "img/coleccion/imagen3.jfif",
    category: "Camisetas"
  },
  {
    id: 4,
    name: "Pantalón Cargo Street",
    price: 249900,
    image: "img/coleccion/imagen4.jpg",
    category: "Pantalones"
  },
  {
    id: 5,
    name: "Botas Urban Explorer",
    price: 399900,
    image: "img/coleccion/imagen5.jpg",
    category: "Calzado"
  },
  {
    id: 6,
    name: "Gorra Streetwear",
    price: 79900,
    image: "img/coleccion/imagen6.jpg",
    category: "Accesorios"
  },
  {
    id: 7,
    name: "Bomber Jacket Neo",
    price: 349900,
    image: "img/coleccion/imagen7.jfif",
    category: "Chaquetas"
  },
  {
    id: 8,
    name: "Jeans Skinny Dark",
    price: 199900,
    image: "img/coleccion/imagen8.webp",
    category: "Pantalones"
  }
];

// Carrito de compras
let cart = [];

// Formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
}

// Renderizar productos
function renderProducts() {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = products.map(product => `
    <div class="col-lg-3 col-md-6">
      <div class="card product-card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-light text-dark mb-2 align-self-start">${product.category}</span>
          <h5 class="card-title fw-bold mb-2">${product.name}</h5>
          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="btn btn-primary" onclick="addToCart(${product.id})">
                <i class="bi bi-bag-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Agregar al carrito
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`${product.name} agregado al carrito`);
}

// Remover del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

// Actualizar cantidad
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  }
}

// Actualizar UI del carrito
function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge');
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartBadge.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-bag display-1 text-muted mb-3"></i>
        <p class="text-muted">Tu carrito está vacío</p>
        <a href="#productos" class="btn btn-primary" data-bs-dismiss="offcanvas">
          Explorar Productos
        </a>
      </div>
    `;
    cartFooter.style.display = 'none';
  } else {
    cartItems.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h6 class="mb-0">Productos en tu carrito</h6>
        <button class="btn btn-sm btn-outline-danger" onclick="clearCart()">
          <i class="bi bi-trash"></i> Vaciar
        </button>
      </div>
      ${cart.map(item => `
        <div class="cart-item">
          <div class="row align-items-center">
            <div class="col-3">
              <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
            </div>
            <div class="col-9">
              <h6 class="fw-bold mb-1">${item.name}</h6>
              <p class="text-muted small mb-2">${formatPrice(item.price)}</p>
              <div class="d-flex align-items-center justify-content-between">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="btn btn-outline-secondary disabled">${item.quantity}</span>
                  <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    `;
    cartFooter.style.display = 'block';
    cartSubtotal.textContent = formatPrice(totalPrice);
    cartTotal.textContent = formatPrice(totalPrice);
  }
}

// Vaciar carrito
function clearCart() {
  cart = [];
  updateCartUI();
}

function checkout() {
  if (cart.length === 0) return;

  // Simular proceso de pago
  setTimeout(() => {
    clearCart();
    const cartOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
    cartOffcanvas.hide();

    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }, 1000);
}

// Toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast position-fixed top-0 end-0 m-3';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    <div class="toast-body bg-success text-white rounded">
      <i class="bi bi-check-circle me-2"></i>${message}
    </div>
  `;
  document.body.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// News reel navigation
const newsReel = document.getElementById('newsReel');
const newsPrev = document.getElementById('newsPrev');
const newsNext = document.getElementById('newsNext');

newsPrev.addEventListener('click', () => {
  newsReel.scrollBy({ left: -350, behavior: 'smooth' });
});

newsNext.addEventListener('click', () => {
  newsReel.scrollBy({ left: 350, behavior: 'smooth' });
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  showToast('Mensaje enviado correctamente. Te contactaremos pronto.');
  this.reset();
});

// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  renderProducts();

  // Observe elements for animation
  document.querySelectorAll('section').forEach(el => {
    observer.observe(el);
  });
});

// Gallery modal functionality
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function () {
    const img = this.querySelector('img');
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body p-0 text-center">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" style="z-index: 10;"></button>
            <img src="${img.src}" alt="${img.alt}" class="img-fluid rounded-4">
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
      document.body.removeChild(modal);
    });
  });
});


// Script para el carrusel de noticias
document.addEventListener('DOMContentLoaded', function () {
  const newsReel = document.getElementById('newsReel');
  const newsPrev = document.getElementById('newsPrev');
  const newsNext = document.getElementById('newsNext');

  // Ancho de una tarjeta + gap
  const cardWidth = document.querySelector('.news-card').offsetWidth + 24;

  newsNext.addEventListener('click', function () {
    newsReel.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  newsPrev.addEventListener('click', function () {
    newsReel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
});