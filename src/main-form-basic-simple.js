// Simplified main.js for testing
console.log('🚀 Simple main file starting...');

// Test if we can set a simple global variable
window.testVariable = 'Hello from module!';
console.log('✅ Test variable set:', window.testVariable);

// Try importing just jQuery first
import $ from 'jquery';
console.log('✅ jQuery imported:', typeof $);

// Set jQuery globally
window.jQuery = window.$ = $;
console.log('✅ jQuery set globally:', typeof window.$);

// Import basic styles
import './main.scss';
console.log('✅ Styles imported');

// Set a flag when everything is ready
window.moduleReady = true;
console.log('✅ Module ready flag set');

// Dispatch event
window.dispatchEvent(new CustomEvent('simple-module-ready'));
console.log('✅ Event dispatched'); 