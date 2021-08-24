class _Error {
    guard() {
        return process.on("unhandledRejection", (err, promise) => {
            // this.log("#", `_Handler:>> Unhandled Promise Rejection[Promise: ${promise.toString()}|Error: '${err}]'`, 5);
            console.log("An unhandled exception occurred! :>>", err);
        });
    };

};


module.exports = new _Error();