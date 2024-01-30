# Zeturn

### Simple error handling for TS

This package was initially built because I ran into the following problems:

-   I needed a simple, barebones error handling solution in TS
-   The packages I found online either were had bloated/complicated type declarations for my simple use case or they had limitations when I needed to alter the return or error types

This module's primary purpose is to share useful error handling return types across my various projects.

I made this public in case anyone runs into a similar problem and needs a hassle-free copy-paste solution.

Note: the naming of error types or functions is inspired by Rust, and is purely nominal.

### Installation

```bash
npm install zeturn
```

### Basic Usage

First, declare functions to return the Ret<T> type, where T is the return type of the data if the operation was successful. It's highly recommended the data type is an object containing the expected data, and not the expected data itself.

```javascript
import { Err, Ok, Ret } from "zeturn";

/** Declare function with the Ret<T> type, where T is the
 *  return type if successful
 */
// Recommended: package all data within an object
function foo(): Ret<{ url: string }> {
    try {
        const url = thirdPartyLib();
        return Ok({ url }); // wrap within object
    } catch (err) {
        return Err({ msg: "something went wrong" });
    }
}

// NOT recommended, but possible if you don't want the overhead: return data directly
function foo2(): Ret<string> {
    try {
        const url = thirdPartyLib();
        return Ok(url); // pass data directly
    } catch (err) {
        return Err({ msg: "something went wrong" });
    }
}
```

Then, you can approach error handling like below:

```javascript
/** Error handling
 */
const res = foo();
if (!res.ok) {
    // Access error object
    console.log(res.err.msg);
    return;
}
// Access data on success
// or res.data if returning data directly from foo2 above
console.log(res.data.url);
```

Let's unpack the foo() return object:

-   When <code>res.ok</code> is <code>true</code>, we receive the following <code>res</code> object:

```javascript
{
    ok: true;
    data: {
        url: "someThirdPartyData";
    }
}
```

-   and <code>res.ok</code> is <code>false</code>, we get the following <code>res</code> object:

```javascript
{
    ok: false;
    err: {
        code: "no_error_code"; // Explained below
        msg: "something went wrong";
        show: false; // Explained below
    }
}
```

As you may have noticed, err contains two other attributes we didn't define in the <code>Err</code> call. These are optional arguments to the <code>Err</code> function, and since we didn't specify them, we received the defaults. Example specifying a code or shown flag in an err:

```javascript
return Err({ msg: "something went wrong", code: "Z3533", show: true });
```

and then we get a <code>res</code> object on error like so:

```javascript
{
    ok: false;
    err: {
        code: "Z3533"; // Explained below
        msg: "something went wrong";
        show: true; // Explained below
    }
}
```

### Handling Responses with `res`

The response object, typically named `res`, encapsulates the result of a function call (with a Zeturn Ret<T> type) and provides a way to handle both successful and error cases.

##### Structure of `res`

The `res` object has the following structure:

-   `ok`: A boolean value indicating the success (`true`) or failure (`false`) of the operation.
-   `data`: Present only when `ok` is `true`. Contains the successful output of the operation.
-   `err`: Present only when `ok` is `false`. Contains error details.

##### Using `res`

Here's how to use the `res` object:

```javascript
const res = foo();

// 1. Recommended
if (!res.ok) {
    console.log(res.err.msg);
    return; // or throw
}
console.log(res.data);

// 2. Ok
if (res.ok) {
    console.log(res.data);
    return; // or throw
}
console.log(res.err.msg);

// 3. Ok
if (!res.ok) {
    console.log(res.err.msg);
} else {
    console.log(res.data);
}

// 4. BAD: typescript will not be able to infer if res.data exists
if (!res.ok) {
    console.log(res.err.msg); // note no return or throw within block
}
console.log(res.data); // TS will complain here
```

#### Typescript Behaviour

TLDR: You need to return or throw within the <code>if (!res.ok) {}</code> block if accessing the <code>res.data</code> outside the block. The same is true if you opt to check <code>if (res.ok) {}</code>, in which case you need to return within the if accessing res.err outside the block. If you don't want to return or throw, use an if/else statement.

Why: TypeScript understands that inside this block, `res` is of the type where `ok` is `false`. Consequently, when you return from the function within this block, TypeScript knows that any code after this block (outside the if) will only be executed when `res.ok` is `true`. Thus, TypeScript is able to infer that outside the if block, `res` must be of the type where `ok` is `true`, and hence `res.data` is available.

### Utils Usage

Provided within the module are some utility functions. Their usage is purely optional and aren't required to achieve the above functionality.

The `Zeturn` class provides an enhanced way to handle errors with customizable default values for error codes and messages. You can use `Zeturn` in two ways:

1. **Direct Use Without Customization:**
   For standard use cases, you can directly utilize the static methods `Zeturn.codeFromError` and `Zeturn.msgFromError`. These methods will return default values (`"zeturn_unknown"` for the code and `"zeturn: unknown"` for the message) if the respective attributes are not found in the error object.

```javascript
import { Zeturn } from "zeturn";

try {
    // ... your code
} catch (error) {
    const code = Zeturn.codeFromError(error);
    const message = Zeturn.msgFromError(error);
    console.log(`Error code: ${code}, Message: ${message}`);
}
```

2. **Using an Instance of Zeturn for Custom Defaults:**
   If you need to specify custom default values for error code and message, create an instance of `Zeturn` with your desired options. This instance will then provide `codeFromError` and `msgFromError` methods that return your specified defaults when no corresponding attributes are found in the error object.

```javascript
import { Zeturn } from "zeturn";

const CustomZerr = new Zeturn({
    notFoundCode: "custom_code",
    notFoundMsg: "Custom error message",
});

try {
    // ... your code
} catch (error) {
    const code = CustomZerr.codeFromError(error);
    const message = CustomZerr.msgFromError(error);
    console.log(`Error code: ${code}, Message: ${message}`);
}
```

### Acknowledgements

Inspired by these helpful articles:

-   https://flexible.dev/blog/typescript-result-type/
-   https://betterprogramming.pub/typescript-with-go-rust-errors-no-try-catch-heresy-da0e43ce5f78
-   https://spaccatrosi.co.uk/blog/rust-like-typescript-error-handling/
-   https://dev.to/alexanderop/robust-error-handling-in-typescript-a-journey-from-naive-to-rust-inspired-solutions-1mdh#:~:text=Conclusion,them%20from%20functional%20to%20resilient.

NPM packaging build.sh and version.sh scripts

-   https://github.com/peterboyer/unenum
