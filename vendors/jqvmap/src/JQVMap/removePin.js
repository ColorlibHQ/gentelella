JQVMap.prototype.removePin = function(cc) {
  cc = cc.toLowerCase();
  jQuery('#' + this.getPinId(cc)).remove();
};
