export const checkHeaders = (req, res, next) => {
    const errors = [];

    const contentType = req.get("accept");

    if (contentType !== "application/json") {
      errors.push("Accept header must be application/json");
    }
  
    const rateLimit = req.get("X-Rate-Limit");
    if (!rateLimit || isNaN(rateLimit)) {
      errors.push("Missing or invalid 'X-Rate-Limit' header");
    }
  
    const requestId = req.get("X-Request-ID");
    if (!requestId) {
      errors.push("Missing 'X-Request-ID' header");
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ message: "Header validation errors", errors });
    }
  
    next();
  };
  