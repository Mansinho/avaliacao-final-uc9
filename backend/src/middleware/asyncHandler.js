/**
 * Envolve um controller assíncrono garantindo que qualquer rejeição de
 * Promise seja encaminhada para o errorHandler via next(err), em vez de
 * se tornar uma unhandled promise rejection (que em Node >= 15 derruba
 * o processo inteiro).
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
