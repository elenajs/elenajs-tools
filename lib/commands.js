define([
    'elenajs/declare'
], function(declare) {
  
    var Commands = declare('Commands',null, {
        cache: {},
        register: function(commandClass) {
            var name = commandClass.declaredClass;
            if (!this.cache[name]) {
                this.cache[name] = commandClass;
            }
        },
        list: function () {
            return Object.keys(this.cache).sort();
        },
        get: function (name) {
            return this.cache[name];
        }
    });
    
    return new Commands();
});