// Forms Module - Only loaded on form pages

// Tempus Dominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus, DateTime } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
window.DateTime = DateTime;

// Choices.js (Enhanced select boxes - jQuery-free replacement for Select2)
import Choices from 'choices.js';
window.Choices = Choices;

// NoUiSlider (Range slider - jQuery-free replacement for Ion Range Slider)
import noUiSlider from 'nouislider';
window.noUiSlider = noUiSlider;

// Autosize (Auto-resizing textareas)
import autosize from 'autosize';
window.autosize = autosize;

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;

// Import CSS for the new libraries
import 'choices.js/public/assets/styles/choices.min.css';
import 'nouislider/dist/nouislider.css';

// Modern alternatives:
// - Progress bars: Bootstrap 5 native progress components
// - Date pickers: TempusDominus (already imported above)
// - Sliders: NoUiSlider (already imported above)
// - Select dropdowns: Choices.js (already imported above)

// Form validation libraries
// Note: Parsley.js and other form validators can be added here

export default {
  TempusDominus,
  DateTime,
  Choices,
  noUiSlider,
  autosize,
  Switchery,
  initialized: true
};
