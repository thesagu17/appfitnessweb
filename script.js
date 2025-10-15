const DEMO_EMAIL = 'demo@ejemplo.com';
const DEMO_PASS = '1234';
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const message = document.getElementById('message');
const toggle = document.getElementById('toggle');
const demoBtn = document.getElementById('demo');

// Mostrar mensajes de estado
function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = 'msg ' + (type === 'success' ? 'success' : 'error');
  message.style.display = 'block';
}

// Mostrar / ocultar contraseña
toggle.addEventListener('click', () => {
  if (password.type === 'password') {
    password.type = 'text';
    toggle.textContent = 'Ocultar';
  } else {
    password.type = 'password';
    toggle.textContent = 'Mostrar';
  }
});

// Autocompletar demo
if (demoBtn) {
  demoBtn.addEventListener('click', () => {
    email.value = DEMO_EMAIL;
    password.value = DEMO_PASS;
    showMessage('Credenciales demo completadas. Pulsa Entrar para continuar.', 'success');
  });
}

// Validar formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  message.style.display = 'none';

  if (!email.value || !password.value) {
    showMessage('Por favor completa ambos campos.');
    return;
  }

  if (!/.+@.+\..+/.test(email.value)) {
    showMessage('Introduce un correo válido.');
    return;
  }

  // Verificación de usuario
  if (email.value === DEMO_EMAIL && password.value === DEMO_PASS) {
    showMessage('Inicio de sesión correcto. Redirigiendo...', 'success');

    // Guardar el usuario en localStorage (opcional)
    localStorage.setItem('usuario', email.value);

    // Redirigir al panel
    setTimeout(() => {
      window.location.href = 'panel.html';
    }, 1000);
  } else {
    showMessage('Correo o contraseña incorrectos.');
  }
});
