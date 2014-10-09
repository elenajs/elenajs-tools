define([
    'require',
    'elenajs/declare',
    'elenajs/fs/dfs',
    'dojo/Deferred',
    'dojo/node!path',
    './_Command',
    'elenajs/node!swig'
], function (
    require,
    declare,
    dfs,
    Deferred,
    path,
    _Command,
    swig) {

    var command = declare('_CreateCommand', _Command, {
        syncFolders: function (source, destination) {
            var self = this,
                dfd = new Deferred(),
                syncItems = [],
                errors = [],
                reject = function (err) {
                    dfd.reject(err);
                },
                fulfill = function () {
                    if (syncItems.every(function (item) {
                        return item.done;
                    })) {
                        if (errors.length) {
                            dfd.reject(errors);
                        } else {
                            dfd.resolve();
                        }
                    }
                };
            dfs.ensureDir(destination).then(function () {
                dfs.readdir(source).then(function (files) {
                    files.forEach(function (file) {
                        syncItems.push({
                            name: file,
                            tpl: path.resolve(source, file),
                            dest: path.resolve(destination, file),
                            done: false
                        });
                    });
                    syncItems.forEach(function (syncItem) {
                        dfs.stat(syncItem.tpl).then(function (stat) {
                            if (stat.isDirectory()) {
                                dfs.ensureDir(syncItem.dest).then(function () {
                                    self.syncFolders(syncItem.tpl, syncItem.dest).then(function () {
                                        syncItem.done = true;
                                        fulfill();
                                    }, function (err) {
                                        syncItem.done = true;
                                        errors = errors.concat(err);
                                        fulfill();
                                    });
                                }, function (err) {
                                    syncItem.done = true;
                                    errors = errors.concat(err);
                                    fulfill();
                                });
                            } else if (stat.isFile()) {
                                self.syncTemplate(syncItem.tpl, syncItem.dest).then(function () {
                                    syncItem.done = true;
                                    fulfill();
                                }, function (err) {
                                    syncItem.done = true;
                                    errors = errors.concat(err);
                                    fulfill();
                                });
                            } else {
                                syncItem.done = true;
                                fulfill();
                            }
                        }, function (err) {
                            syncItem.done = true;
                            errors = errors.concat(err);
                            fulfill();
                        });
                    });
                    //
                }, reject);
            }, reject);

            return dfd;
        },
        syncTemplate: function (source, dest) {
            var options = this.configuration,
                dfd = new Deferred();
            if (source.search(/-swig$/i) < 0) {
                dfs.copy(source, dest).then(function () {
                    dfd.resolve();
                }, function (err) {
                    dfd.reject(err);
                });
            } else {
                try {
                    var template = swig.compileFile(source);
                    dfs.writeFile(dest.replace(/-swig$/i, ""),
                        template(options)).then(function () {
                        dfd.resolve();
                    }, function (err) {
                        dfd.reject(err);
                    });
                } catch (err) {
                    dfd.reject(err);
                }
            }

            return dfd;
        },
        performCommand: function () {
            var self = this,
                options = this.configuration,
                dfd = new Deferred(),
                appPath = path.resolve(options.appName);

            self.syncFolders(this.templateDir, appPath).then(function () {
                dfd.resolve();
            }, function (err) {
                dfd.reject(err);
            });

            return dfd;
        }
    }, {
        'templateDir': {
            get: function () {
                if (!this._templateDir) {
                    this._templateDir = require.toUrl('./commands/createApp/templates');
                } 
                return this._templateDir;
            }
        }
    });
    return command;
});
