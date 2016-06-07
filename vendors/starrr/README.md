starrr
======

1-5 (or 1-`n`) star rating in < 75 lines of code.

## Requirements

- jQuery

## Usage

### Create the stars

```html
<div class='starrr'></div>
```

```js
$('.starrr').starrr()
```

### With an existing rating

```js
$('.starrr').starrr({
  rating: 4
})
```

### With more than 5 stars

```js
$('.starrr').starrr({
  max: 10
})
```

### Read-only

```js
$('.starrr').starrr({
  readOnly: true
})
```

### Do something with the rating...

```js
$('.starrr').starrr({
  change: function(e, value){
    alert('new rating is ' + value)
  }
})
```

Or if you prefer events:

```js
$('.starrr').on('starrr:change', function(e, value){
  alert('new rating is ' + value)
})
```

## Developing

- `npm install`
- `npm install -g grunt-cli`
- Make changes in `src/`
- Run `grunt` to compile them

## License

MIT
