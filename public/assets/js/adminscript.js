function showhidelements (v1,v2,v3, info=""){
        
        var imguploadel = document.getElementById("imgupload");
        var cancelel = document.getElementById("imgcancel");
        document.getElementById("dpinfo").innerHTML = info;
      
        imguploadel.style.display = v2;
        cancelel.style.display = v3;
    }

  document.getElementById("iupload").onchange = function(e)
  {
     if(document.getElementById("name").value.trim() !=="" ){
      showhidelements("none","initial","initial", "Ready to Upload Your Image File");
     }else{
      document.getElementById("h3").innerHTML = "Item Name Field is Empty !"
      document.getElementById("name").focus();
      window. scrollTo(0, 0);
     }
  }

  document.getElementById("imgupload").onclick = function(e)
  {
     let text = document.getElementById("name").value;
     showhidelements("initial","none","none", text +" and Image Uploaded !!");
     
  }

  document.getElementById("next").onclick = function(e)
  {
     document.getElementById("name").value = "";
     document.getElementById("descr").value = "";
     document.getElementById("keywords").value = "";
     document.getElementById("brand").value = "";
     document.getElementById("price").value = "";
     document.getElementById("type").value = "";
     document.getElementById("rating").value = "";
     document.getElementById("other1").value = "";
     document.getElementById("dpinfo").innerHTML = "Ready For Next Entry !"
     document.getElementById("h3").innerHTML = "Ready For Next Entry !"
     document.getElementById("name").focus();
     window. scrollTo(0, 0);
  }

  document.getElementById("imgcancel").onclick = function(e)
  {
     showhidelements("initial","none","none", "Image Uploaded CANCEL !!");
  }