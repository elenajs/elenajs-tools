elenajs-tools
=============

This is a tool to create elenajs archetypes.

##INSTALLATION

The perferred way to install elenajs-tools is globally with

```
npm install -g elenajs-tools
```

##USAGE

To create an elenajs application just run the following command

```
ejs-tools create-app
```

It's possible to get help for the create-app command adding the option --help

##EXAMPLE

``` 
kiuma@kdominator ~/tmp $ ejs-tools 
ejs-tools

#USAGE

ejs-tools command <options|--help>

Available commands:
create-app
kiuma@kdominator ~/tmp $ ejs-tools create-app
Application name:> myApp
AMD library name [myApp]:> 
ElenaJs library version (1 for latest stable, 2 for development) [1]:> 2
ElenaJs swig plugin version (1 for latest stable, 2 for development) [1]:> 2
Author name:> kiuma
Author email:> kiuma@email
kiuma@kdominator ~/tmp $ cd myApp/
kiuma@kdominator ~/tmp/myApp $ npm update
elenajs-swig@0.0.2 node_modules/elenajs-swig
└── swig@1.4.2 (optimist@0.6.1, uglify-js@2.4.15)
elenajs@0.1.0 node_modules/elenajs
├── formidable@1.0.15
├── mimetype@0.0.5
├── dcl@1.1.1
├── fs-extra@0.12.0 (jsonfile@2.0.0, rimraf@2.2.8, ncp@0.6.0, mkdirp@0.5.0)
└── dojo@1.10.1
kiuma@kdominator ~/tmp/myApp $ node .
server started on port: 3030
```

You'll be able to browse your newly created application opening your browser at the following url:
*http://localhost:3030/*

Remember that the application is just a skeleton for your real application, it just avoids the annoying tasks needed when creating an application from scratch.
