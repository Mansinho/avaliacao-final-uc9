const app = require("./app");

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Sistema Financeiro rodando em http://localhost:${3000}`);
});
