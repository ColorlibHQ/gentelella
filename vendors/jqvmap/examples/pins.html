<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>JQVMap - World Map</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">

    <link href="../dist/jqvmap.css" media="screen" rel="stylesheet" type="text/css"/>

    <style>
      * {
        margin: 0;
        padding: 0;
      }

      #overlay {
        position: relative;
        overflow: hidden;
      }

      #overlay div {
        position: absolute;
        z-index: 1;
      }

      .jqvmap-zoomin,
      .jqvmap-zoomout {
        z-index: 1;
      }

      .pin {
        background: url(images/tip.png) no-repeat;
        width: 9px;
        height: 5px;
        position: absolute;
        cursor: pointer;
        pointer-events: none;
      }

      .pin .pin_content {
        background: url("images/background.png") repeat scroll 0 0 transparent;
        border-radius: 5px 5px 5px 5px;
        bottom: 50px;
        height: 50px;
        position: relative;
        right: 15px;
        width: 100px;
      }

      .pin .pin_content div {
        float: left;
        height: 30px;
        width: 35px;
        padding: 10px 5px;
        text-align: center;
      }

      .pin .pin_content div span {
        color: #EA4E41;
        font-size: 20px;
        font-weight: bold;
        line-height: 18px;
      }

      .pin .pin_content div span.small {
        font-size: 12px;
      }

      .pin .pin_content .thumb {
        width: 45px;
      }

      .pin .pin_content .thumb img {
        max-width: 45px;
        max-height: 30px;
      }

      #rightcol {
        position: absolute;
        right: 230px;
        top: 0;
      }

      table, tr, td {
        border: 1px solid #aaaaaa;
      }

      .pin-td {
        height: 65px;
        padding: 20px;
        width: 70px;
      }
    </style>

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="../dist/jquery.vmap.js" type="text/javascript"></script>
    <script src="../dist/maps/jquery.vmap.world.js" type="text/javascript"></script>

    <script type="text/javascript">
      var pins = {
        'ru': "\u003ca target=\"_blank\" href=\"http://www.google.com.ru\"\u003epin_ru\u003c/a\u003e",
        'pk': "\u003ca target=\"_blank\" href=\"http://www.google.com.pk\"\u003epin_pk\u003c/a\u003e"
      };

      jQuery(document).ready(function () {
        jQuery('#vmap').vectorMap({
          map: 'world_en',
          backgroundColor: '#333333',
          color: '#ffffff',
          hoverOpacity: 0.7,
          selectedColor: '#666666',
          enableZoom: true,
          showTooltip: true,
          scaleColors: ['#C8EEFF', '#006491'],
          normalizeFunction: 'polynomial',
          pins: {
            "ru": "\u003ca href=\"http://google.com\"\u003epin_ru\u003c/a\u003e",
            "pk": "\u003ca href=\"http://google.com\"\u003epin_pk\u003c/a\u003e"
          }
        });
      });

      function placePin(id) {

        id = id.toLowerCase();

        var cc = jQuery("#" + id + ' input[name=cc]').val();
        if (cc == '') {
          alert('Insert a country code first');
          return;
        }
        var pin = jQuery("#" + id + ' .pin-td').html();
        if (jQuery.trim(pin) == '') {
          alert('Pin has been moved');
          return;
        }

        var pins = new Object();
        pins[cc] = pin;

        jQuery('#vmap').vectorMap('placePins', pins, 'content');
      }

      function movePin(id) {

        id = id.toLowerCase();

        var cc = jQuery("#" + id + ' input[name=cc]').val();
        if (cc == '') {
          alert('Insert a country code first');
          return;
        }
        var pin = jQuery("#" + id + ' .pin-td').html();
        if (jQuery.trim(pin) == '') {
          alert('Pin has been moved');
          return;
        }
        pin = id + '_content';

        var pins = new Object();
        pins[cc] = pin;

        jQuery('#vmap').vectorMap('placePins', pins, 'id');
      }

      function removePin() {
        var cc = jQuery('#remove input[name=cc]').val();
        if (cc == '') {
          alert('Insert a country code first');
          return;
        }
        jQuery('#vmap').vectorMap('removePin', cc);
      }

      function removeAllPins() {
        jQuery('#vmap').vectorMap('removePins');
      }
    </script>
  </head>
  <body>
    <div id="vmap" style="width: 600px; height: 400px;"></div>
    <div id="rightcol">
      <table>
        <tr id="pin1">
          <td class="pin-td">
            <div id="pin1_content" class="pin">
              <div class="pin_content">
                <div>
                  <span>09</span>
                  <span class="small">new</span>
                </div>
                <div class="thumb">
                  <img src="images/thumb.jpg"/>
                </div>
              </div>
            </div>
          </td>
          <td>
            <input type="text" name="cc" placeholder="Country code"/><br/>
            <input type="button" onClick="placePin('pin1')" value="Copy"/>
            <input type="button" onClick="movePin('pin1')" value="Move"/>
          </td>
        </tr>
        <tr id="pin2">
          <td class="pin-td">
            <img id="pin2_content" src="images/globe.png"/>
          </td>
          <td>
            <input type="text" name="cc" placeholder="Country code"/><br/>
            <input type="button" onClick="placePin('pin2')" value="Copy"/>
            <input type="button" onClick="movePin('pin2')" value="Move"/>
          </td>
        </tr>
        <tr id="pin3">
          <td class="pin-td">
            <img id="pin3_content" src="images/flag.png"/>
          </td>
          <td>
            <input type="text" name="cc" placeholder="Country code"/><br/>
            <input type="button" onClick="placePin('pin3')" value="Copy"/>
            <input type="button" onClick="movePin('pin3')" value="Move"/>
          </td>
        </tr>
        <tr id="remove">
          <td class="pin-td">
            <input type="text" name="cc" placeholder="Country code"/><br/>
            <input type="button" onClick="removePin()" value="Remove"/>
          </td>
          <td>
            <input type="button" onClick="removeAllPins()" value="Remove"/>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
