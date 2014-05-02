exports.bar = function (req, res, next) {
    console.log('This is middleware proccess for controller hello world method.');
    next();
}
