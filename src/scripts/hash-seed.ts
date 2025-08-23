import bcrypt from "bcrypt";

(async () => {
  const hash = await bcrypt.hash("1234", 10);  // puedes cambiar "1234" por otra clave
  console.log("HASH:", hash);
})();
