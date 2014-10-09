define([
    'ejstools/commands',
    'dojo/text!./doc/usage.md',
    './commands/createApp/main'
], function(commands, usage) {
    var printUsage = function () {
        console.log(usage);
        console.log('\nAvailable commands:\n' + commands.list().join(', '));
    };
    
    return function() {
        var command;
        if (process.argv.length >= 3) {
            var commandName = process.argv[2].toLowerCase();

            command = commands.get(commandName);
            
            
        } 
        
        if (command) {
            command.execute();
        } else {
            printUsage();
            process.exit(-1);
        }
    };
});
