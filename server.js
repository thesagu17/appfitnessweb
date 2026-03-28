const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// -------- SERVIR ARCHIVOS ESTÁTICOS --------
app.use(express.static(path.join(__dirname, "public")));

// -------- CONFIGURAR CONEXIÓN A POSTGRES ----------
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "appfitnessweb+",
  password: "qwerty.123456",
  port: 5432
});

// =================================================
// 0) RUTA PRINCIPAL → index.html
// =================================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =================================================
// 1) REGISTRAR ACTIVIDAD
// =================================================
app.post("/registrar-actividad", async (req, res) => {
  try {
    const { user_id, type_id, nombre, duracion_min, calorias } = req.body;

    if (!user_id || !nombre || !duracion_min) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const query = `
      INSERT INTO actividades_registro (user_id, type_id, nombre, duracion_min, calorias)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      user_id,
      type_id || null,
      nombre,
      duracion_min,
      calorias || null
    ];

    const result = await pool.query(query, values);

    res.json({
      message: "Actividad registrada correctamente",
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar actividad" });
  }
});

// =================================================
// 2) REGISTRAR USUARIO
// =================================================
app.post("/api/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios" });
    }

    const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (existe.rows.length > 0) {
      return res.status(400).json({ ok: false, message: "Este correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios (nombre, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING user_id, nombre, email;
    `;

    const result = await pool.query(query, [nombre, email, hash]);

    res.json({
      ok: true,
      message: "Usuario registrado exitosamente",
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
});

// =================================================
// 3) LOGIN
// =================================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = "SELECT * FROM usuarios WHERE email = $1;";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ ok: false, message: "Correo no registrado" });
    }

    const user = result.rows[0];

    const passwordCorrecta = await bcrypt.compare(password, user.password_hash);

    if (!passwordCorrecta) {
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
    }

    res.json({
      ok: true,
      message: "Login exitoso",
      user: {
        user_id: user.user_id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
});


app.get("/api/tipo-actividades", async (req, res) => {
  try {
    const result = await pool.query("SELECT type_id, nombre FROM tipo_actividad ORDER BY type_id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error cargando tipo_actividad:", err);
    res.status(500).json({ error: "Error cargando actividades" });
  }
});

// =================================================
// 4) OBTENER ACTIVIDADES SOLO DEL USUARIO
// =================================================
app.get("/actividades", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Usuario no identificado" });
  }

  try {
    const result = await pool.query(
      `SELECT 
        a.activity_id,
        u.nombre AS usuario,
        t.nombre AS tipo_actividad,
        a.nombre,
        a.duracion_min,
        a.calorias,
        a.fecha
       FROM actividades_registro a
       JOIN usuarios u ON a.user_id = u.user_id
       LEFT JOIN tipo_actividad t ON a.type_id = t.type_id
       WHERE a.user_id = $1
       ORDER BY a.fecha DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener actividades" });
  }
});


// =================================================
// SERVIDOR
// =================================================
app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});
