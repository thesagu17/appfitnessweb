document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });

  const data = await res.json();

  if (!data.ok) {
    msg.textContent = data.message;
    msg.style.color = "red";
    return;
  }

  msg.textContent = "Usuario registrado correctamente. Redirigiendo...";
  msg.style.color = "green";

  setTimeout(() => {
    window.location.href = "/index.html";
  }, 1200);
});
