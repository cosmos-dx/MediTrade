// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
   if (textbox !== null ){
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
       }
     });
    }
  });
}


$('.rmsintvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*$/.test(value); }); 
    });

$('.rmsqtyvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*$/.test(value); }); 
    });

$('.rmspositiveintvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^\d*$/.test(value); });
    });

$('.rmsintlimitvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); });
    });

$('.rmsgriddiscount').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    });

$('.gridamtlabel').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    });

$('.rmsgridfloatval').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    });
$('.rmsfloatvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    });

$('.rmscurrencyfloatvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^-?\d*[.,]?\d{0,2}$/.test(value); });
    });

$('.rmstextvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^[a-z]*$/i.test(value); });
    });

$('.rmshexvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
       return /^[0-9a-f]*$/i.test(value); });
    });

$('.bonusvalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^[0-9 +]*$/i.test(value); });
    });

$('.estivalidate').on('focus', function(e) {
    var activeid = document.activeElement.id;
    setInputFilter(document.getElementById(activeid), function(value) {
        return /^[E]*$/i.test(value); });
    });

setInputFilter(document.getElementById("hexonly"), function(value) {
  return /^[0-9a-f]*$/i.test(value); });


