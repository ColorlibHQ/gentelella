(function () {
// minwords, maxwords, words extra validators
var countWords = function (string) {
  return string
      .replace( /(^\s*)|(\s*$)/gi, "" )
      .replace( /\s+/gi, " " )
      .split(' ').length;
};

window.Parsley.addValidator(
  'minwords',
  function (value, nbWords) {
    return countWords(value) >= nbWords;
  }, 32)
  .addMessage('en', 'minwords', 'This value needs more words');

window.Parsley.addValidator(
  'maxwords',
  function (value, nbWords) {
    return countWords(value) <= nbWords;
  }, 32)
  .addMessage('en', 'maxwords', 'This value needs fewer words');

window.Parsley.addValidator(
  'words',
  function (value, arrayRange) {
    var length = countWords(value);
    return length >= arrayRange[0] && length <= arrayRange[1];
  }, 32)
  .addMessage('en', 'words', 'This value has the incorrect number of words');
})();
