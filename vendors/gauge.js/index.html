<!DOCTYPE html>
<html>
<head>
  <title>gauge.js</title>
  <meta name="description" content="100% native and cool looking animated JavaScript/CoffeeScript gauge">
  <meta name="viewport" content="width=1024, maximum-scale=1">
  <meta property="og:image" content="http://bernii.github.com/gauge.js/assets/preview.jpg?v=1" />
  <link rel="shortcut icon" href="favicon.ico">
  <meta http-equiv="X-UA-Compatible" content="IE=7" />
  <link href="assets/bootstrap.min.css" type="text/css" rel="stylesheet">
  <link href="assets/main.css?v=5" type="text/css" rel="stylesheet">
  <link href='http://fonts.googleapis.com/css?family=Amaranth:400,700|Just+Another+Hand' rel='stylesheet' type='text/css'>
  <link href="assets/prettify.css" type="text/css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="assets/fd-slider/fd-slider.css?v=2">
  <link rel="stylesheet" type="text/css" href="assets/fd-slider/fd-slider-tooltip.css">
  <script type="text/javascript" src="assets/prettify.js"></script>
  <script type="text/javascript" src="assets/jscolor.js"></script>
  <!--[if lt IE 9]><script type="text/javascript" src="assets/excanvas.compiled.js"></script><![endif]-->
</head>
<body>

<div id="logo">
  <h1>gauge.js</h1>
  <h2>100% native and cool looking animated JavaScript/CoffeeScript gauge</h2>
  <div id="its-coffee">coffee</div>
  <div id="strike-it"></div>
  <!--
  <div id="mask">
    <div id="dot"></div>
  </div>
  -->
</div>

<a id="ribbon" href="http://github.com/bernii/gauge.js"></a>

<div id="content">

<div id="download">
  <a href="dist/gauge.coffee" class="btn btn-primary btn-large">gauge.coffee</a>
  <a href="dist/gauge.min.js" class="btn btn-large">gauge.min.js</a>
</div>

<div id="example" class="gauge">
  <h2>Example</h2>

  <h4>Variant selection</h4>
  <ul class="horiz-list" id="type-select">
  	<li class="active" type="gauge"><canvas width=100 height=50 id="select-1"></canvas></li>
  	<li type="donut"><canvas width=80 height=40 id="select-2"></canvas></li>
  </ul>	
  <div id="preview">
  	<canvas width=220 height=70 id="canvas-preview"></canvas>
  	<div id="preview-textfield"></div>
  </div>
  <form id="opts" class="opts">
  	<h4>Options:</h4>
  	<label>Current Val:</label><input type="text" name="currval" min="0" max="3000" step="25" value="1244"><br>
    <label>Anim speed:</label><input type="text" name="animationSpeed" min="1" max="128" step="1" value="32"><br><br>
    <label>Angle:</label><input id="input-angle" type="text" name="angle" min="0" max="50" step="1" value="15"><br>
    <label>Line width:</label><input id="input-line-width" type="text" name="lineWidth" min="0" max="70" value="44"><br>
    <label>Ptr length:</label><input id="input-ptr-len" type="text" name="pointer.length" min="0" max="100" value="90"><br>
    <label>Ptr color:</label><input id="input-ptr-color" type="text" class="color" name="pointer.color" value="000000"><br>
    <label>Ptr stroke:</label><input id="input-ptr-stroke" type="text" name="pointer.strokeWidth" min="0" max="300" value="35"><br>
    <label>Font size:</label><input id="input-font-size" type="text" name="fontSize" min="0" max="100" value="41"><br>
    <label>Color start:</label><input type="text" name="colorStart" class="color" value="6FADCF"><br>
    <label>Color stop:</label><input type="text" name="colorStop" class="color" value="8FC0DA"><br>
    <label>Background:</label><input type="text" name="strokeColor" class="color" value="E0E0E0"><br>
  </form>

  <br clear="left">
  <input type="checkbox" id="share">
  <label for="share">
    <b>Share it!</b> If checked, the option values will be stored in the URL so that you can easily share your settings.
  </label>
