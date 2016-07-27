# Custom Language

This is a custom toy language that I put together as an exercise. The interpreter uses a recursive descent parser and runs in node.

The language is entirely contained in `interpreter.js`. You can interpret a file by running somthing like this: `node interpreter.js path/to/file.hh`

# Syntax

The only construct the language supports is the function call. It uses postfix notation. Arguments are sandwiched between `:` and `;` .


## example

this:

    : 'Hello, World!' ; print

writes this to standard out:

    Hello, World!

# Types

Since I wrote the interpreter in JavaScript, the language inherits the little typing it has from JavaScript. Admittedly, the typing is next to non-existant, but the laguage has at least these three types: 'number', 'string', and 'function'


# Buzzwords

* Functional
* Curried Functions
* Functional Composition
* First Class functions
* Reverse Polish Notation
* Side effect free, not used in production anywhere.

# Functions included in the standard library:

* `+` - adds two numbers - *binary, curried*
* `*` - multplies two numbers - *binary, curried*
* `print` - prints one arg - *unary*
* `compose` - composes two functions - *binary, uncurried*
* `concat` - contactenates two args that it converts to strings - *binary, curried*

# Getting started

Clone the repo and then run:

    npm install

After that you can run programs like this: `node interpreter.js path/to/file.hh`

# Running examples

Examples are stored under `examples` you can run the hello world example like this:

    node interpreter.js examples/01_hello_world.hh
