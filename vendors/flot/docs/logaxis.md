## jquery.flot.logaxis
This plugin is used to create logarithmic axis. This includes tick generation,
formatters and transformers to and from logarithmic representation.

### Methods and hooks


- logTickGenerator(plot, axis, noTicks)

Generates logarithmic ticks, depending on axis range.
In case the number of ticks that can be generated is less than the expected noTicks/4,
a linear tick generation is used.


- logTickFormatter(value, axis, precision)

This is the corresponding tickFormatter of the logaxis.
For a number greater that 10^6 or smaller than 10^(-3), this will be drawn
with e representation


- setDataminRange(plot, axis)

It is used for clamping the starting point of a logarithmic axis.
This will set the axis datamin range to 0.1 or to the first datapoint greater then 0.
The function is usefull since the logarithmic representation can not show
values less than or equal to 0.
