# Bootstrap4 v5 Docs

<div class="alert alert-info">
    <strong>Note</strong>
    All functions are accessed via the <code>$('#datetimepicker').datetimepicker(FUNCTION)</code>
</div>


### Minimum Setup

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker1" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker1"/>
                    <div class="input-group-append" data-target="#datetimepicker1" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker1').datetimepicker();
            });
        </script>
    </div>
</div>

#### Code

```
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker1" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker1"/>
                    <div class="input-group-append" data-target="#datetimepicker1" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker1').datetimepicker();
            });
        </script>
    </div>
</div>
```

----------------------

### Using Locales

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker2" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker2"/>
                    <div class="input-group-append" data-target="#datetimepicker2" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker2').datetimepicker({
                    locale: 'ru'
                });
            });
        </script>
    </div>
</div>

#### Code

```
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker2" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker2"/>
                    <div class="input-group-append" data-target="#datetimepicker2" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker2').datetimepicker({
                    locale: 'ru'
                });
            });
        </script>
    </div>
</div>
```

----------------------

### Time Only

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker3" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker3"/>
                    <div class="input-group-append" data-target="#datetimepicker3" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker3').datetimepicker({
                    format: 'LT'
                });
            });
        </script>
    </div>
</div>

#### Code

```
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker3" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker3"/>
                    <div class="input-group-append" data-target="#datetimepicker3" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker3').datetimepicker({
                    format: 'LT'
                });
            });
        </script>
    </div>
</div>
```

----------------------

### Date Only

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker4" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker4"/>
                    <div class="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker4').datetimepicker({
                    format: 'L'
                });
            });
        </script>
    </div>
</div>

#### Code

```
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker4" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker4"/>
                    <div class="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker4').datetimepicker({
                    format: 'L'
                });
            });
        </script>
    </div>
</div>
```

----------------------

### No Icon (input field only):

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <input type="text" class="form-control datetimepicker-input" id="datetimepicker5" data-toggle="datetimepicker" data-target="#datetimepicker5"/>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker5').datetimepicker();
            });
        </script>
    </div>
</div>

#### Code

```

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <input type="text" class="form-control datetimepicker-input" id="datetimepicker5" data-toggle="datetimepicker" data-target="#datetimepicker5"/>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker5').datetimepicker();
            });
        </script>
    </div>
</div>
```

----------------------

### Enabled/Disabled Dates

<div class="container">
    <div class="row">
         <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker6" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker6"/>
                    <div class="input-group-append" data-target="#datetimepicker6" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker6').datetimepicker({
                    defaultDate: "11/1/2013",
                    disabledDates: [
                        moment("12/25/2013"),
                        new Date(2013, 11 - 1, 21),
                        "11/22/2013 00:53"
                    ]
                });
            });
        </script>
    </div>
</div>

#### Code

```
<div class="container">
    <div class="row">
         <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker6" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker6"/>
                    <div class="input-group-append" data-target="#datetimepicker6" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker6').datetimepicker({
                    defaultDate: "11/1/2013",
                    disabledDates: [
                        moment("12/25/2013"),
                        new Date(2013, 11 - 1, 21),
                        "11/22/2013 00:53"
                    ]
                });
            });
        </script>
    </div>
</div>
```

----------------------

### Linked Pickers

<div class="container">
    <div class='col-md-5'>
        <div class="form-group">
           <div class="input-group date" id="datetimepicker7" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker7"/>
                <div class="input-group-append" data-target="#datetimepicker7" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <div class='col-md-5'>
        <div class="form-group">
           <div class="input-group date" id="datetimepicker8" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker8"/>
                <div class="input-group-append" data-target="#datetimepicker8" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(function () {
        $('#datetimepicker7').datetimepicker();
        $('#datetimepicker8').datetimepicker({
			useCurrent: false
		});
        $("#datetimepicker7").on("change.datetimepicker", function (e) {
            $('#datetimepicker8').datetimepicker('minDate', e.date);
        });
        $("#datetimepicker8").on("change.datetimepicker", function (e) {
            $('#datetimepicker7').datetimepicker('maxDate', e.date);
        });
    });
</script>

#### Code

