document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (!user) {
    // 🔐 si no hay sesión
    window.location.href = "login.html";
    return;
  }

  // ✅ Mostrar nombre y correo
  document.getElementById("userName").textContent = user.nombre;
  document.getElementById("userEmail").textContent = user.email;
});
