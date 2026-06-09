let counter = 0;
let total = 0;
let cartData = []; // المصفوفة الأساسية

// 1. نجلب النص المحفوظ من الذاكرة ونخزنه في متغير
const savedCartText = localStorage.getItem("myCart");

// 2. نتحقق هل البيانات موجودة فعلاً؟ (ليست مفقودة null)
if (savedCartText !== null) {
  // 3. نفك تغليف النص ونحفظ المصفوفة الحقيقية داخل متغير السلة الخاص بنا
  cartData = JSON.parse(savedCartText);
}
// ... (كود قراءة الذاكرة الموجود عندك في الأعلى) ...
if (savedCartText !== null) {
  cartData = JSON.parse(savedCartText);
}

// ==========================================
// الكود السحري: إعادة بناء الواجهة من الذاكرة بعد التحديث
// ==========================================
if (cartData.length > 0) {
  // 1. إخفاء رسالة السلة الفارغة
  const emptyMsgElement = document.querySelector(".empty-msg");
  if (emptyMsgElement) {
    emptyMsgElement.remove();
  }

  // 2. المرور على المنتجات المحفوظة ورسمها على الشاشة
  cartData.forEach((item) => {
    // تحديث العدادات
    counter += item.quantity;
    total += item.price * item.quantity;

    // بناء عنصر المنتج
    const listItem = document.createElement("li");
    listItem.id = `cart-item-${item.id}`;
    listItem.setAttribute("data-price", item.price);

    listItem.innerHTML = `
            <span>${item.name}</span>
            <span>الكمية: <span class="item-quantity">${item.quantity}</span></span>
        `;

    // بناء زر الحذف الخاص به
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.addEventListener("click", function () {
      const itemToRemove = this.parentElement;
      const quantitySpan = itemToRemove.querySelector(".item-quantity");
      let currentQuantity = Number(quantitySpan.textContent);

      const itemPrice = Number(itemToRemove.getAttribute("data-price"));
      total -= itemPrice;
      document.querySelector("#total-price").textContent = total;
      counter--;
      document.querySelector("#cart-count").textContent = counter;

      if (currentQuantity === 1) {
        itemToRemove.remove();
      } else {
        quantitySpan.textContent = currentQuantity - 1;
      }
      // ==========================================
      // ثالثاً: حذف أو تحديث المنتج من المصفوفة والذاكرة
      // ==========================================

      // 1. استخراج الـ ID الخاص بالمنتج (نأخذه من id العنصر الأب الذي برمجناه سابقاً)
      const currentProductId = itemToRemove.id.replace("cart-item-", "");

      if (currentQuantity === 1) {
        // طرد المنتج بالكامل من المصفوفة لأن الكمية أصبحت صفر
        cartData = cartData.filter(function (item) {
          return item.id !== currentProductId; // احتفظ بكل شيء ما عدا هذا الـ ID
        });

        // إضافة لمسة احترافية: إذا أصبحت السلة فارغة تماماً، أعد رسالة "السلة فارغة"
        if (cartData.length === 0) {
          const emptyMsg = document.createElement("li");
          emptyMsg.className = "empty-msg";
          emptyMsg.textContent = "السلة فارغة حالياً";
          document.getElementById("cart-items").appendChild(emptyMsg);
        }
      } else {
        // إذا كانت الكمية أكثر من 1، نبحث عن المنتج في المصفوفة وننقص كميته فقط
        let itemInArray = cartData.find(function (item) {
          return item.id === currentProductId;
        });

        if (itemInArray) {
          itemInArray.quantity -= 1;
        }
      }

      // 2. أخيراً: احفظ المصفوفة الجديدة في الـ localStorage ليعتمد التحديث
      localStorage.setItem("myCart", JSON.stringify(cartData));
    });

    listItem.appendChild(deleteBtn);
    document.getElementById("cart-items").appendChild(listItem);
  });

  // 3. طباعة الأرقام النهائية على الشاشة
  document.querySelector("#cart-count").textContent = counter;
  document.querySelector("#total-price").textContent = total;
}

// ... (هنا يبدأ كود const addToCartBtn وباقي ملفك) ...
const addToCartBtn = document.querySelectorAll(".add-to-cart-btn");
const cartCount = document.querySelector("#cart-count");
const totalPrice = document.querySelector("#total-price");
const emptyMsg = document.querySelector(".empty-msg");

addToCartBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const clickedBtn = e.target;
    const card = clickedBtn.parentElement;

    // --- 1. جلب القيم الصافية (نصوص وأرقام وليست عناصر HTML) ---
    const nameProductElement = card.querySelector(".product-name");
    const priceProductElement = card.querySelector(".product-price");
    const productId = card.getAttribute("data-id");

    const productNameText = nameProductElement.textContent;
    const itemPriceNumber = Number(
      priceProductElement.textContent.replace("$", ""),
    );

    // ==========================================
    // أولاً: التعامل مع البيانات (المصفوفة والذاكرة)
    // ==========================================

    // نبحث: هل المنتج موجود في المصفوفة؟
    let existingItemInArray = cartData.find(function (item) {
      return item.id === productId;
    });

    if (existingItemInArray) {
      // إذا موجود، نزيد الكمية في المصفوفة فقط
      existingItemInArray.quantity += 1;
    } else {
      // إذا جديد، نضيفه ككائن جديد للمصفوفة
      cartData.push({
        id: productId,
        name: productNameText,
        price: itemPriceNumber,
        quantity: 1,
      });
    }

    // الآن المصفوفة محدثة، نقوم بتغليفها وحفظها في الذاكرة فوراً!
    localStorage.setItem("myCart", JSON.stringify(cartData));

    // ==========================================
    // ثانياً: التعامل مع واجهة المستخدم (الـ HTML)
    // ==========================================

    // 1. تحديث العداد العلوي والإجمالي
    counter++;
    cartCount.textContent = counter;
    total += itemPriceNumber;
    totalPrice.textContent = total;

    if (emptyMsg) {
      emptyMsg.remove();
    }

    // 2. تحديث السلة في الشاشة (نفس كودك المنطقي الممتاز)
    const existingItemInHTML = document.querySelector(
      `#cart-item-${productId}`,
    );

    if (existingItemInHTML) {
      const quantitySpan = existingItemInHTML.querySelector(".item-quantity");
      let currentQuantity = Number(quantitySpan.textContent);
      quantitySpan.textContent = currentQuantity + 1;
    } else {
      const listItem = document.createElement("li");
      listItem.id = `cart-item-${productId}`;

      // إضافة السعر كبيانات مخفية لنسهّل عملية الحذف لاحقاً
      listItem.setAttribute("data-price", itemPriceNumber);

      listItem.innerHTML = `
                <span>${productNameText}</span>
                <span>الكمية: <span class="item-quantity">1</span></span>
            `;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";

      deleteBtn.addEventListener("click", function () {
        const itemToRemove = this.parentElement;
        const quantitySpan = itemToRemove.querySelector(".item-quantity");
        let currentQuantity = Number(quantitySpan.textContent);

        // نقصان العدادات العامة (للشاشة)
        const itemPrice = Number(itemToRemove.getAttribute("data-price"));
        total -= itemPrice;
        totalPrice.textContent = total;
        counter--;
        cartCount.textContent = counter;

        if (currentQuantity === 1) {
          itemToRemove.remove();
        } else {
          quantitySpan.textContent = currentQuantity - 1;
        }
        // ==========================================
        // ثالثاً: حذف أو تحديث المنتج من المصفوفة والذاكرة
        // ==========================================

        // 1. استخراج الـ ID الخاص بالمنتج (نأخذه من id العنصر الأب الذي برمجناه سابقاً)
        const currentProductId = itemToRemove.id.replace("cart-item-", "");

        if (currentQuantity === 1) {
          // طرد المنتج بالكامل من المصفوفة لأن الكمية أصبحت صفر
          cartData = cartData.filter(function (item) {
            return item.id !== currentProductId; // احتفظ بكل شيء ما عدا هذا الـ ID
          });

          // إضافة لمسة احترافية: إذا أصبحت السلة فارغة تماماً، أعد رسالة "السلة فارغة"
          if (cartData.length === 0) {
            const emptyMsg = document.createElement("li");
            emptyMsg.className = "empty-msg";
            emptyMsg.textContent = "السلة فارغة حالياً";
            document.getElementById("cart-items").appendChild(emptyMsg);
          }
        } else {
          // إذا كانت الكمية أكثر من 1، نبحث عن المنتج في المصفوفة وننقص كميته فقط
          let itemInArray = cartData.find(function (item) {
            return item.id === currentProductId;
          });

          if (itemInArray) {
            itemInArray.quantity -= 1;
          }
        }

        // 2. أخيراً: احفظ المصفوفة الجديدة في الـ localStorage ليعتمد التحديث
        localStorage.setItem("myCart", JSON.stringify(cartData));
        // ملاحظة: ستحتاج لاحقاً لكتابة كود هنا لحذف المنتج من المصفوفة أيضاً (سندرسها في الخطوة القادمة)
      });

      listItem.appendChild(deleteBtn);
      document.getElementById("cart-items").appendChild(listItem);
    }
  });
});
