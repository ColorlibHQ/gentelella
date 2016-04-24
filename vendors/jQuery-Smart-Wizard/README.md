# jQuery Smart Wizard

Version 3 and later at
http://mstratman.github.com/jQuery-Smart-Wizard/

Original version 2 and earlier are from
http://www.techlaboratory.net/products.php?product=smartwizard

Licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
http://creativecommons.org/licenses/by-sa/3.0/

## Getting Started

Basic Usage:

```javascript
$('#wizard').smartWizard();
```

Using with option parameters:

```javascript
$('#wizard').smartWizard({
  // Properties
    selected: 0,  // Selected Step, 0 = first step   
    keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
    enableAllSteps: false,  // Enable/Disable all steps on first load
    transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
    contentURL:null, // specifying content url enables ajax content loading
    contentURLData:null, // override ajax query parameters
    contentCache:true, // cache step contents, if false content is fetched always from ajax url
    cycleSteps: false, // cycle step navigation
    enableFinishButton: false, // makes finish button enabled always
	hideButtonsOnDisabled: false, // when the previous/next/finish buttons are disabled, hide them instead
    errorSteps:[],    // array of step numbers to highlighting as error steps
    labelNext:'Next', // label for Next button
    labelPrevious:'Previous', // label for Previous button
    labelFinish:'Finish',  // label for Finish button        
    noForwardJumping:false,
  // Events
    onLeaveStep: null, // triggers when leaving a step
    onShowStep: null,  // triggers when showing a step
    onFinish: null  // triggers when Finish button is clicked
}); 
```

Parameters and Events are describing on the table below.

## Installing Smart Wizard 3

### Step 1: Include Files

Include the following JavaScript and css files on your page. 

