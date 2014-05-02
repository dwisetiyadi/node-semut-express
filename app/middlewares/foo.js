exports.bar = function (req, res, next) {
    console.log('this is middleware proccess for controller hello method world');
    next();
}