</div>

<h2>Features</h2>
<ul>
  <li>No images, no external CSS - pure canvas</li>
  <li>No dependencies (jQuery is <a href="#jquery">supported</a>, but not required)</li>
  <li>Highly configurable</li>
  <li>Resolution independent</li>
  <li>Animated guage value changes (!)</li>
  <li>Works in all major browsers</li>
  <li>MIT License</li>
</ul>

<h2 id="usage">Usage</h2>
<pre class="prettyprint">
var opts = {
  lines: <span id="opt-lines" class="lit">12</span>, // The number of lines to draw
  angle: <span id="opt-angle" class="lit">7</span>, // The length of each line
  lineWidth: <span id="opt-lineWidth" class="lit">5</span>, // The line thickness
  pointer: {
    length: <span id="opt-pointer-length" class="lit">10</span>, // The radius of the inner circle
    strokeWidth: <span id="opt-pointer-strokeWidth" class="lit">0</span>, // The rotation offset
    color: '<span id="opt-pointer-color" class="lit">#000000</span>' // Fill color
  },
  limitMax: '<span id="opt-limitMax" class="lit">false</span>',   // If true, the pointer will not go past the end of the gauge
  colorStart: '<span id="opt-colorStart" class="lit">0</span>',   // Colors
  colorStop: '<span id="opt-colorStop" class="lit">0</span>',    // just experiment with them
  strokeColor: '<span id="opt-strokeColor" class="lit">0</span>',   // to see which ones work best for you
  generateGradient: true
};
var target = document.getElementById('foo'); // your canvas element
var gauge = new <span id="class-code-name" class="typ">Gauge</span>(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = <span id="opt-maxval" class="lit">3000</span>; // set max gauge value
gauge.animationSpeed = <span id="opt-animationSpeed" class="lit">3000</span>; // set animation speed (32 is default value)
gauge.set(<span id="opt-currval" class="lit">1500</span>); // set actual value
</pre>
<p>
  The <code>Gauge</code> class handles drawing on canvas and starts the animation. 
</p>

<h2 id="advanced-options">Advanced options</h2>
<ul>
  <li>
    <b>Percentage color</b>
    <p>If you want to control how Gauge behavaes in relation to the displayed value you can use the Guage option called <b>percentColors</b>. To use it add following entry to the options:
<pre class="prettyprint">
percentColors = [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]];
</pre>
    see working example at <a href="http://jsfiddle.net/berni/Yb4d7/">JSFiddle</a></p>
  </li>
</ul>

<h3 id="jquery">jQuery plugin</h3>
<p>
  Gauge.js does not require jQuery. Anyway, if you use jQuery you may use the following plugin:
</p>
<pre class="prettyprint">
$.fn.gauge = function(opts) {
  this.each(function() {
    var $this = $(this),
        data = $this.data();

    if (data.gauge) {
      data.gauge.stop();
      delete data.gauge;
    }
    if (opts !== false) {
      data.gauge = new Gauge(this).setOptions(opts);
    }
  });
  return this;
};
</pre>
<h2>Supported browsers</h2>
<img src="assets/browsers.png">
<p>
  Gauge.js has been (not yet!) successfully tested in the following browsers:
  <ul>
    <li>Chrome</li>
    <li>Safari 3.2+</li>
    <li>Firefox 3.5+</li>
    <li>IE 9</li>
    <li>Opera 10.6+</li>
    <li>Mobile Safari (iOS 3.2+)</li>
    <li>Android 2.3+</li>
  </ul>
</p>

<h2>Changes</h2>

<h3 id="v1.2.1">Version 1.2.1 (9.03.2014)</h3>
<ul>
  <li>Proper handling of color params <a href="https://github.com/bernii/gauge.js/issues/47">issue #47</a>.</li>
  <li>Moved percentage color to example/docs + <a href="http://jsfiddle.net/berni/Yb4d7/">JSFiddle</a></li>
