const products = [
  {
    id: "mask",
    name: "Silk Renewal Hair Mask",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    description: "An ultra-rich treatment mask that restores shine and softness in minutes.",
  },
  {
    id: "oil",
    name: "Radiance Hair Oil",
    price: 24,
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    description: "Lightweight argan blend to seal moisture and add glass-like gloss.",
  },
  {
    id: "serum",
    name: "Frizz Shield Hair Serum",
    price: 26,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
    description: "Humidity-blocking serum that smooths and protects styled hair.",
  },
  {
    id: "shampoo",
    name: "Hydra Balance Shampoo",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
    description: "Creamy sulfate-free cleanse that leaves hair bouncy and hydrated.",
  },
  {
    id: "leavein",
    name: "Daily Dew Leave-In",
    price: 20,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    description: "All-day moisture mist for detangling and heat protection.",
  },
];

const cartKey = "luxehair_cart";
const ordersKey = "luxehair_orders";

const views = {
  shop: document.getElementById("shop-view"),
  product: document.getElementById("product-view"),
  checkout: document.getElementById("checkout-view"),
  admin: document.getElementById("admin-view"),
};

const cartCountEl = document.getElementById("cart-count");
const productGrid = document.getElementById("product-grid");
const productDetails = document.getElementById("product-details");
const cartContainer = document.getElementById("cart-container");
const orderForm = document.getElementById("order-form");
const submitOrderBtn = document.getElementById("submit-order");
const orderConfirmation = document.getElementById("order-confirmation");
const ordersTableBody = document.getElementById("orders-table-body");
const orderDetails = document.getElementById("order-details");

const adminPassword = "luxe123";

const formatPrice = (value) => `$${value.toFixed(2)}`;

const getCart = () => JSON.parse(localStorage.getItem(cartKey) || "[]");
const saveCart = (cart) => localStorage.setItem(cartKey, JSON.stringify(cart));
const getOrders = () => JSON.parse(localStorage.getItem(ordersKey) || "[]");
const saveOrders = (orders) => localStorage.setItem(ordersKey, JSON.stringify(orders));

const triggerPulse = (element) => {
  element.classList.remove("pulse");
  void element.offsetWidth;
  element.classList.add("pulse");
};

const updateCartCount = () => {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = count;
};

const addToCart = (productId, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
  updateCartCount();
  triggerPulse(cartCountEl);
};

const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCount();
  renderCart();
};

const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
    updateCartCount();
    renderCart();
  }
};

const revealElements = (container) => {
  if (!container) return;
  const elements = Array.from(container.querySelectorAll(".animate-item"));
  elements.forEach((element, index) => {
    element.classList.remove("is-visible");
    setTimeout(() => {
      element.classList.add("is-visible");
    }, 80 + index * 70);
  });
};

const renderProductGrid = () => {
  productGrid.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card animate-item";
    card.addEventListener("click", () => {
      location.hash = `#product-${product.id}`;
    });

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <h3>${product.name}</h3>
      <p class="price">${formatPrice(product.price)}</p>
      <div class="card-actions">
        <button class="btn btn-primary" type="button">Add to Cart</button>
        <span class="pill">View</span>
      </div>
    `;

    card.querySelector("button").addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(product.id, 1);
    });

    productGrid.appendChild(card);
  });
  revealElements(productGrid);
};

const renderProductDetails = (productId) => {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  productDetails.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <div class="detail-info">
      <h2>${product.name}</h2>
      <p class="price">${formatPrice(product.price)}</p>
      <p style="color: var(--muted);">${product.description}</p>
      <div class="quantity-selector">
        <button type="button" id="decrease-qty">-</button>
        <input type="number" id="quantity-input" min="1" value="1" />
        <button type="button" id="increase-qty">+</button>
      </div>
      <button class="btn btn-primary" id="add-qty-cart">Add to Cart</button>
    </div>
  `;

  productDetails.querySelectorAll("img, .detail-info").forEach((element) => {
    element.classList.add("animate-item");
  });

  revealElements(productDetails);

  const qtyInput = document.getElementById("quantity-input");
  document.getElementById("decrease-qty").addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });
  document.getElementById("increase-qty").addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value, 10) + 1;
  });
  document.getElementById("add-qty-cart").addEventListener("click", () => {
    const quantity = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    addToCart(product.id, quantity);
  });
};

const renderCart = () => {
  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML =
      "<div class='order-summary animate-item'><p>Your cart is empty. Add products to continue.</p></div>";
    revealElements(cartContainer);
    return;
  }

  const rows = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      const subtotal = product.price * item.quantity;
      return `
        <tr>
          <td>${product.name}</td>
          <td>${formatPrice(product.price)}</td>
          <td>
            <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="cart-qty" style="width: 70px;" />
          </td>
          <td>${formatPrice(subtotal)}</td>
          <td><button class="btn btn-outline remove-item" data-id="${item.id}">Remove</button></td>
        </tr>
      `;
    })
    .join("");

  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartContainer.innerHTML = `
    <div class="animate-item">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div style="display: flex; justify-content: flex-end; margin-top: 12px; font-weight: 600;">
        Total: ${formatPrice(total)}
      </div>
    </div>
  `;

  cartContainer.querySelectorAll(".cart-qty").forEach((input) => {
    input.addEventListener("change", (event) => {
      const value = parseInt(event.target.value, 10) || 1;
      updateCartQuantity(event.target.dataset.id, value);
    });
  });

  cartContainer.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.id));
  });

  revealElements(cartContainer);
};

