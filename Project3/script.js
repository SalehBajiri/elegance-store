let cart = JSON.parse(localStorage.getItem("mainCart")) || [];
const productsDB = [
  {
    id: "p1",
    name: "سماعات رأس لاسلكية",
    nameEn: "Wireless Headphones",
    price: 250,
    category: "صوتيات",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    id: "p2",
    name: "ساعة ذكية رياضية",
    nameEn: "Sport Smartwatch",
    price: 450,
    category: "ساعات",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
  },
  {
    id: "p3",
    name: "كاميرا احترافية 4K",
    nameEn: "4K Camera",
    price: 1200,
    category: "تصوير",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  },
  {
    id: "p4",
    name: "لابتوب فائق النحافة",
    nameEn: "Ultra-Slim Laptop",
    price: 3500,
    category: "حواسيب",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
  },
  {
    id: "p5",
    name: "لوحة مفاتيح ميكانيكية",
    nameEn: "Mechanical Keyboard",
    price: 320,
    category: "إكسسوارات",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
  },
  {
    id: "p6",
    name: "ماوس ألعاب لاسلكي",
    nameEn: "Gaming Mouse",
    price: 180,
    category: "إكسسوارات",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
  },
];
const eleganceDialog = document.getElementById("elegance-dialog");
const dialogMessage = document.getElementById("dialog-message");
const dialogCloseBtn = document.getElementById("dialog-close-btn");
const cartCounter = document.querySelector("#cart-badge");

dialogCloseBtn.addEventListener("click", () => {
  eleganceDialog.close();
});

function showCustomAlert(text) {
  dialogMessage.textContent = text;
  eleganceDialog.showModal();

  setTimeout(() => {
    if (eleganceDialog.open) {
      eleganceDialog.close();
    }
  }, 5000);
}

function setupAddButton() {
  const addToCartButtons = document.querySelectorAll(".add-btn");
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const prodID = e.target.dataset.id;
      const prodName = e.target.dataset.name;
      const prodPrice = Number(e.target.dataset.price);
      const existingItem = cart.find((item) => {
        return item.ID === prodID;
      });

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({
          ID: prodID,
          name: prodName,
          price: prodPrice,
          qty: 1,
        });
      }
      localStorage.setItem("mainCart", JSON.stringify(cart));
      updateCartBadge();
    });
  });
}

function updateCartBadge() {
  let totalQty = 0;
  cart.forEach((item) => {
    totalQty += item.qty;
  });
  cartCounter.textContent = totalQty;
}

function renderCartItem() {
  const totalItemSpan = document.getElementById("total-items");
  const cartContainer = document.getElementById("cart-items");
  const totalPriceSpan = document.getElementById("total-price");

  if (!cartContainer) return;

  let cartHTML = "";
  let totalPrice = 0;
  let totalItem = 0;

  cart.forEach((item) => {
    cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ر.س</p>
                </div>
                <div class="item-controls">
                    <button class="increase-btn" data-id="${item.ID}">+</button>
                    <span class="qty-display">${item.qty}</span>
                    <button class="decrease-btn" data-id="${item.ID}">-</button>
                    <button class="remove-btn" data-id="${item.ID}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    totalPrice += item.price * item.qty;
    totalItem += item.qty;
  });

  updateCartBadge();
  cartContainer.innerHTML = cartHTML;
  totalPriceSpan.innerHTML = totalPrice;
  totalItemSpan.innerHTML = totalItem;

  const removeBtns = document.querySelectorAll(".remove-btn");
  const increaseBtns = document.querySelectorAll(".increase-btn");
  const decreaseBtns = document.querySelectorAll(".decrease-btn");

  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const removeID = e.currentTarget.dataset.id;

      cart = cart.filter((item) => {
        return item.ID !== removeID;
      });

      localStorage.setItem("mainCart", JSON.stringify(cart));

      renderCartItem();
    });
  });

  increaseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const increaseID = e.currentTarget.dataset.id;
      const existingItem = cart.find((item) => {
        return item.ID === increaseID;
      });
      if (existingItem) {
        existingItem.qty += 1;
      }

      localStorage.setItem("mainCart", JSON.stringify(cart));
      renderCartItem();
    });
  });

  decreaseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const decreaseID = e.currentTarget.dataset.id;
      const existingItem = cart.find((item) => {
        return item.ID === decreaseID;
      });
      if (existingItem) {
        if (existingItem.qty > 1) {
          existingItem.qty -= 1;
        }
      }
      localStorage.setItem("mainCart", JSON.stringify(cart));
      renderCartItem();
    });
  });
}