</ul>

<h3 id="v1.2">Version 1.2 (16.08.2012)</h3>
<ul>
  <li>Prototype chain fix. See <a href="https://github.com/bernii/gauge.js/issues/7">issue #7</a>.</li>
  <li>Refactored code a bit to make it more flexible. Default class that has some extra features like gradient shadows is called Donut while more flexible one (for devs) is called BaseDonut - use it if you would don't need extra automatic stuff.</li>
  <li>Ability to scale gauges (requested via email) - example at <a href="http://jsfiddle.net/7Z2z2/">JSFiddle</a></li>
</ul>

<h3 id="v1.1">Version 1.1 (15.08.2012)</h3>
<ul>
  <li>Fixed color picker <a href="https://github.com/bernii/gauge.js/issues/2">bug</a> in FF & Opera</li>
  <li>Added a shadow option. See <a href="https://github.com/bernii/gauge.js/pull/5">issue #5</a>.</li>
  <li>Added multiple pointer option (requested via email). This needed some code refactoring. No demo for it yet. Use array of values to check it ex. gauge.set([44, 554]);</li>
  <li>Added wrapper for formatting text output <a href="https://github.com/bernii/gauge.js/issues/4">issue #4</a>.</li>
</ul>

<h3 id="v1.0">Version 1.0 (27.6.2012)</h3>
<ul>
  <li>Initial release</li>
</ul>

<h2>Contact</h2>
<p id="contact">
  <img width="57" height="57" src="http://www.gravatar.com/avatar/429e77b5fd1904a032be360339e0bf74">
  If you encounter any problems, please use the <a href="https://github.com/bernii/gauge.js/issues">GitHub issue tracker</a>.<br>
  If you like gauge.js and use it in the wild, let me know.<br>
  If you want to contact me, drop me a message <a href="mailto:bkobos+githubp@extensa.pl">via email</a><br>
</p>
</div>
<div id="footer">
  <a class="github" href="http://github.com">Hosted on GitHub</a>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="assets/fd-slider/fd-slider.js"></script>