const showView = (viewKey) => {
  Object.values(views).forEach((view) => view.classList.add("hidden"));
  const view = views[viewKey];
  view.classList.remove("hidden");
  view.classList.remove("fade-in");
  void view.offsetWidth;
  view.classList.add("fade-in");
};

const validateField = (field) => {
  const value = field.value.trim();
  let message = "";
  if (!value) {
    message = "This field is required.";
  }
  if (field.name === "phone" && value) {
    const isValid = /^[0-9+()\-\s]{7,}$/.test(value);
    if (!isValid) {
      message = "Enter a valid phone number.";
    }
  }
  const errorEl = field.parentElement.querySelector(".error-message");
  errorEl.textContent = message;
  return message === "";
};

const validateForm = () => {
  const fields = Array.from(orderForm.querySelectorAll("input"));
  const isValid = fields.every((field) => validateField(field));
  submitOrderBtn.disabled = !isValid || getCart().length === 0;
  return isValid;
};

const handleSubmitOrder = (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const cart = getCart();
  if (cart.length === 0) return;

  const formData = new FormData(orderForm);
  const customer = Object.fromEntries(formData.entries());
  const orderId = `LH-${Date.now().toString(36).toUpperCase()}`;
  const items = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return {
      id: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
    };
  });
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    id: orderId,
    timestamp: new Date().toISOString(),
    status: "New",
    customer,
    items,
    total,
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  localStorage.removeItem(cartKey);
  updateCartCount();
  renderCart();
  orderForm.reset();
  validateForm();

  orderConfirmation.innerHTML = `
    <div class="success-banner animate-item">
      <strong>Order placed successfully!</strong>
      <p>Your reference ID is <strong>${orderId}</strong>.</p>
    </div>
  `;
  revealElements(orderConfirmation);
  renderOrders();
};

const renderOrders = () => {
  const orders = getOrders();
  ordersTableBody.innerHTML = orders
    .map((order) => {
      const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
      const address = `${order.customer.city}, ${order.customer.street}`;
      const date = new Date(order.timestamp).toLocaleString();
      return `
        <tr data-id="${order.id}">
          <td>${order.id}</td>
          <td>${date}</td>
          <td>${customerName}</td>
          <td>${order.customer.phone}</td>
          <td>${address}</td>
          <td>${formatPrice(order.total)}</td>
          <td>${order.status}</td>
        </tr>
      `;
    })
    .join("");

  ordersTableBody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => showOrderDetails(row.dataset.id));
  });
};

const showOrderDetails = (orderId) => {
  const orders = getOrders();
  const order = orders.find((entry) => entry.id === orderId);
  if (!order) return;

  const itemsList = order.items
    .map((item) => `<li>${item.quantity} × ${item.name} (${formatPrice(item.price)})</li>`)
    .join("");

  orderDetails.innerHTML = `
    <h3>Order ${order.id}</h3>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
    <p><strong>Customer:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
    <p><strong>Phone:</strong> ${order.customer.phone}</p>
    <p><strong>Address:</strong> ${order.customer.city}, ${order.customer.street}</p>
    <h4 style="margin-top: 12px;">Items</h4>
    <ul style="margin-left: 18px;">${itemsList}</ul>
    <p style="margin-top: 12px;"><strong>Total:</strong> ${formatPrice(order.total)}</p>
  `;
};

const ensureAdminAccess = () => {
  if (sessionStorage.getItem("adminAuth") === "true") {
    return true;
  }
  const password = prompt("Enter admin password:");
  if (password === adminPassword) {
    sessionStorage.setItem("adminAuth", "true");
    return true;
  }
  alert("Incorrect password.");
  location.hash = "#shop";
  return false;
};

const handleRoute = () => {
  const hash = location.hash || "#shop";
  if (hash.startsWith("#product-")) {
    const productId = hash.replace("#product-", "");
    showView("product");
    renderProductDetails(productId);
    return;
  }
  if (hash === "#checkout") {
    showView("checkout");
    renderCart();
    validateForm();
    return;
  }
  if (hash === "#admin") {
    if (!ensureAdminAccess()) return;
    showView("admin");
    renderOrders();
    return;
  }
  showView("shop");
  revealElements(document.getElementById("shop-view"));
};

document.getElementById("continue-shopping").addEventListener("click", () => {
  location.hash = "#shop";
});

document.getElementById("go-checkout").addEventListener("click", () => {
  location.hash = "#checkout";
});

document.getElementById("start-shopping").addEventListener("click", () => {
  location.hash = "#shop";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

orderForm.addEventListener("input", validateForm);
orderForm.addEventListener("submit", handleSubmitOrder);

window.addEventListener("hashchange", handleRoute);

document.querySelectorAll(".hero-card").forEach((card) => {
  card.classList.add("animate-item");
});

document.querySelectorAll(".order-summary").forEach((panel) => {
  panel.classList.add("animate-item");
});

renderProductGrid();
updateCartCount();
handleRoute();
