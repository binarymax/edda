# Edda

Output generator for restlang

## Installation

```
npm install edda
```

## Usage

Currently there is only one way to run Edda:
```
var edda = require('edda');
edda.run(path,template,data,settings,callback);
```

Edda expects the following arguments:

- ```path```: The path to a directory that contains restlang source files (*.rest)
- ```template```:  The filename of an underscore template file.  ```_.template``` is used to generate the output.
- ```data```: An object containing any additional data that is used by the above template
- ```settings```: An object containing any Underscore settings (for example custom template interpolation)
- ```callback```: A callback that will be called when the process is complete, passing err (array of any errors) and out (array of output)

## Restlang

Edda was built specifically to generate target output from the Restlang parser.  For more information on Restlang see https://github.com/binarymax/restlang.

##### _Made with love by Max Irwin (http://binarymax.com)_