define([
    'elenajs/declare',
    'elenajs/promise/sync',
    'dojo/Deferred',
    'elenajs/node!minimist',
    'elenajs/node!readline'
], function (declare, sync, Deferred, minimist, readline) {
    function throwAbstract() {
        throw new TypeError("abstract");
    }
    
    var command = declare('_Command', null, {
        configuration: {},
        
        performCommand: function (options) {
            throwAbstract();
        },
        performQuestion: function (rl, questionKey, defferredObject, _question_) {
            var self = this,
                question = _question_ || this.questions[questionKey];
                
            rl.question(question.question, function (response) {
                var rejectReason = question.reject && question.reject(response);
                if (rejectReason) {
                    console.error(rejectReason);
                    self.performQuestion(rl, questionKey, defferredObject, question);
                } else {
                    self.configuration[questionKey] = response || question.defVal;
                    defferredObject.resolve();
                }
            });
        },
        makeQuestions: function () {
            var self = this,
                result = new Deferred(),
                questions = this.questions,
                rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                }),
                questionPromises = Object.keys(questions).map(function (questionKey) {
                return function () {
                    var dfd = new Deferred();   
                    if (self.configuration[questionKey]) {
                        dfd.resolve();
                    } else {
                        self.performQuestion(rl, questionKey, dfd);
                    }
                    return dfd;
                };
            });
            sync(questionPromises).then(function () {
                rl.close();
                result.resolve();
            }, function (rejectReason) {
                rl.close();
                result.reject(rejectReason);
            });
            return result;
        },
        execute: function () {
            var self=this,
                arguments = minimist(process.argv.slice(2));

            if (arguments.h || arguments.help) {
                process.stdout.write(this.help);
                return;
            } else {
                this.configuration = arguments;
            } 

            this.makeQuestions().then(function () {
                self.performCommand().then(function () {
                    console.log('done!');
                }, function (err) {
                    console.error(err);
                });
            }, function (rejectReason) {
                console.error(rejectReason);
            });

        }
    }, {
        questions: {
            get: function () {
                throwAbstract();
            }
        },
        help: {
            get: function () {
                throwAbstract();
            }
        }
    });

    return command;
});
