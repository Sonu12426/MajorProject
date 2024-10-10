// module.exports = (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(next);
//     }
// };

module.exports = (fn) => {
    return function (req, res, next) {
      if (typeof fn !== 'function') {
        console.error('wrapAsync: fn is not a function');
        return next(new Error('wrapAsync: fn is not a function'));
      }
      fn(req, res, next).catch(next);
    };
  };
  