# NativeScript-mambo-ble

This plugin is designed to communicate with Parrot Mambo drones.
It provides the functionality to scan, connect and issue various commands.


## Install the plugin
Call the following command from the root of your project.
```
tns plugin add nativescript-mambo-ble
```

## Getting started
Here is a brief overview of how to use this plugin.
For more advanced examples see:
[JS Core example](https://github.com/sebawita/nativescript-mambo-ble/tree/master/demo)
[ng2 example](https://github.com/sebawita/nativescript-mambo-ble/tree/master/demo-ng)


## Making changes to the plugin
If you want to make changes to the plugin, you need first set up your environment correctly.
First run at the root first, which will let you then use the demo projects. 
```
tns install
```


### To rebuild the plugin for the JavaScript core `demo` project

```
npm run preparedemo
```

### To rebuild the plugin for the angular `demo-ng` project

```
npm run preparedemo-ng
```

### To run the demo project:

```
cd demo

tns platform add android
tns run android

and/or

tns platform add ios
tns platform run ios
```

### To run the demo-ng project:

```
cd demo-ng

tns platform add android
tns run android

and/or

tns platform add ios
tns platform run ios
```
