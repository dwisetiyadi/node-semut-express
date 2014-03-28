exports.bar = function (req, res, next) {
    console.log('hello world middleware');
    next();
}
