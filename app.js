const pages = ["home", "new", "product", "cart"];

const products = [
  { id: 1, name: "Polka Dot Midi Dress", price: 1999, new: true, rating: 4.6, reviews: 312, img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b" },
  { id: 2, name: "Graphic Print Black T-Shirt", price: 999, new: false, rating: 4.2, reviews: 188, img: "https://images.unsplash.com/photo-1520975661595-6453be3f7070" },
  { id: 3, name: "Denim Jacket with Hoodie", price: 2499, new: false, rating: 4.7, reviews: 421, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9" },
  { id: 4, name: "Floral Summer Dress", price: 1699, new: true, rating: 4.5, reviews: 265, img: "https://images.unsplash.com/photo-1520974735194-6c39c70a3f93" },
  { id: 5, name: "Mini Bodycon Dress", price: 1899, new: true, rating: 4.8, reviews: 512, img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" }
];

let cart = [];

// =====================
// NAVIGATION
// =====================
function go(page) {
  pages.forEach(p => document.getElementById(p).classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(el => {
  el.addEventListener("click", () => go(el.dataset.page));
});

function renderProducts() {
  homeGrid.innerHTML = "";
  newGrid.innerHTML = "";

  products.forEach(p => {
    const card = `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
      </div>
    `;
    homeGrid.innerHTML += card;
    if (p.new) newGrid.innerHTML += card;
  });
}

function openProduct(id) {
  const p = products.find(x => x.id === id);
  productView.innerHTML = `
    <img src="${p.img}">
    <div>
      <h2>${p.name}</h2>
      <div class="rating">⭐ ${p.rating} · ${p.reviews} reviews</div>
      <p style="font-size:22px">₹${p.price}</p>
      <p class="muted">Premium fabric. Clean silhouette. Built for daily wear.</p>
      <button onclick="addToCart(${id})">Add to Cart</button>
    </div>
  `;
  go("product");
}


function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item && item.qty < 10) item.qty++;
  else if (!item) cart.push({ ...products.find(p => p.id === id), qty: 1 });
  updateCart();
}

function updateCart() {
  cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
  cartItems.innerHTML = "";

  let subtotal = 0;

  cart.forEach((i, idx) => {
    subtotal += i.price * i.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${i.img}">
        <div>
          <div>${i.name}</div>
          <div class="rating">⭐ ${i.rating}</div>
          <div class="qty-controls">
            <button onclick="changeQty(${idx}, -1)" ${i.qty === 1 ? "disabled" : ""}>-</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${idx}, 1)" ${i.qty === 10 ? "disabled" : ""}>+</button>
            <span class="remove" onclick="removeItem(${idx})">Remove</span>
          </div>
        </div>
        <div>₹${i.price * i.qty}</div>
      </div>
    `;
  });

  const tax = Math.round(subtotal * 0.05);
  const delivery = subtotal >= 1999 ? 0 : 99;
  const total = subtotal + tax + delivery;

  cartSummary.innerHTML = `
    <div class="row"><span>Subtotal</span><span>₹${subtotal}</span></div>
    <div class="row"><span>Tax (5%)</span><span>₹${tax}</span></div>
    <div class="row"><span>Delivery</span><span>₹${delivery}</span></div>
    <div class="row total"><span>Total</span><span>₹${total}</span></div>
    <button class="checkout">Proceed to Checkout</button>
  `;
}

function changeQty(index, delta) {
  cart[index].qty = Math.min(10, Math.max(1, cart[index].qty + delta));
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

renderProducts();
