import bcrypt from "bcrypt";

const run = async () => {
  const hash = await bcrypt.hash("1234", 10); // aquí pones la contraseña que quieres
  console.log(hash);
};

run();
