# {%= name %} {%= badge("fury") %} {%= badge("travis") %}

> {%= description %}

## CLI

### Install

{%= include("install-global") %}


### Commands

```sh
$ update <command> [options]
```

**List updaters**

Choose from a list of updaters and tasks to run:

```sh
$ update list
```

**Run a specific updater**

The following would run updater `foo`:

```sh
$ update foo

# run updater "foo" with options
$ update foo --bar=baz
```


### tasks

_(TODO)_

### plugins

_(TODO)_

#### pipeline plugins

_(TODO)_

#### instance plugins

_(TODO)_

### middleware

A middleware is a function that exposes the following parameters:

- `file`: **{Object}** [vinyl][] file object
- `next`: **{Function}** must be called to continue on to the next file.

```js
function rename(file, next) {
  file.path = 'foo/' + file.path;
  next();
}

// example usage: prefix all `.js` file paths with `foo/`
app.onLoad(/\.js/, rename);
```

The `onStream` method is a custom [middleware](docs/middleware.md) handler that the `update` 

```js
app.onStream(/lib\//, rename);
```


## API 

### Install

{%= include("install-npm", {save: true}) %}

```js
var update = require('{%= name %}');
```

## API
{%= apidocs("index.js") %}

## Related projects
{%= related(verb.related.list) %}  

## Authoring

### Updaters

_(TODO)_

#### Tasks

_(TODO)_

#### Middleware

_(TODO)_

#### Plugins

> Updater plugins follow the same signature as gulp plugins

**Example**

```js
function myPlugin(options) {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    // do stuff to `file`
    file.contents = new Buffer(file.contents);
    next(null, file);
  });
}
```

### Publish

1. Name your project following the convention: `updater-*`
2. Don't use dots in the name (e.g `.js`) 
3. Make sure you add `updater` to the keywords in `package.json`
4. Tweet about your updater!

## Running tests
{%= include("tests") %}

## Contributing
{%= include("contributing") %}

## Author
{%= include("author") %}

## License
{%= copyright() %}
{%= license %}

***

{%= include("footer") %}
