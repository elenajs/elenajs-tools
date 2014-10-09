if (typeof process !== 'undefined' && typeof define === 'undefined') {
    var ejs = require('elenajs'),
        path = require('path');
    var amdConfig = ejs.createConfig({
//        packages: [
//	    {
//		name: 'create-app',
//		location: path.resolve(__dirname, './commands/createApp')
//	    }
//	]
    }, path.resolve(__dirname, '../package.json'));

    ejs.require(amdConfig, [__filename]);

} else {
    require([
        'ejstools/dispatch'
    ], function (dispatch) {
        dispatch();
    });

//    require([
//        'elenajs/declare'
//    ], function (declare) {
//        var MyClass = declare('MyClass', null, {
//            sayHello: function () {
//                console.log('Hello ' + this.declaredClass);                
//            }
//        });
//        
//        console.log(MyClass.prototype.declaredClass);
//        var c = Object.create(MyClass.prototype);
//        c.sayHello();
//    });
}
