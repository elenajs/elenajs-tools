define([
    'elenajs/declare',
    '../../_CreateCommand',
    'dojo/text!./usages/readme.md-swig',
    'elenajs/node!swig'
], function (
    declare,
    _CreateCommand,
    readme,
    swig) {

    var command = declare('create-app', _CreateCommand, {
        performCommand: declare.superCall(function (sup) {
            return function () {
                var configuration = this.configuration;
                if (configuration.elenajsVersion === '1') {
                    configuration.elenajsVersion = '';
                } else {
                    configuration.elenajsVersion = "https://github.com/elenajs/elenajs/archive/develop.tar.gz";
                }
                if (configuration.elenajsSwigVersion === '1') {
                    configuration.elenajsSwigVersion = '';
                } else {
                    configuration.elenajsSwigVersion = "https://github.com/elenajs/elenajs-swig/archive/develop.tar.gz";
                }
                return sup.call(this);
            };
        })
    }, {
        questions: {
            get: function () {
                var configuration = this.configuration,
                    noSpacevalidator = function (value) {
                        if (value.search(/\s/) >= 0) {
                            return 'No spaces allowed';
                        }
                        return false;
                    },
                    required = function (value) {
                        if (!value.replace(/\s/g, '')) {
                            return 'Value required';
                        }
                        return false;
                    };
                return {
                    'appName': {
                        'description': 'Application name',
                        question: 'Application name:> ',
                        reject: function (value) {
                            return required(value) || noSpacevalidator(value);
                        }
                    },
                    'amdName': {
                        defVal: configuration.appName,
                        description: 'AMD library name',
                        question: 'AMD library name [' + configuration.appName + ']:> ',
                        reject: noSpacevalidator
                    },
                    'elenajsVersion': {
                        defVal: '1',
                        description: 'ElenaJs library version (1 for latest stable, 2 for development)',
                        question: 'ElenaJs library version (1 for latest stable, 2 for development) [1]:> ',
                        reject: function (value) {
                            if (value && value.search(/^[1,2]$/) < 0) {
                                return 'Valid options are 1 or 2';
                            }
                            return false;
                        }
                    },
                    'elenajsSwigVersion': {
                        defVal: '1',
                        description: 'ElenaJs swig plugin version (1 for latest stable, 2 for development)',
                        question: 'ElenaJs swig plugin version (1 for latest stable, 2 for development) [1]:> ',
                        reject: function (value) {
                            if (value && value.search(/^[1,2]$/) < 0) {                                
                                return 'Valid options are 1 or 2';
                            }
                            return false;
                        }
                    },
                    'authorName': {
                        description: 'Author name',
                        question: 'Author name:> ',
                        reject: required
                    },
                    'authorEmail': {
                        description: 'Author email',
                        question: 'Author email:> ',
                        reject: noSpacevalidator
                    }
                };
            }
        },
        help: {
            get: function () {
                var questions = this.questions,
                    parameters = [];
                Object.keys(questions).forEach(function (key) {
                    var name = '--' + key,
                        description = questions[key].description || '';
                    parameters.push({
                        name: name,
                        description: description
                    });
                });
                return swig.render(readme, {locals: {parameters: parameters}});
            }
        }
    });
    return command;
});