```
<div class="container">
    <div class='col-md-5'>
        <div class="form-group">
           <div class="input-group date" id="datetimepicker7" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker7"/>
                <div class="input-group-append" data-target="#datetimepicker7" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <div class='col-md-5'>
        <div class="form-group">
           <div class="input-group date" id="datetimepicker8" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker8"/>
                <div class="input-group-append" data-target="#datetimepicker8" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(function () {
        $('#datetimepicker7').datetimepicker();
        $('#datetimepicker8').datetimepicker({
			useCurrent: false
		});
        $("#datetimepicker7").on("change.datetimepicker", function (e) {
            $('#datetimepicker8').datetimepicker('minDate', e.date);
        });
        $("#datetimepicker8").on("change.datetimepicker", function (e) {
            $('#datetimepicker7').datetimepicker('maxDate', e.date);
        });
    });
</script>
```

----------------------

### Custom Icons

<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker9" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker9"/>
                <div class="input-group-append" data-target="#datetimepicker9" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker9').datetimepicker({
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down"
                }
            });
        });
    </script>
</div>

#### Code

```
<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker9" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker9"/>
                <div class="input-group-append" data-target="#datetimepicker9" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker9').datetimepicker({
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down"
                }
            });
        });
    </script>
</div>
```

----------------------

### View Mode

<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker10" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker10"/>
                <div class="input-group-append" data-target="#datetimepicker10" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker10').datetimepicker({
                viewMode: 'years'
            });
        });
    </script>
</div>

#### Code

```
<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker10" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker10"/>
                <div class="input-group-append" data-target="#datetimepicker10" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker10').datetimepicker({
                viewMode: 'years'
            });
        });
    </script>
</div>
```

----------------------

### Min View Mode

<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker11" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker11"/>
                <div class="input-group-append" data-target="#datetimepicker11" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker11').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });
        });
    </script>
</div>

#### Code

```
<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker11" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker11"/>
                <div class="input-group-append" data-target="#datetimepicker11" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker11').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });
        });
    </script>
</div>

```

----------------------

### Disabled Days of the Week

<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker12" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker12"/>
                <div class="input-group-append" data-target="#datetimepicker12" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker12').datetimepicker({
                daysOfWeekDisabled: [0, 6]
            });
        });
    </script>
</div>

#### Code

```
<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker12" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker12"/>
                <div class="input-group-append" data-target="#datetimepicker12" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker12').datetimepicker({
                daysOfWeekDisabled: [0, 6]
            });
        });
    </script>
</div>
```

----------------------

### Inline

<div style="overflow:hidden;">
    <div class="form-group">
        <div class="row">
            <div class="col-md-8">
                <div id="datetimepicker13"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker13').datetimepicker({
                inline: true,
                sideBySide: true,
				buttons:{
					showToday:true
				}
            });
        });
    </script>
</div>

#### Code

```
<div style="overflow:hidden;">
    <div class="form-group">
        <div class="row">
            <div class="col-md-8">
                <div id="datetimepicker13"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker13').datetimepicker({
                inline: true,
                sideBySide: true
            });
        });
    </script>
</div>
```

----------------------

### Multidate

<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker14" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker14"/>
                    <div class="input-group-append" data-target="#datetimepicker14" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker14').datetimepicker({
					allowMultidate: true,
					multidateSeparator: ',',
					format: 'L' //this is here just to make the demo prettier.
				});
            });
        </script>
    </div>
</div>

#### Code

```
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <div class="input-group date" id="datetimepicker14" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker14"/>
                    <div class="input-group-append" data-target="#datetimepicker14" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $(function () {
                $('#datetimepicker14').datetimepicker({
					allowMultidate: true,
					multidateSeparator: ','
				});
            });
        </script>
    </div>
</div>
```

----------------------

### Setting Options

<div class="container">
    <div class="col-sm-6">
        <div class="form-group">
            <div class="input-group date" id="datetimepicker15" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker15"/>
                <div class="input-group-append" data-target="#datetimepicker15" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>
        </div>
        <div class="form-group">
            <button class="btn btn-default" id="setOption">Set Option</button>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#datetimepicker15').datetimepicker();
            
            $('#setOption').click(function () {
                $('#datetimepicker15').datetimepicker('daysOfWeekDisabled', [0, 6]);
            });
        });
    </script>
</div>