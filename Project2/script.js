const signUpForm = document.getElementById("signup-form");
let userData = JSON.parse(localStorage.getItem("userAccounts")) || [];
signUpForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const usernameValue = document.getElementById("signup-username").value;
  const passwordValue = document.getElementById("signup-password").value;
  const emailValue = document.getElementById("signup-email").value;
  if (passwordValue.length < 6) {
    alert("The password should containe at least from 6 character ");
    return;
  }
  const emailExists = userData.find((user) => {
    return user.email === emailValue;
  });
  if (emailExists) {
    alert("هذا البريد الاكتروني موجود مسبقاً، الرجاء تسجيل الدخول ");
    return;
  }
  const newUser = {
    username: usernameValue,
    email: emailValue,
    password: passwordValue,
  };
  userData.push(newUser);
  localStorage.setItem("userAccounts", JSON.stringify(userData));
  alert("تم انشاء الحساب بنجاح!");
  signUpForm.reset();
});

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const loginPasswordValue = document.querySelector("#login-password").value;
  const loginEmailValue = document.querySelector("#login-email").value;
  const validUser = userData.find((user) => {
    return user.email === loginEmailValue;
  })
  if (!validUser) {
    alert("الحساب غير موجود، الرجاء انشاء حساب جديد.");
    return;
  }

  if (validUser.password === loginPasswordValue) {
    alert("تم التسجيل بنجاح! مرحبا بك يا " + validUser.username);
    localStorage.setItem("currentUser", JSON.stringify(validUser));
    loginForm.reset();
  } else {
    alert("كلمة المرور خاطئة!");
  }
});
