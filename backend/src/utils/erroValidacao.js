/**
 * Erro de negócio/validação. Sempre deve resultar em resposta 400,
 * nunca em um crash da aplicação.
 */
class ErroValidacao extends Error {
  constructor(mensagem, campo = null) {
    super(mensagem);
    this.name = "ErroValidacao";
    this.campo = campo;
    this.statusCode = 400;
  }
}

module.exports = ErroValidacao;