1. jQuery Library file (Don't include if you already have it on your page) 
2. CSS(Style Sheet) file for Smart Wizard 
3. JavaScript plug-in file for Smart Wizard

To include the files copy and paste the below lines inside the head tag (`<head> </head>`) of your page. 
Make sure the paths to the files are correct with your working environment.

```html
<script type="text/javascript" src="jquery-1.4.2.min.js"></script>
<link href="smart_wizard.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="jquery.smartWizard.js"></script>
```

### Step 2: The JavaScript

Inititialize the Smart Wizard, copy and paste the below lines inside the head tag (`<head> </head>`) of your page

```html
<script type="text/javascript">
  $(document).ready(function() {
      // Initialize Smart Wizard
        $('#wizard').smartWizard();
  }); 
</script>
```

### Step 3: The HTML

Finally the html, below shows the HTML markup for the Smart Wizard, You can customize it by including your on contents for each steps. 
Copy and paste the below html inside the body tag (`<body></body>`) of your page.

```html
<div id="wizard" class="swMain">
  <ul>
    <li><a href="#step-1">
          <label class="stepNumber">1</label>
          <span class="stepDesc">
             Step 1<br />
             <small>Step 1 description</small>
          </span>
      </a></li>
    <li><a href="#step-2">
          <label class="stepNumber">2</label>
          <span class="stepDesc">
             Step 2<br />
             <small>Step 2 description</small>
          </span>
      </a></li>
    <li><a href="#step-3">
          <label class="stepNumber">3</label>
          <span class="stepDesc">
             Step 3<br />
             <small>Step 3 description</small>
          </span>                   
       </a></li>
    <li><a href="#step-4">
          <label class="stepNumber">4</label>
          <span class="stepDesc">
             Step 4<br />
             <small>Step 4 description</small>
          </span>                   
      </a></li>
  </ul>
  <div id="step-1">   
      <h2 class="StepTitle">Step 1 Content</h2>
       <!-- step content -->
  </div>
  <div id="step-2">
      <h2 class="StepTitle">Step 2 Content</h2> 
       <!-- step content -->
  </div>                      
  <div id="step-3">
      <h2 class="StepTitle">Step 3 Title</h2>   
       <!-- step content -->
  </div>
  <div id="step-4">
      <h2 class="StepTitle">Step 4 Title</h2>   
       <!-- step content -->                         
  </div>
</div>
```

## More details & descriptions:

### Load ajax content

To load the content via ajax call you need to specify the property "*contentURL*". 

example:

```html
<script type="text/javascript">
  $(document).ready(function() {
      // Initialize Smart Wizard with ajax content load
        $('#wizard').smartWizard({contentURL:'services/ajaxcontents.php'});
  }); 
</script>
```

When a step got focus the SmartWizard will post the step number to this contentURL and so you can write server side logic to format the content with the step number to be shown next. The response to this call should be the content of that step in HTML format. 

To get the step number in php:

```php
$step_number = $_REQUEST["step_number"];
```

By default the SmartWizard will fetch the step content only on the first focus of the step, and cache the content and use it on the further focus of that step. But you can turn off the content cache by specifying the property "*contentCache*" to false. 

example:

```html
<script type="text/javascript">
  $(document).ready(function() {
      // Initialize Smart Wizard with ajax content load and cache disabled
        $('#wizard').smartWizard({contentURL:'services/ajaxcontents.php',contentCache:false});
  }); 
</script>
```

Please see the ajax contents demo and following files on the source code to know how ajax content loading is implemented.

1. *smartwizard2-ajax.htm*
2. *services/service.php*

### Input validation

Smart Wizard 3 does not have in-built form validation, but you can call you own validation function for each steps or for all steps with the events. Smart Wizard 3 has three events (*onLeaveStep*, *onShowStep*, *onFinish*). So you can write your step validation login in "*onLeaveStep*" event and on validation fail you can stay on that step by cancelling that event. Validation logic for all steps can be write on "*onFinish*" event and so you can avoid submitting the form with errors. 

example:

```html
<script type="text/javascript">
$(document).ready(function(){
    // Smart Wizard         
    $('#wizard').smartWizard({
        onLeaveStep:leaveAStepCallback,
        onFinish:onFinishCallback
    });

    function leaveAStepCallback(obj, context){
        alert("Leaving step " + context.fromStep + " to go to step " + context.toStep);
        return validateSteps(context.fromStep); // return false to stay on step and true to continue navigation 
    }

    function onFinishCallback(objs, context){
        if(validateAllSteps()){
            $('form').submit();
        }
    }

    // Your Step validation logic
    function validateSteps(stepnumber){
        var isStepValid = true;
        // validate step 1
        if(stepnumber == 1){
            // Your step validation logic
            // set isStepValid = false if has errors
        }
        // ...      
    }
    function validateAllSteps(){
        var isStepValid = true;
        // all step validation logic     
        return isStepValid;
    }          
});
</script>
```

Please see the step validation demo and *smartwizard2-validation.php* in the source code to know how step input validation is implemented.

### Highlight error steps

Highlighting error steps in Smart Wizard is easy

```javascript
$('#wizard').smartWizard('setError',{stepnum:3,iserror:true});
```

It takes two arguments 

1. stepnum :- Step number to which is highlighted as error 
2. iserror :- true = set the step as error step and false = remove the error highlighting 

example:

```html
<script type="text/javascript">
    $(document).ready(function() {
        // Initialize Smart Wizard
        $('#wizard').smartWizard();

        function setError(stepnumber){
            $('#wizard').smartWizard('setError',{stepnum:stepnumber,iserror:true});
        }
    }); 
</script>
```

### Show message inside the wizard

An in-built message box is available with Smart Wizard 3 and you can call it as like below

```javascript
$('#wizard').smartWizard('showMessage','Hello! World');
```

example:

```html
<script type="text/javascript">
    $(document).ready(function() {
        // Initialize Smart Wizard
        $('#wizard').smartWizard();

        function showWizardMessage(){
            var myMessage = 'Hello this is my message';
            // You can call this line wherever to show message inside the wizard
            $('#wizard').smartWizard('showMessage',myMessage);
        }
    }); 
</script>
```

## Parameter Description:

<table>
    <tr>
        <th>Parameter Name</th>
        <th>Description</th>
        <th>Values</th>
        <th>Default Value</th>
    </tr>
    <tr>
        <td><strong>selected</strong></td>
        <td>specify the initially-selected step</td>
        <td>integer</td>
        <td>0</td>
    </tr>
    <tr>
        <td><strong>keyNavigation</strong></td>
        <td>
            enable/disable key navigation.
            <br />
            left/right keys are used if enabled
        </td>
        <td>
            true = enabled
            <br />
            false= disabled
        </td>
        <td>true</td>
    </tr>
    <tr>
        <td><strong>enableAllSteps</strong></td>
        <td>Enable/Disable all steps on first load</td>
        <td>
            true = enabled 
            <br />
            false= disabled
        </td>
        <td>false</td>
    </tr>
    <tr>
        <td><strong>transitionEffect</strong></td>
        <td>Animation effect on step navigation</td>
        <td>none/fade/slide/slideleft</td>
        <td>fade</td>
    </tr>
    <tr>
        <td><strong>contentURL</strong></td>
        <td>Setting this property will enable ajax content loading, setting null will disable ajax contents</td>
        <td>null or a valid url</td>
        <td>null</td>
     <tr>
        <td><strong>contentURLData</strong></td>
        <td>with ContentURL set, use this property to override the ajax query parameters used when loading contents</td>
        <td>null or a function that takes the new step number and returns an object to override ajax parameters</td>
        <td>null</td>
    </tr>
    </tr>
    <tr>
        <td><strong>contentCache</strong></td>
        <td>This property will enable caching of the content on ajax content mode. So the contents are fetched from the url only on first load of the step</td>
        <td>
            true = enabled
            <br />
            false= disabled
        </td>
        <td>true</td>
    </tr>
    <tr>
        <td><strong>cycleSteps</strong></td>
        <td>This property allows to cycle the navigation of steps</td>
        <td>
            true = enabled
            <br />
            false= disabled
        </td>
        <td>false</td>
    </tr>
    <tr>
        <td><strong>enableFinishButton</strong></td>
        <td>This property will make the finish button enabled always</td>
        <td>
            true = enabled
            <br />
            false= disabled
        </td>
        <td>false</td>
    </tr>
    <tr>
        <td><strong>hideButtonsOnDisabled</strong></td>
        <td>This property will hide the disabled buttons instead of just disabling them</td>
        <td>
            true = enabled
            <br />
            false= disabled
        </td>
        <td>false</td>
    </tr>
    <tr>
        <td><strong>errorSteps</strong></td>
        <td>an array of step numbers to highlighting as error steps</td>
        <td>
            array of integers
            <br />
            ex: [2,4]
        </td>
        <td>[]</td>
    </tr>
    <tr>
        <td><strong>labelNext</strong></td>
        <td>Label for Next button</td>
        <td>String</td>
        <td>Next</td>
    </tr>
    <tr>
        <td><strong>labelPrevious</strong></td>
        <td>Label for Previous button</td>
        <td>String</td>
        <td>Previous</td>
    </tr>
    <tr>
        <td><strong>labelFinish</strong></td>
        <td>Label for Finish button</td>
        <td>String</td>
        <td>Finish</td>
    </tr>
    <tr>
        <td><strong>noForwardJumping</strong></td>
        <td>If true, automatically disable all steps following the current step.
        <br />
        <br />
        e.g. If I am on step 4, and click step 1, steps 2-4 will be disabled and I cannot jump back to 3 or 4, and can only proceed "next" to step 2.</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
</table>
 
## Event Description:

<table>
    <tr>
        <th>Event Name</th>
        <th>Description</th>
        <th>Parameters</th>
    </tr>
    <tr>
        <td><strong>onLeaveStep</strong></td>
        <td>
            Triggers when leaving a step.
            <br />
            <br />
            This is a decision making event, based on its function return value (true/false) the current step navigation can be cancelled.
        </td>
        <td>
            <strong>Object</strong>: object of the step anchor element.
            You can access the step number and step body element using this object.
            <br />
            <strong>Object</strong>: Context information with keys: <em>fromStep</em> and <em>toStep</em>
        </td>
    </tr>
    <tr>
        <td><strong>onShowStep</strong></td>
        <td>Triggers when showing a step.</td>
        <td>
            <strong>Object</strong>: object of the step anchor element.
            You can access the step number and step body element using this object.
            <br />
            <strong>Object</strong>: Context information with keys: <em>fromStep</em> and <em>toStep</em>
        </td>
    </tr>
    <tr>
        <td><strong>onFinish</strong></td>
        <td>
            Triggers when the Finish button is clicked.
            <br />
            <br />
            This is a decision making event, based on its function return value (true/false) the further actions can be cancelled.
            <br />
            <br />
            e.g.: If the validation fails we can cancel form submitting and can show an error message. Please see the form validation example for the implementation
            <br />
            <br />
            If this callback is not set, clicking the finish button will submit the form in which the wizard is placed, and do nothing if a parent form is not found.
        </td>
        <td>
            <strong>Object Array</strong>: an array of the object of all the step anchor elements
            <strong>Object</strong>: Context information with key: <em>fromStep</em> indicating which step the user was on when they clicked the finish button.
        </td>
    </tr>
</table>

## Public methods:

Methods can be called by calling `smartWizard("method_name", arguments)`

For example, calling the *showMessage* method to display "Hello, World!" would
look like this:

```javascript
$("#your_wizard").smartWizard('showMessage', 'Hello, World!');
```

Here are the available methods:
<table>
    <tr>
        <th>Method Name</th>
        <th>Arguments</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>showMessage</strong></td>
        <td><strong>String</strong>: the message to show.</td>
        <td>Show a message in the action bar</td>
    </tr>
    <tr>
        <td><strong>hideMessage</strong></td>
        <td>None</td>
        <td>Hide the message in the action bar</td>
    </tr>
    <tr>
        <td><strong>showError</strong></td>
        <td><strong>Integer</strong>: the step number to highlight with an error.</td>
        <td>This is a convenience wrapper around <em>setError</em>.</td>
    </tr>
    <tr>
        <td><strong>hideError</strong></td>
        <td><strong>Integer</strong>: the step number to un-highlight with an error.</td>
        <td>This is a convenience wrapper around <em>setError</em>.</td>
    </tr>
    <tr>
        <td><strong>setError</strong></td>
        <td><strong>Object</strong>: with keys <em>stepnum</em> and <em>iserror</em>.</td>
        <td>Set or unset error status on a particular step. Passing <em>iserror</em> as true sets the error. Passing in a false value turns off the error.</td>
    </tr>
    <tr>
        <td><strong>goForward</strong></td>
        <td>None</td>
        <td>Load the next step.</td>
    </tr>
    <tr>
        <td><strong>goBackward</strong></td>
        <td>None</td>
        <td>Load the previous step.</td>
    </tr>
    <tr>
        <td><strong>goToStep</strong></td>
        <td><strong>Integer</strong> - the step number to load</td>
        <td>Load the specified step.</td>
    </tr>
    <tr>
        <td><strong>enableStep</strong></td>
        <td><strong>Integer</strong> - the step number to enable</td>
        <td>Enable the specified step.</td>
    </tr>
    <tr>
        <td><strong>disableStep</strong></td>
        <td><strong>Integer</strong> - the step number to disable</td>
        <td>Disable the specified step.</td>
    </tr>
    <tr>
        <td><strong>currentStep</strong></td>
        <td>None</td>
        <td>Returns the number of the current step.</td>
    </tr>
    <tr>
        <td><strong>fixHeight</strong></td>
        <td>None</td>
        <td>
            Adjusts the height of the step contents for the current step.
            In general you won't need this, but it's useful if you are
            dynamically setting the contents.
        </td>
    </tr>
</table>
 
