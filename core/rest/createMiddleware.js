/**
 * @param {Class} ControllerClass
 * @returns {Function}
 */
function createMiddleware(ControllerClass) {
  return async (req, res, next) => {
    const controller = new ControllerClass(req, res, next);

    await controller.handleRequest();
  };
}

module.exports = createMiddleware;
