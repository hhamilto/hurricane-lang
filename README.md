# sarina-lang 
## A Custom Language

This is a custom toy language that I put together as an exercise. The interpreter uses a recursive descent parser and runs in [Node.js](https://nodejs.org/).

The language is entirely contained in `interpreter.js`. You can interpret a file by running something like this: `node interpreter.js path/to/file.hh`

# Syntax

The only construct the language supports is the function call. It uses postfix notation. Arguments are sandwiched between `:` and `;` . If a function can take multiple arguments they are separated with a `,`.


## example

this:

    : 'Hello, World!' ; print

writes this to standard out:

    Hello, World!

# Types

Since I wrote the interpreter in JavaScript, the language inherits the little typing it has from JavaScript. Admittedly, the typing is next to non-existant, but the laguage has at least these three types: 'number', 'string', and 'function'. I also added a 'list' type, which is a little one off. The list type is represented internally as a JavaScript array. These types are enforced through cryptic runtime error messages emanating from the interpreter's JavaScript internals.


# Buzzwords

* Functional
* Curried Functions
* Functional Composition
* First Class functions
* Reverse Polish Notation
* Side effect free, not used in production anywhere.

# Functions included in the standard library:

* `+` - Adds two numbers - *binary, curried*
* `*` - Multplies two numbers - *binary, curried*
* `/` - (interger) Divides two numbers - *binary, curried*
* `-` - Subtracts two numbers - *binary, curried*
* `%` - Mods two numbers - *binary, curried*
* `=` - Tests if two numbers are equal. Returns 1 if they are else returns 0. - *binary, curried*
* `print` - Prints one arg - *unary*
* `compose` - Composes two functions - *binary, uncurried*
* `concat` - Contactenates two args that it converts to strings - *binary, curried*
* `cons` - Pass an item to return a list. Pass a list and call the resulting function with an item to add it to the list - *binary or unary, curried*
* `wrap` - Takes the function to wrap and the list of args. Use `cons` to build the list. *binary, curried* 
* `if` - 0 counts as false, everything else counts as true. `if` function takes `function called on true`, `function called on false`, `number to test`. Use `wrap` to create the "true" and "false" functions. - *ternary, curried*
* `list` - Cheaters way to make a list. Takes unlimited arguments. Returns its arguments as a list. - *?multinary, uncurried*


# Getting started

Clone the repo and then run:

    npm install

After that you can run programs like this: `node interpreter.js path/to/file.hh`

# Running examples

Examples are stored under `examples` you can run the hello world example like this:

    node interpreter.js examples/01_hello_world.hh
    
## List of examples:

1. `examples/01_hello_world.s`
1. `examples/02_add_and_concat.s`
1. `examples/03_math.s`
1. `examples/04_compose.s`
1. `examples/05_cons.s`
1. `examples/06_wrap.s`
1. `examples/07_if.s`
1. `examples/08_list.s`