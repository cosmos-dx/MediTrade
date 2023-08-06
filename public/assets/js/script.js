// focus the cursor on the email-address input
const emailField = document.getElementById("email-address-input");
if (emailField){
emailField.focus({
  preventScroll: true,
});}
else{
  console.log("Email Address Not Given By User or UnAvailable Write Now !!!");

}

document.addEventListener("DOMContentLoaded", function(event) { 
  // --------- >>> This is another example of load image tiles data <<<<------- 
  // var dbitemobj = {0:{"id":0, "img":"images/products/f1.jpg", "price":"100", "brand":"MyBrand", "descr":"Somthing Good Description 1", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"1", "cur":"INR"},
  //    1:{"id":1,"img":"images/products/f2.jpg", "price":"150", "brand":"YourBrand", "descr":"Somthing Good Description 2", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"1", "cur":"INR"},
  //    2:{"id":2,"img":"images/products/f3.jpg", "price":"60", "brand":"HisBrand", "descr":"Somthing Good Description 3", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"2", "cur":"INR"},
  //    3:{"id":3,"img":"images/products/f4.jpg", "price":"200", "brand":"HerBrand", "descr":"Somthing Good Description 4", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"3", "cur":"INR"},
  //    4:{"id":4,"img":"images/products/f5.jpg", "price":"5567", "brand":"TopBrand", "descr":"Somthing Good Description 5", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"2", "cur":"INR"},
  //    5:{"id":5,"img":"images/products/f6.jpg", "price":"356", "brand":"GoodBrand", "descr":"Somthing Good Description 6", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"1", "cur":"INR"},
  //    6:{"id":6,"img":"images/products/f7.jpg", "price":"211", "brand":"MoreBrand", "descr":"Somthing Good Description 7", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"7", "cur":"INR"},
  //    7:{"id":7,"img":"images/products/f8.jpg", "price":"23", "brand":"GoBrand", "descr":"Somthing Good Description 8", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"12", "cur":"INR"},
  //    8:{"id":8,"img":"images/products/f9.jpg", "price":"345", "brand":"YesBrand", "descr":"Somthing Good Description 9", "rcount":"100 Review", "keywords":"", "dis":"10%", "class":"22", "cur":"INR"},
  //  }
  
  // for (const [key, value] of Object.entries(dbitemobj)) {
 
  //   var innerdiv = document.createElement('div');
  //   innerdiv.setAttribute('class', 'product-cart');
  //   innerdiv.setAttribute('id', 'row-1-col-'+value["id"]);
  //   innerdiv.addEventListener('click', OnRow1Click);

  //   var innerstardiv = document.createElement('div');
  //   innerstardiv.setAttribute('class', 'star');
  //   innerstardiv.setAttribute('id', 'row1col1star');

  //   for (j = 1; j < 6; j++){
  //       var i = document.createElement("i");
  //       i.setAttribute('class', 'fa-solid fa-star');
  //       innerstardiv.appendChild(i);
  //       }

  //   var newSpan = document.createElement('span');
  //   innerdiv.appendChild(newSpan);
  //   var image = document.createElement("img");
  //   var h4 = document.createElement("h4");
  //   var ph4 = document.createElement("h4");
  //   ph4.setAttribute('class', 'price');
  //   var pricetext = document.createTextNode(value["cur"]+" : "+value["price"]);
  //   ph4.appendChild(pricetext);

  //   const textNode = document.createTextNode(value["descr"]);
  //   h4.appendChild(textNode);

  //   var a = document.createElement("a");
  //   a.href =  '#';
  //   var iShop = document.createElement("i");
  //   iShop.setAttribute('class', 'fa-solid fa-cart-shopping buy-icon');
  //   a.appendChild(iShop);


  //   image.src = value["img"];
  //   image.alt = "product image"
  //   innerdiv.appendChild(image);
  //   innerdiv.appendChild(h4);
  //   innerdiv.appendChild(innerstardiv);
  //   innerdiv.appendChild(ph4);
  //   innerdiv.appendChild(a);

  //   document.getElementById('row-1').appendChild(innerdiv); // Final Attachment
  
  // }
  
  console.log("Page Loadeeeed -> script.js");
  
});

function OnLocationClick(event){
  var lid = event.target.id;
  var lval = event.target.value;
  document.getElementById("ourlocationtext").innerText = lval;
  console.log(lid, lval, "load nearest medical shop");
};

function OnRow1Click(event){
  var parentElement = event.target.parentElement;
  var divClickedVal = parentElement.id.split("-");
  var text = parentElement.innerText.replace(/\n/g, ', ');
  // Encripting query parameters that will pass through url [should be encripted]; Decript this in server.js, then reuse it
  console.log(divClickedVal)
  var selectObj = btoa('{"row":"'+divClickedVal[1]+'","id":"'+divClickedVal[3]+'","img":"'+event.target.src+'","text":"'+text+'" }');
  //console.log("clicked",selectObj);

  window.location.href = "/nav?"+selectObj; // Redirect to another page
  
}

function OnRow1CartClick(event){
  var parentElement = event.target.parentElement;
  var divClickedVal = parentElement.id.split("-");
  var text = parentElement.innerText.replace(/\n/g, ', ');
  // Encripting query parameters that will pass through url [should be encripted]; Decript this in server.js, then reuse it
  var selectObj = btoa('{"row":"'+divClickedVal[1]+'","id":"'+divClickedVal[3]+'","img":"'+event.target.src+'","text":"'+text+'" }');
  console.log("clicked",selectObj);

  //window.location.href = "/mycart?"+selectObj; // Redirect to another page
  
}