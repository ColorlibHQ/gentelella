// Forms Module - Only loaded on form pages


// Tempus Dominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus, DateTime } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
window.DateTime = DateTime;

// Select2 (Enhanced select boxes)
import 'select2';

// Ion Range Slider
import 'ion-rangeslider';

// Autosize (Auto-resizing textareas)
import autosize from 'autosize';
window.autosize = autosize;

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;

// jQuery UI components for forms
import 'jquery-ui/ui/widgets/progressbar.js';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'jquery-ui/ui/widgets/slider.js';

// Form validation libraries
// Note: Parsley.js and other form validators can be added here

export default {
  TempusDominus,
  DateTime,
  autosize,
  Switchery,
  initialized: true
}; 