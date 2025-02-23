const notFoundMiddleware = (req, res) => res.status(404).json({message: `Route does not found - ${req.originalUrl}`}); 

module.exports = notFoundMiddleware;