function renderProductsPage() {
  const productContainer = document.getElementById("products-page-grid");
  if (!productContainer) return;
  let productHTML = "";
  productsDB.forEach((product) => {
    productHTML += `<div class="product-card">
          <div class="product-img">
              <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
              <p class="category">${product.category}</p>
              <h3 class="title">${product.name}</h3>
              <h3 class="title-en">${product.nameEn}</h3>
              <div class="price-row">
                  <span class="price">${product.price} ر.س</span>
              </div>
              <button class="add-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                  <i class="fa-solid fa-plus"></i> أضف للسلة
              </button>
          </div>
      </div>`;
  });
  productContainer.innerHTML = productHTML;
}

function setupCheckout() {
  const paymentForm = document.getElementById("payment-form");
  if (!paymentForm) return;

  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const custName = document.getElementById("cust-name").value;
    showCustomAlert(
      "تم استلام طلبك بنجاح يا " + custName + "! شكراً لتسوقك معنا.",
    );

    cart = [];
    localStorage.setItem("mainCart", JSON.stringify(cart));
    updateCartBadge();
    window.location.href = "index.html";
  });
}

function setupAuth() {
  const authPage = document.querySelector(".auth-page");
  if (!authPage) return;

  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  tabRegister.addEventListener("click", () => {
    tabLogin.classList.remove("active");
    loginForm.classList.remove("active");

    tabRegister.classList.add("active");
    registerForm.classList.add("active");
  });

  tabLogin.addEventListener("click", () => {
    tabRegister.classList.remove("active");
    registerForm.classList.remove("active");

    tabLogin.classList.add("active");
    loginForm.classList.add("active");
  });

  let usersDB = JSON.parse(localStorage.getItem("usersDB")) || [];

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;

    const existingUser = usersDB.find((u) => u.email === email);
    if (existingUser) {
      showCustomAlert("هذا البريد الإلكتروني مسجل مسبقاً!");
      return;
    }

    usersDB.push({ name: name, email: email, pass: pass });
    localStorage.setItem("usersDB", JSON.stringify(usersDB));

    showCustomAlert("تم إنشاء الحساب بنجاح! تفضل بتسجيل الدخول.");

    registerForm.reset();
    tabLogin.click();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;

    const validUser = usersDB.find((u) => u.email === email && u.pass === pass);

    if (validUser) {
      localStorage.setItem("currentUser", JSON.stringify(validUser));
      localStorage.setItem(
        "flashMessage",
        "مرحباً بك يا " + validUser.name + "!",
      );
      window.location.href = "index.html";
    } else {
      showCustomAlert(
        "بيانات الدخول خاطئة، يرجى التأكد من صحة البريد الالكتروني أو كلمة المرور!",
      );
    }
  });
}

function checkAuthState() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userNavLink = document.getElementById("user-nav-link");
  const userNavName = document.getElementById("user-nav-name");
  const userNavSub = document.getElementById("user-nav-sub");
  const userNavIcon = document.getElementById("user-nav-icon");
  if (!userNavLink) return;

  if (currentUser) {
    userNavName.textContent = currentUser.name;
    userNavSub.textContent = "خروج | Logout";
    userNavLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      localStorage.setItem(
        "flashMessage",
        "تم تسجيل خروجك بنجاح، نراك قريباً!",
      );
      window.location.reload();
    });
  }
}

function checkFlashMessage() {
  const flashMessage = localStorage.getItem("flashMessage");
  if (flashMessage) {
    showCustomAlert(flashMessage);
    localStorage.removeItem("flashMessage");
  }
}

checkFlashMessage();
renderCartItem();
checkAuthState();
setupAuth();
setupCheckout();
renderProductsPage();
setupAddButton();
updateCartBadge();
