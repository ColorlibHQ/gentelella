// Simplified main.js for testing

// Test if we can set a simple global variable
window.testVariable = 'Hello from module!';

// Try importing just jQuery first
import $ from 'jquery';

// Set jQuery globally
window.jQuery = window.$ = $;

// Import basic styles
import './main.scss';

// Set a flag when everything is ready
window.moduleReady = true;

// Dispatch event
window.dispatchEvent(new CustomEvent('simple-module-ready'));
