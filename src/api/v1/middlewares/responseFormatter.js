// response formatter for response format consistency
// based on:
// 1. https://github.com/omniti-labs/jsend
// 2. https://quilltez.com/blog/maintaining-standard-rest-api-response-format-expressjs

export const responseFormatter = (_req, res, next) => {
  res.success = data => {
    res.status(200).json({
      success: true,
      data,
    });
  };
  next();
};
