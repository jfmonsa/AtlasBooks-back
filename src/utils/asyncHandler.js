// desc: This utility function is used to handle async functions in express routes
//       It is used to wrap async functions in a try catch block
export default function asyncHandler(controller) {
  return function (req, res, next) {
    return Promise.resolve(controller(req, res, next)).catch(next);
  };
}