<script src="dist/gauge.js"></script>
<script>
  prettyPrint();
  function update() {
    var opts = {};
    $('.opts input[min], .opts .color').each(function() {
      var val = $(this).hasClass("color") ? this.value : parseFloat(this.value);
      if($(this).hasClass("color")){
        val = "#" + val;
      }
      if(this.name.indexOf("lineWidth") != -1 ||
        this.name.indexOf("angle") != -1 ||
        this.name.indexOf("pointer.length") != -1){
        val /= 100;
      }else if(this.name.indexOf("pointer.strokeWidth") != -1){
        val /= 1000;
      }
      $('#opt-' + this.name.replace(".", "-")).text(val);
      if(this.name.indexOf(".") != -1){
      	var elems = this.name.split(".");
      	var tmp_opts = opts;
      	for(var i=0; i<elems.length - 1; i++){
      		if(!(elems[i] in tmp_opts)){
      			tmp_opts[elems[i]] = {};
      		}
      		tmp_opts = tmp_opts[elems[i]];
      	}
      	tmp_opts[elems[elems.length - 1]] = val;
      }else if($(this).hasClass("color")){
        // color picker is removing # from color values
      	opts[this.name] = "#" + this.value
        $('#opt-' + this.name.replace(".", "-")).text("#" + this.value);
      }else{
      	opts[this.name] = val;
      }
      if(this.name == "currval"){
      	// update current demo gauge
      	demoGauge.set(parseInt(this.value));
      	AnimationUpdater.run();
      }
    });
    $('#opts input:checkbox').each(function() {
      opts[this.name] = this.checked;
      $('#opt-' + this.name).text(this.checked);
    });
    demoGauge.animationSpeed = opts.animationSpeed;
    opts.generateGradient = true;
    demoGauge.setOptions(opts);
    demoGauge.ctx.clearRect(0, 0, demoGauge.ctx.canvas.width, demoGauge.ctx.canvas.height);
    demoGauge.render();
    if ($('#share').is(':checked')) {
      window.location.replace('#?' + $('form').serialize());
    }
  }
  function initGauge(){
    document.getElementById("class-code-name").innerHTML = "Gauge";
    demoGauge = new Gauge(document.getElementById("canvas-preview"));
    demoGauge.setTextField(document.getElementById("preview-textfield"));
    demoGauge.maxValue = 3000;
    demoGauge.set(1244);
  };
  function initDonut(){
    document.getElementById("class-code-name").innerHTML = "Donut";
    demoGauge = new Donut(document.getElementById("canvas-preview"));
    demoGauge.setTextField(document.getElementById("preview-textfield"));
    demoGauge.maxValue = 3000;
    demoGauge.set(1244);
  };
  $(function() {
    var params = {};
    var hash = /^#\?(.*)/.exec(location.hash);
    if (hash) {
      $('#share').prop('checked', true);
      $.each(hash[1].split(/&/), function(i, pair) {
        var kv = pair.split(/=/);
        params[kv[0]] = kv[kv.length-1];
      });
    }
    $('.opts input[min], #opts .color').each(function() {
      var val = params[this.name];
      if (val !== undefined) this.value = val;
      this.onchange = update;
    });
    $('.opts input[name=currval]').mouseup(function(){
    	AnimationUpdater.run();
    });

    $('.opts input:checkbox').each(function() {
      this.checked = !!params[this.name];
      this.onclick = update;
    });
    $('#share').click(function() {
      window.location.replace(this.checked ? '#?' + $('form').serialize() : '#!');
    });
    
    $("#type-select li").click(function(){
    	$("#type-select li").removeClass("active")
    	$(this).addClass("active");
    	var type = $(this).attr("type");
    	if(type=="donut"){
    		initDonut();
    		$("input[name=lineWidth]").val(10);
    		$("input[name=fontSize]").val(24);
    		$("input[name=angle]").val(35);

    		$("input[name=colorStart]").val("6F6EA0")[0].color.importColor();
    		$("input[name=colorStop]").val("C0C0DB")[0].color.importColor();
    		$("input[name=strokeColor]").val("EEEEEE")[0].color.importColor();

    		fdSlider.disable('input-ptr-len');
    		fdSlider.disable('input-ptr-stroke');
        $("#input-ptr-color").prop('disabled', true);

        selectGaguge1.set(1);
        selectGaguge2.set(3000);

    	}else{
    		initGauge();
    		$("input[name=lineWidth]").val(44);
    		$("input[name=fontSize]").val(41);
    		$("input[name=angle]").val(15);

    		$("input[name=colorStart]").val("6FADCF")[0].color.importColor();
    		$("input[name=colorStop]").val("8FC0DA")[0].color.importColor();
    		$("input[name=strokeColor]").val("E0E0E0")[0].color.importColor();

    		fdSlider.enable('input-ptr-len');
    		fdSlider.enable('input-ptr-stroke');
        $("#input-ptr-color").prop('disabled', false);
        selectGaguge1.set(3000);
        selectGaguge2.set(1) ;
    	}
    	fdSlider.updateSlider('input-line-width');
    	fdSlider.updateSlider('input-font-size');
    	fdSlider.updateSlider('input-angle');
    	$("#example").removeClass("donut, gauge").addClass(type);
    	update();
    });

    selectGaguge1 = new Gauge(document.getElementById("select-1"));
    selectGaguge1.maxValue = 3000;
    selectGaguge1.set(1552);
    
    selectGaguge2 = new Donut(document.getElementById("select-2"));
    selectGaguge2.maxValue = 3000;
    selectGaguge2.set(1844);
    
    initGauge();
    update();
    
  });
</script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-11790841-11']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</body>
</html>