## Events

### hide.datetimepicker

Fired when the widget is hidden.

Parameters:

```
e = {
    date //the currently set date. Type: moment object (clone)
}
```

Emitted from:

* toggle()
* hide()
* disable()

----------------------

### show.datetimepicker

Fired when the widget is shown.

Parameters:

No parameters are include, listen to `change.datetimepicker` instead

Emitted from:

* toggle()
* show()

----------------------

### change.datetimepicker

Fired when the date is changed, including when changed to a non-date (e.g. When keepInvalid=true).

Parameters:

```
e = {
    date, //date the picker changed to. Type: moment object (clone)
    oldDate //previous date. Type: moment object (clone) or false in the event of a null
}
```

Emitted from:

* toggle() **Note**: Only fired when using `useCurrent`
* show() **Note**: Only fired when using `useCurrent` or when or the date is changed to comply with date rules (min/max etc)
* date(newDate)
* minDate(minDate)
* maxDate(maxDate)
* daysOfWeekDisabled()

----------------------

### error.datetimepicker

Fired when a selected date fails to pass validation.

Parameters:

```
e = {
    date //the invalid date. Type: moment object (clone)
    oldDate //previous date. Type: moment object (clone) or false in the event of a null
}
```

Emmited from:

* minDate(minDate)
* maxDate(maxDate)
* daysOfWeekDisabled()
* setValue() *private function*

----------------------

### update.datetimepicker

Fired (in most cases) when the `viewDate` changes. E.g. Next and Previous buttons, selecting a year.

Parameters:

```
e = {
   change, //Change type as a momentjs format token. Type: string e.g. yyyy on year change
   viewDate //new viewDate. Type: moment object
}
```