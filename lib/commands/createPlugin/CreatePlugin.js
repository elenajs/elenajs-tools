define([
    'require',
    'elenajs/declare',
    '../../_CreateCommand',
    'dojo/text!./usages/readme.md-swig',
    'elenajs/node!swig'
], function (
    require,
    declare,
    _CreateCommand,
    readme,
    swig) {

    var command = declare('create-plugin', _CreateCommand, {
        performCommand: declare.superCall(function (sup) {
            return function () {
                var configuration = this.configuration;
                
                return sup.call(this);
            };
        })
    }, {
        readme: {
            get: function () {
                return readme;
            }
        },
        'templateDir': {
            get: function () {
                if (!this._templateDir) {
                    this._templateDir = require.toUrl('./templates');
                }
                return this._templateDir;
            }
        },
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
                        'description': 'ElenaJS module name',
                        question: 'ElenaJS module name:> ',
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
        }
    });
    return command;
});
