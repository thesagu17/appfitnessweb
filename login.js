document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // envía/recibe cookie de sesión
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    const msg = document.getElementById("msg");

    if (data.ok) {
      // ✅ Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.user));

      msg.textContent = "Ingresando…";
      msg.style.color = "green";

      window.location.href = "panel.html"; // redirige al panel
    } else {
      msg.textContent = data.message || "Correo o contraseña incorrectos";
      msg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    const msg = document.getElementById("msg");
    msg.textContent = "Error en el servidor";
    msg.style.color = "red";
  }
});
