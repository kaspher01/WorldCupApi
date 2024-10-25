export const checkHeaders = (req, res, next) => {
    const errors = [];
  
    const contentType = req.get("Content-Type");
    if (contentType !== "application/json") {
        errors.push(contentType);
      errors.push("Content-Type must be application/json");
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
      return res.status(404).json({ message: "Header validation errors", errors });
    }
  
    next();
  };
  