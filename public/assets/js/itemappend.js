


function tableColumnHeader(){
    
    document.getElementById("itembox").insertRow().innerHTML ='<thead><tr>'+
    '<th></th><th>S.No</th><th>Items Name</th><th>Pack</th><th>Qty</th><th>Batch</th><th>Bonus</th>'+
    '<th>Rate</th><th>Dis-%</th><th>Amount</th><th>Exp</th><th> GST-% </th><th>NetRate</th>'+
    '</tr></thead>';
}

function appendRow(){
    
    // to sync idcount while update(because wrong idcount is comming, still unkown) is ON and user want to add new items
    // this adjust number only once and sync both variables
    if(spedit){idcount = staticidcount;} 
    ++idcount ;                      
    staticidcount = idcount; // sync staticidcount to idcount   
    document.getElementById("itembox").insertRow(-1).innerHTML = '<tr><td><button id='+idcount+'_incbtn'+' name="addbtn" '+
    'style="width:30px" onclick="appendRow()">+</button></td>'+
    '<td><label id='+idcount+'_sno'+' name="sno" class="rmslabelwidth0" >'+idcount+'</label></td>'+
    '<input type="text" id='+idcount+'_itemsearch name="addinput" class="addinput" autocomplete="off" spellcheck="false" list='+idcount+'_itemlist value="" '+
    ' style="text-transform:uppercase; width:330px; height:30px; border: 1px solid #a6b8ba;" '+
    ' placeholder="Items Name" onfocus="onItemSearchFocus(event)"><div list='+idcount+"_itemlist id="+idcount+'_itemlist ></div>'+

    '<td><label id='+idcount+'_pack'+' name="pack" class="tdgridpacklabel0" ></label></td >'+
    '<td><input type="text" id='+idcount+'_qty'+' name="qty" class="rmsqtyvalidate" placeholder="Qty" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+

    '<input type="text" id='+idcount+'_batchno name="batchno" class="addinput batinputstyle" list='+idcount+'_batlist value=""  '+
    'placeholder="Batch" onfocus="getFocusedID(event)" onkeyup="onBatchUpdate(event)" /><div list='+idcount+"_batlist id="+idcount+'_batlist ></div>'+

    //'<td><input type="text" id='+idcount+'_batchno'+' name="batchno" class="addinput batinputstyle" placeholder="Batch" list='+idcount+'_batlist '+
    //' onfocus="getFocusedID(event)" style="width:80px" onfocus="getFocusedID(event)" onkeyup="onBatchUpdate(event)" ><div list="list-batch"></div></td >'+
    

    '<td><input type="text" id='+idcount+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
    ' onfocus="getFocusedID(event)" readonly ></td >'+

    '<td><input type="text" id='+idcount+'_expdate name="exp" class="expvalidate" placeholder="mm/yy" value="" onfocus="getFocusedID(event)" '+
    'onkeyup="onExp(event)" maxlength="5" /></td>'+

    '<td><label id='+idcount+'_tax'+' name="tax" class="tdgridlabel" >0.00</label></td >'+
    '<td><label id='+idcount+'_netrate'+' name="netrate" class="tdgridlabel" >0.00</label></td ></tr>';

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // if(!idcount==0){
    //     var btchno = document.getElementById(idcount-1+'_batchno').value.trim().toUpperCase();
    //     console.log(btchno);
    //    // recdic['grid'][idcount]["batchno"] = btchno;
    // }
    //-------------------------------------------------------------------------------------------------------------------------
    itemhost = document.URL.substring(0, document.URL.lastIndexOf("/")+1)+'itemsearchenter';
    $('.typeahead').on('typeahead:selected', function(evt, item) {
    // item has value ; item.value
        var searchtxt = this.value;  
        propostAjax('products', searchtxt, itemhost ,'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});    
            });
    
    onBatchSelect(idcount,"#"+idcount+"_batchno","#"+idcount+"_batlist","#"+idcount+"_exp");

    onItemSearch("#"+idcount+"_itemsearch","#"+idcount+"_itemlist");
   
    
    setInputFilter(document.getElementById(idcount+'_qty'), function(value) {
        return /^-?\d*$/.test(value); }); 
    setInputFilter(document.getElementById(idcount+'_bonus'), function(value) {
        return /^[0-9 +]*$/i.test(value); });
    setInputFilter(document.getElementById(idcount+'_rate'), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    setInputFilter(document.getElementById(idcount+'_dis'), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });

    
}

function SPEDIT_appendRow(rawprows, rawitemrows){
    let prows = rawprows;
    let itemrows = rawitemrows;
    // let prows = JSON.parse(rawprows); // party rows;
    // let itemrows = JSON.parse(rawitemrows);
    var amt = 0
    var cgst = 0
    var tdisamt = 0
    var netamt = 0
    for(let idc=0; idc<itemrows.length; idc++) {
        idcount = idc;
        var astr = '<tr><td><button id='+idc+'_incbtn'+' name="addbtn" style="width:30px" onclick="appendRow()">+</button></td>'+
        '<td><label id='+idc+'_sno'+' name="sno" class="rmslabelwidth0" >'+idc+'</label></td>'+
      
        '<input type="text" id='+idc+'_itemsearch name="addinput" class="addinput" autocomplete="off" spellcheck="false" list='+idc+'_itemlist '+
        ' style="text-transform:uppercase; width:330px; height:30px; border: 1px solid #a6b8ba;" '+
        ' placeholder="Items Name" onfocus="onItemSearchFocus(event)" value="'+itemrows[idc].name+'"><div list='+idc+"_itemlist id="+idc+'_itemlist ></div>'+

        '<td><label id='+idc+'_pack'+' name="pack" class="tdgridpacklabel0" >'+itemrows[idc].pack+'</label></td >'+
        '<td><input type="text" id='+idc+'_qty'+' name="qty" class="rmsqtyvalidate" placeholder="Qty" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].qty+'" ></td >'+

        '<input type="text" id='+idc+'_batchno name="batchno" class="addinput batinputstyle" list='+idc+'_batlist value="'+itemrows[idc].batchno+'"  '+
        'placeholder="Batch" onfocus="getFocusedID(event)" onkeyup="onBatchUpdate(event)" /><div list='+idc+"_batlist id="+idc+'_batlist ></div>'+
        //'<td><input type="text" id='+idc+'_batchno'+' name="batchno" class="typeahead" placeholder="Batch" value="AA" '+
        //' onfocus="getFocusedID(event)" style="width:80px" ></td >'+

        '<td><input type="text" id='+idc+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].bonus+'" ></td >'+
        '<td><input type="text" id='+idc+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].rate+'" ></td >'+
        '<td><input type="text" id='+idc+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].dis+'" ></td >'+
        '<td><input type="text" id='+idc+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
        ' onfocus="getFocusedID(event)" value="'+itemrows[idc].amt+'" readonly ></td >'+

        '<td><input type="text" id='+idc+'_expdate name="exp" class="expvalidate" placeholder="mm/yy" value="'+itemrows[idc]["stockarray"][0]["expdate"]+'" onfocus="getFocusedID(event)" '+
        'onkeyup="onExp(event)" maxlength="5" /></td>'+

        '<td><label id='+idc+'_tax'+' name="tax" class="tdgridlabel" >'+itemrows[idc].tax+'</label></td >'+
        '<td><label id='+idc+'_netrate'+' name="netrate" class="tdgridlabel" >'+itemrows[idc].netamt+'</label></td ></tr>';
        
        var dbstk = GetDBStk_stkarray(itemrows[idc]["stockarray"], itemrows[idc].batchno);

        itemrows[idc]['stockid']=dbstk["stockid"];
        itemrows[idc]['dbstock']=dbstk["dbstock"];
        itemrows[idc]['dbbatchstock']=dbstk["dbbatchstock"];
        itemrows[idc]['expdate']=dbstk["expdate"];
        itemrows[idc]['dbbatchno']=dbstk["dbbatchno"];
        var bonus_numeric = 0 ;
        if(isNumeric(itemrows[idc].bonus)){
            bonus_numeric = parseInt(itemrows[idc].bonus) ;
        }
        var tqty = parseInt(itemrows[idc].qty)+bonus_numeric;
        itemrows[idc]['tqty']=tqty ;
        amt +=parseFloat(itemrows[idc]["amt"])  
        cgst +=parseFloat(itemrows[idc]["cgst"])
        tdisamt +=parseFloat(itemrows[idc]["tdisamt"])
        netamt +=parseFloat(itemrows[idc]["netamt"])
        document.getElementById("itembox").insertRow(-1).innerHTML += astr;


        onBatchSelect(idc,"#"+idc+"_batchno","#"+idc+"_batlist","#"+idc+"_exp");
        onItemSearch("#"+idc+"_itemsearch","#"+idc+"_itemlist");

        }
    
    prows["amt"] = amt;
    prows["cgst"] = cgst;
    prows["sgst"] = cgst;
    prows["ttaxamt"] = cgst*2;
    prows["tdisamt"] = tdisamt;
    prows["tamt"] = amt-tdisamt;
    prows["netamt"] = netamt.toFixed(2);
    // document.getElementById("ttaxamt").innerHTML=prows["ttaxamt"];
    // document.getElementById("tdisamt").innerHTML=prows["tdisamt"];
     //document.getElementById("cgst").innerHTML=cgst;
    // document.getElementById("sgst").innerHTML=prows["sgst"];
    return {"prows":prows, "itemrows":itemrows};
}

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
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
  });
}

function partySearch(cs, csurl){
    var rowlen = 0;
    var listattr = 'dlist';
    var divList =  $('div[list=dlist]');
    var tag = 'name';

    $("#supsearch").keyup( function(evt){

      var keyc =  evt.keyCode || evt.which;
      
      var text = $(this).val();
      
      var eventtype = evt.type;
      if (keyc===112){alert('Ready to Add New Party') }
      if (keyc===13){
            var pbd_mode = true; // if user start seraching getpreviousbilldata should displayed
            partyFill(kyi, partyrows, cs, pbd_mode, bp=false);
            kMove('select', tag, divList, listattr, text); 
        }
      if (keyc===40){kMove('down', tag, divList, listattr, text)}  
      if (keyc===38){kMove('up', tag, divList, listattr, text)}  
            });

    $("#supsearch").on('input', function () {
        var text = $(this).val();
        kyi = 0;
        
        if(text.length){
            
            $.ajax({type:"GET",url:csurl,
             data: {action:"search",type:'partysearch',name:text.toUpperCase(),cs:cs},    
             success:function(data) {
                console.log(data);
                $(divList[0]).empty();

                partyrows = JSON.parse(data);
                recdic['pan'] = partyrows[0];
                
                recdic['pan']["billas"]='M'; // Default to Main Bill
                recdic['pan']["itype"]='1'; // 1==> for unregisted party; 2==> for registerd party
                rowlen = partyrows.length ; //getting size of dict data from server
                var spannode = divList[0] ;
                for (var k in partyrows){
                    var r = partyrows[k];
                    $(spannode).append("<span data-id='"+k+"' id='"+k+"' >"+r.name+"</span");
                    //$('#list-name').append('<span>'+i.toString()+'</span>');
                
                        }
                $('div[list='+listattr+']').show(100);
                kMove('text', tag, divList, listattr, text)
                if (rowlen === 0){
                  partyFillDelete(); //for recdic
                  document.getElementById('statusinfo2').innerHTML = "** Nothing Found **"; return true;}
                
                }
            });
            
          }
        else {kyi = 0;$('div[list]').hide();}
        
      });

    $('#dlist').on('click',  'span', function(evt){
      evt.preventDefault();   
      var listattr = 'dlist';
      var getid = this.id ;
      var text = $(this).html();
      var divList =  $('div[list=dlist]');
      var tag = listattr ;
      kyi = getid ;
      var pbd_mode = true; // if user start seraching and select from divList getpreviousbilldata should displayed
      partyFill(kyi, partyrows, cs, pbd_mode, bp=false);
      kMove('select', tag, divList, listattr, text)
    });
   
  };

function partyFill(getid, partyrows, cs, pbd_mode, bp=true){
      document.getElementById("statusinfo").innerHTML="";
      document.getElementById("statusinfo2").innerHTML="";  
      var pdt = partyrows[getid] 

      if (pdt==undefined){pdt = partyrows[0]}
      recdicTemplateUpdate(recdic['pan'], pdt, 'pan');  // First time recdic['pan'] updates on each purchase or sale
      recdic['pan']['csid']=pdt['csid'] // CustomerID & SupplierID 
      recdic['pan']['ledgid']=pdt['ledgid'] // CustomerID & SupplierID 
      
      if (bp===false){document.getElementById('supsearch').value = pdt.name;}
      document.getElementById('add1').innerHTML = pdt.add1;
      document.getElementById('add2').innerHTML = pdt.add2 + '; &nbsp; ';
      var statecode = posdict[pdt.add3];
      var partybal = pdt.bal;
      if (partybal===undefined){
        partybal = '0.0'
        }
      if (statecode == undefined){
        statecode = 'N.A';
        document.getElementById("add3").innerHTML = statecode ;}
      else{document.getElementById("add3").innerHTML = statecode;} 
      recdic['pan']['state']=pdt.add3;
      recdic['pan']['statecode']=statecode;
      document.getElementById('phone').innerHTML = "&#128222; " + pdt.phone;
      document.getElementById('regn').innerHTML = '&nbsp; &reg; &nbsp; ' +pdt.regn;
      document.getElementById('gstn').innerHTML = 'GSTN :' + pdt.gstn;
      //document.getElementById('bal').innerHTML = ' &nbsp; P.Bal. Rs:' +partybal
      document.getElementById('0_itemsearch').focus();
      
      // pbd_mode ==>> previousbilldata
      //if (pbd_mode){getpreviousbilldata(pdt);}
     
      return true;
    };

function getpreviousbilldata(datarow){
  //console.log(rscr['fyear']) ;
  var ids = [datarow.nameid, datarow.id, rscr['fyear'], rscr['dbinfo']['tables']]; // id == ledgerID

      $.ajax({type:"GET",url:cshost.queryp,
             data: {"action":"search","type":'previousbilldata',jsdata:ids,
             "cs":cs,"cxt":cshost.cxt,"db":cshost.db},    
             success:function(data) {
            //$(divList[0]).empty();
                var prv_billrows = JSON.parse(data);
                $('#previtems_table').append("<tr><th>BillDate</th><th>Inv.No</th><th>Amount</th></tr>")
                for(i=0; i<prv_billrows.length; i++){
                    $('#previtems_table').append(
                      "<tr><td>"+prv_billrows[i].billdate+"</td><"+
                       "<td>"+prv_billrows[i].billno+"</td>"+
                       "<td>"+prv_billrows[i].amt+"</td>/tr>"
                        )
                  } 
              }
        });
  }

function recdicTemplateUpdate(staticrecdic, vrecdic, recdickey){
      for (const [k, v] of Object.entries(staticrecdic)){
        if (vrecdic[k]){
          staticrecdic[k]=vrecdic[k];
          }
        }
      if (recdickey==='pan'){recdic[recdickey]=staticrecdic}; // update recdic['pan']
      return staticrecdic;
    };

function partyFillDelete(){
      document.getElementById('add1').innerHTML = '';
      document.getElementById('add2').innerHTML = '';
      document.getElementById('add3').innerHTML = '';
      document.getElementById('phone').innerHTML = '';
      document.getElementById('regn').innerHTML = '';
      document.getElementById('gstn').innerHTML = '';
      //document.getElementById('bal').innerHTML = '';
      recdic['pan']={};
      }

//       onItemSearch(_itemsearchid, _itemslistid)

function onItemSearch(t,idl){
  selecteditemrow = {};
    var text=0 ;
    var input_id=idcount+"_itemlist";
    var div_list=$("div[list="+input_id+"]");

    $(idl).on("click","span",function(t){
        t.preventDefault();
        var e=this.id
        
        text=$(this).val();
        kyi=e
        itemFill(e,itemrows,cs,bp=!1);
        kMove("select",input_id,div_list,input_id,text)
    })

    $(t).keydown(function(evt){
        var keyc =  evt.keyCode || evt.which;
        if (keyc===112){alert('Ready to Add New Party') }
        if (keyc===13){
            var pbd_mode = true; // if user start seraching getpreviousbilldata should displayed
            itemFill(kyi,itemrows,cs,bp=!1)
            kMove('select', input_id, div_list, input_id, text); 
        }
        if (keyc===40){kMove('down', input_id, div_list, input_id, text)}  
        if (keyc===38){kMove('up', input_id, div_list, input_id, text)}  
        
    })

    $(t).on("input",function(){
        text=this.value.trim();
        var itemfield = "#"+idcount+"_itemsearch";
        var itemDivList = "#"+idcount+"_itemlist";
        input_id=idcount+"_itemlist";
        div_list=$("div[list="+input_id+"]");
        document.getElementById("statusinfo").innerHTML=""
        if(text==""){$(idl).empty(),kyi=-1, divlistHide(); return;}
        var itemurl = "/itemsearchenter?idf=items&getcolumn=name&limit=5";
        $.ajax({
            type:"GET",url:itemurl, 
            data: {action:"search",type:'itemsearch',name:text.toUpperCase(),cs:cs, limit:itemdatalimit,},
            success:function(result){
                $(div_list[0]).empty()
                document.getElementById("statusinfo").innerHTML=""
                itemrows = JSON.parse(result)
                
                for(var o in itemrows){
                    var r=itemrows[o];
                    $(div_list[0]).append("<span data-id='"+o+"' id='"+o+"' >"+r.name+"</span>")
                }
                div_list.show(100);
                //$("div[list="+input_id+"]").show(100)
                //kMove("text",input_id,div_list,input_id,text)
            }
        })
    kyi=0;
    $("div[list]").hide();
    });
}

function recdicItemTemplateUpdate(itmrow,idc,n){

    var dbstkarray = [];
    var stockid = null;
    var dbstock = 0;
    var dbbatchstock = 0;
    var batchno = "";
    var expdate = "";
    var totstk = 0 // will add to main result key-value pair
    if (itmrow.hasOwnProperty('stockarray')){
        dbstkarray = itmrow['stockarray'];
        if(dbstkarray.length>0){
            var dbstk = GetDBStk_stkarray(dbstkarray, ""); // No BATCH Will Available Here, remain EMPTY
            var batchno = dbstkarray[0]["batchno"];
            if (batchno==null){batchno="";}
            var stockid = dbstk["stockid"];
            var dbstock = dbstk["dbstock"];
            var dbbatchstock = dbstk["dbbatchstock"];
            var expdate = dbstk["expdate"];
            var dbbatchno = dbstk["dbbatchno"];
        }
    }else{
        recdic['grid'][idcount]['stockarray']=dbstkarray;
    }
    
    recdic['grid'][idcount] = itmrow; 
    recdic['grid'][idcount]['stockid']=stockid;
    recdic['grid'][idcount]['dbstock']=dbstock;
    recdic['grid'][idcount]['dbbatchstock']=dbbatchstock;
    recdic['grid'][idcount]['expdate']=expdate;
    recdic['grid'][idcount]['dbbatchno']=dbbatchno;
    recdic['grid'][idcount]["totstk"]=dbstock;
    recdic['grid'][idcount]["batchno"]=batchno;
    recdic['grid'][idcount]["rate_a"]=0.00; // Not in use write now but would be useful further
    // "multibat" default is false; if user give/enter qty more than the relative batch exists
    // "multibat" true condition automatically match batch wise qty and minus from stock table using stockid ;
    recdic['grid'][idcount]["multibat"]=false;  
    //console.log(itmrow)
    $('#'+idcount+'_pack').html(itmrow.pack);
    if (cs=="customer"){
        $('#'+idcount+'_rate').val(itmrow.srate);
    }else{
        $('#'+idcount+'_rate').val(itmrow.prate);
    }          
    $('#'+idcount+'_tax').html(itmrow.gst);
    document.getElementById(idcount+'_qty').focus();
    $('#'+idcount+'_itemsearch').val(itmrow.name);
    $('#'+idcount+'_batchno').val(batchno);
    $('#'+idcount+'_expdate').val(expdate);
    StatusInfoDp(itmrow, dbstock, "0.00", "0.00");
                
        ///-------------------------------------------------------------------------------------
    //for(let[a,l]of Object.entries(itemtemplate)){a in itmrow||(recdic.grid[idc][a]=l)}
}

function itemFill(kidx,row,n,a=!0){
    if(Object.entries(row).length>0){

        recdic.grid[idcount]=row[kidx];
        selecteditemrow=row[kidx];
        
        recdicItemTemplateUpdate(selecteditemrow,idcount,spedit)
        
        if(a!==1){document.getElementById(idcount+"_itemsearch").value=selecteditemrow.name}
        var l=idcount+"_qty";
        var d=idcount+"_bat";
        var s=idcount+"_exp";
        var o="01/00";
        
        // $.ajax({type:"GET",url:cshost.queryi,
        //     data:{action:"itemsonly",type:"itemsearch",jsdata:selecteditemrow.nameid,csid:recdic.pan.csid,ledgid:recdic.pan.ledgid,cs:"stock",},
        //     success:function(t){
        //         var e=JSON.parse(t),a=e.prv_row;
        //         // for(delete e.prv_row,stockrows=e,
        //         //     $("#previtems_table").empty()
        //         //     $("#previtems_table").append("<tr><th>BillDate</th><th>Inv.No</th><th>Batch</th><th>Qty</th><th>Bonus</th><th>Rate</th><th>Dis%</th><th>MRP</th><th>Amount</th></tr>"),
        //         //     i=0;i<a.length;i++)

        //         // $("#previtems_table").append("<tr><td>"+a[i].billdate+"</td><<td>"+a[i].billno+"</td><td>"+a[i].bat+"</td><td>"+a[i].qty+
        //         //         "</td><td>"+a[i].bonus+"</td><td>"+a[i].rate+"</td><td>"+a[i].dis+"</td><td>"+a[i].mrp+"</td><td>"+a[i].amt+"</td>/tr>");
        //         try{
        //             if(0===stockrows.length)
        //                 stockrecdicFill(stockrows,recdic.grid[idcount],idcount,!1),
        //                 document.getElementById(s).innerHTML="",
        //                 document.getElementById(d).innerHTML="";
        //             else if(
        //                 stockrecdicFill(stockrows,recdic.grid[idcount],idcount,!0),11!=sdc)
        //                 {o=datedbtoExp(stockrows[0].exp);
        //                 var l=datetodbExp(o);
        //                 recdic.grid[idcount].exp=o,
        //                 recdic.grid[idcount].expdbf=l,
        //                 recdic.grid[idcount].bat=stockrows[0].bat,
        //                 "suppliers"===n?(
        //                 document.getElementById(d).value=stockrows[0].bat,
        //                 document.getElementById(s).value=o):(
        //                 document.getElementById(s).innerHTML=o,
        //                 document.getElementById(d).innerHTML=stockrows[0].bat)}
        //             else"suppliers"===n?document.getElementById(d).value=stockrows[0].bat:document.getElementById(d).innerHTML=stockrows[0].bat}
        //         catch(r){
        //             stockrecdicFill(stockrows,recdic.grid[idcount],idcount,!1)}
        //         }
        //     })
        
        document.getElementById(l).focus()
        document.getElementById(l).select()
        $("div[list]").hide();
        //$("#previtems_table").empty()
     }
    }



function kMove(km, tag, divList, listattr, text, select=false){
    var visibleelements = [] ;
    var listelements = divList[0]['children'];
    var wdglen = listelements.length;

    for (i = 0; i < listelements.length; i++) {
          if (listelements[i].style.display==''){
            listelements[i].style.backgroundColor = 'white';
            visibleelements.push(listelements[i])
              }
            }
    
    if (km==='down'){
       
        if (Object.entries(visibleelements).length > 0) {
          scrollpos += scrollval;  
          kyi += 1;    
          if (visibleelements[kyi] === undefined ){
            visibleelements[kyi-1].style.backgroundColor = 'white';
            visibleelements[0].style.backgroundColor = '#f5f3ba';
            kyi=0;
            scrollpos = 0;
            }
          else {
               if (visibleelements[kyi-1] != undefined ){
                visibleelements[kyi-1].style.backgroundColor = 'white';
                visibleelements[kyi].style.backgroundColor = '#f5f3ba';
                    }
               else {
                visibleelements[kyi].style.backgroundColor = '#f5f3ba';
                        }
               }
            $(divList[0]).animate({scrollTop: scrollpos});
            } 

        } 
    else if (km==='text'){
       kyi = 0;
       scrollpos = 0;
       $(divList[0]).animate({scrollTop: scrollpos});
       for (i = 0; i < visibleelements.length; i++) {
        visibleelements[i].style.backgroundColor = 'white';
        visibleelements[0].style.backgroundColor = '#f5f3ba';
            }
        
        }  
    else if (km==='up'){
      
      for (i = 0; i < visibleelements.length; i++) {
        visibleelements[i].style.backgroundColor = 'white';
            }
      if (Object.entries(visibleelements).length > 0){ 
        
        if (kyi < 0){kyi=0;scrollpos -= 0;}
        else if (visibleelements.length===0){kyi=0;return true;}
        else if (visibleelements[kyi] === undefined ){kyi=0;  return true;} 
             else { 
                 scrollpos -= scrollval;
                 kyi-- ; 

                 $(divList[0]).animate({scrollTop: scrollpos});
                 if (wdglen < 0){
                    kyi = 0;
                    scrollpos = 0;
                    }
                 else {
                    try{
                        visibleelements[kyi].style.backgroundColor = '#f5f3ba';
                        visibleelements[kyi+1].style.backgroundColor = 'white';
                        }
                    catch(err){
                        visibleelements[0].style.backgroundColor = '#f5f3ba';
                        // visibleelements[1].style.backgroundColor = 'white';
                        }
                    }       
                  }
                }
               $(divList[0]).animate({scrollTop: 0});
              
              }

    else if (km==='select'){
      
      if (select){
          if (visibleelements[kyi] === undefined ){
            if(recdic['dbmess']==='update'){return true;} 
            if (text===undefined){text=$('input['+tag+']').val().toUpperCase();}
            else {text='';}
            }
          else {text = visibleelements[kyi].innerHTML;}
        }
      // default selection of ZERO index element value when data available and key not moved up down
     
      divlistHide()
      kyi = 0;
      scrollpos = 0;
      }
    }

function divlistHide(kc=0){
  kyi = kc;
  $('div[list]').hide();
  }

// function searchTypeAhead(s, n, m, r, l){
//      $(s).typeahead({name:n, method:m, remote:r, limit:l });
// } ;

// function suppostAjax(searchtxt, seturl, gptype, idf, keyc,){
//     var dbrows = [];  
//     var csname = document.getElementById("cssearch").innerHTML;
    
//     $.ajax({
//         url: seturl,
//         type: gptype,
//         data: {name:csname,searchtxt:searchtxt, idf:idf, limit:keyc},
//         dataType: 'json',
//         success: function(result) {
//             recdic['pan'] = result[0]; 
//             recdic['pan']["billas"]='M'; // Default to Main Bill
//             recdic['pan']["itype"]='1'; // 1==> for unregisted party; 2==> for registerd party
//             $('.tt-dropdown-menu').css('display', 'none');
//             $('#phone').html(result[0].phone);
//             $('#add1').html(result[0].add1);
//             $('#add2').html(result[0].add2);
//             $('#add3').html(result[0].add3);
//             if (posdict[result[0].add3] != null){
//                  $('#add3').html(posdict[result[0].add3].toUpperCase());
//             }
//             $('#gstn').html(result[0].gstn);
//             $('#regn').html(result[0].regn);
//             //$('#supsearch').val(result[0].name );
//             document.getElementById('0_itemsearch').focus();
//             // document.getElementById('0_itemsearch').focus();
//             // document.getElementById('supsearch').value = result.dbrows[0].name;    
//                 }
//             });
//         }


// function propostAjax(name, searchtxt, seturl, gptype, idf, keyc, info){
//     cs = document.getElementById("sp").innerHTML.toLowerCase().trim();
//     var totstk = 0 // will add to main result key-value pair
//     var dbstkarray = [];
//     var dbstock = 0;
//     var batchno = "";
//     var dbbatchstock = 0;
//     var dbbatchno = "";
//     var stockid = null;
//     var expdate = "";
   
//     $.ajax({
//         url: seturl,
//         type: gptype,
//         data: {name:name,searchtxt:searchtxt, idf:idf, limit:keyc, info:info},
//         dataType: 'json',
//         success: function(result) {
           
//             if(result.length > 0){
//                 totstk = 0;
//                 dbstkarray = result[0]['stockarray'];
//                 if(dbstkarray.length>0){
                
//                     var dbstk = GetDBStk_stkarray(dbstkarray, ""); // No BATCH Will Available Here, remain EMPTY
                
//                     batchno = dbstkarray[0]["batchno"];
//                     if (batchno==null){batchno="";}
                    
//                     stockid = dbstk["stockid"];
//                     dbstock = dbstk["dbstock"];
//                     dbbatchstock = dbstk["dbbatchstock"];
//                     expdate = dbstk["expdate"];
//                     dbbatchno = dbstk["dbbatchno"];
                   
//                 }
//                 recdic['grid'][idcount] = result[0]; 
//                 recdic['grid'][idcount]['stockid']=stockid;
//                 recdic['grid'][idcount]['dbstock']=dbstock;
//                 recdic['grid'][idcount]['dbbatchstock']=dbbatchstock;
//                 recdic['grid'][idcount]['expdate']=expdate;
//                 recdic['grid'][idcount]['dbbatchno']=dbbatchno;
//                 recdic['grid'][idcount]["totstk"]=dbstock;
//                 recdic['grid'][idcount]["batchno"]=batchno;
//                 recdic['grid'][idcount]["rate_a"]=0.00; // Not in use write now but would be useful further
//                 // "multibat" default is false; if user give/enter qty more than the relative batch exists
//                 // "multibat" true condition automatically match batch wise qty and minus from stock table using stockid ;
//                 recdic['grid'][idcount]["multibat"]=false;  
//                 $('.tt-dropdown-menu').css('display', 'none');
//                 $('#'+idcount+'_pack').html(result[0].pack);
//                 if (cs=="customer"){
                    
//                     $('#'+idcount+'_rate').val(result[0].srate);
//                 }else{

//                     $('#'+idcount+'_rate').val(result[0].prate);
//                 }
                
//                 $('#'+idcount+'_tax').html(result[0].gst);
//                 document.getElementById(idcount+'_qty').focus();
//                 $('#'+idcount+'_itemsearch').val(result[0].name);
//                 $('#'+idcount+'_batchno').val(batchno);
//                 $('#'+idcount+'_expdate').val(expdate);
//                 StatusInfoDp(result[0], dbstock, "0.00", "0.00");
                
//            }
//         }

//         });
//      }


function billnoSET(dpidtag, bstartstring, fyear, billas='M'){
  $.ajax({
     url: cshost,
     type: "GET",
     data: {
        name:cs.trim(),
        getcolumn:"billno",
        limit:{"billhead":bstartstring,
        "fyear":fyear, "billas":billas}, 
        idf:"billnoset", 
        },
     dataType: 'json',
     success: function(result) {
        var billno = bstartstring+"00001";
        if(result.length > 0){
            var dbbillno = result[0]["billno"];
            if (dbbillno){
                var bn = parseInt(dbbillno.split(bstartstring)[1])+1;  
                var bnstr = ('00000'+bn).slice(-5);
                billno = bstartstring+bnstr;
            }
        }
        $(dpidtag).val(billno);
     
     }
  });
}
  
$('.typeahead').on('typeahead:selected', function(evt, item, name) {
    var searchtxt = this.value; 
    if (name.trim()=='supplier'){
        // Selected on click
        var m_cshost = cshost+"?name=%QUERY&idf="+cs+"&getcolumn=all&limit=1" // required for GET method only
        suppostAjax(searchtxt, m_cshost, 'POST', 'supsearch||selection||all||'+cs.trim(), 1,);
        
        //suppostAjax(searchtxt, cshost, 'POST', 'typeahead, selected', 0, );
        }
    if (name.trim()=='customer'){
        // Selected on click
        var m_cshost = cshost+"?name=%QUERY&idf="+cs+"&getcolumn=all&limit=1" // required for GET method only
        suppostAjax(searchtxt, m_cshost, 'POST', 'supsearch||selection||all||'+cs.trim(), 1,);

        //suppostAjax(searchtxt, cshost, 'POST', 'typeahead, selected', 0, );
        }
    if (name.trim()=='products'){
        var m_itemhost = itemhost+"?name=%QUERY&idf=items&getcolumn=all&limit=1" // required for GET method only
        propostAjax(name, searchtxt, m_itemhost, 'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});
        }
    });

$('#0_itemsearch').on('keydown', function(e) {
    var keyc = e.keyCode || e.which;
    var searchtxt = this.value; 
    if (keyc == 13){
        var m_itemhost = itemhost+"?name=%QUERY&idf=items&getcolumn=all&limit=1" // required for GET method only
        propostAjax("items", searchtxt, m_itemhost, 'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});
        } ;
    });

$('#supsearch').on('keydown', function(e) {
    var keyc = e.keyCode || e.which;
    var searchtxt = this.value; 
    $("#add1").html('');
    $("#add2").html('');
    $("#add3").html('');
    if (keyc === 13){ 
        // Selected from KeyBord on Press Enter
        var m_cshost = cshost+"?name=%QUERY&idf="+cs+"&getcolumn=all&limit=1" // required for GET method only
        suppostAjax(searchtxt, m_cshost, 'POST', 'supsearch||selection||all||'+cs.trim(), keyc,); };
        });

function onItemSearchFocus(evt){
    idcount = document.activeElement.id.split('_')[0];
    document.getElementById("0_itemsearch").scrollIntoView();};

function getFocusedID(evt){
    idcount = document.activeElement.id.split('_')[0];
    document.getElementById("statusinfo").innerHTML = "";
    if(typeof(recdic['grid'][idcount]) == 'undefined'){
        document.getElementById("statusinfo").innerHTML = "DATA NOT AVALIABLE ! ErrorCode[348;itemappend]";
        document.getElementById("statusinfo2").innerHTML = "";
    }else{
        if (typeof(recdic['grid'])=== "string"){
            var grid = JSON.parse(recdic['grid']) ;
            recdic['grid']=grid;
            var rgi = recdic['grid'][idcount];
            if(typeof(rgi) == "undefined"){
              recdic['grid'][idcount] = selecteditemrow;
              recdicItemTemplateUpdate(selecteditemrow, idcount, spedit);
              rgi = recdic['grid'][idcount];
 
            }
   
            var gstamt = rgi["ttaxamt"];
            var disamt = rgi["tdisamt"];
            recdic['grid'] = grid;
            var dbstk = GetDBStk_stkarray(recdic['grid'][idcount]["stockarray"], recdic['grid'][idcount]["batchno"]);
            recdic['grid'][idcount]['stockid']=dbstk["stockid"];
            recdic['grid'][idcount]['dbstock']=dbstk["dbstock"];
            recdic['grid'][idcount]['dbbatchstock']=dbstk["dbbatchstock"];
            recdic['grid'][idcount]['expdate']=dbstk["expdate"];
            recdic['grid'][idcount]['dbbatchno']=dbstk["dbbatchno"];
            
            gstamt = rgi["ttaxamt"];
            disamt = rgi["tdisamt"];
            StatusInfoDp(rgi, dbstk["dbstock"], gstamt, disamt);
        }else{
            var rgi = recdic['grid'][idcount];
            var dbstk = GetDBStk_stkarray(rgi["stockarray"], rgi["batchno"]);
            rgi['stockid']=dbstk["stockid"];
            rgi['dbstock']=dbstk["dbstock"];
            rgi['dbbatchstock']=dbstk["dbbatchstock"];
            rgi['expdate']=dbstk["expdate"];
            rgi['dbbatchno']=dbstk["dbbatchno"];
            
            gstamt = rgi["ttaxamt"];
            disamt = rgi["tdisamt"];
            StatusInfoDp(rgi, dbstk["dbstock"], gstamt, disamt);
        }
        
     }
 }

function StatusInfoDp(rgi, dbstock, gstamt, disamt){
    //if (isNaN(disamt)){disamt = 0;}
    
    gstamt = parseFloat(gstamt).toFixed(2);
    disamt = parseFloat(disamt).toFixed(2);
    document.getElementById("statusinfo").innerHTML = "Bat: "+rgi["batchno"]+" Bat-Qty:"+rgi["dbbatchstock"]+" Total Stock: "+dbstock;
    var mrp_hsn = "MRP: Rs."+rgi["mrp"]+" /- HSNCode: "+rgi["hsn"]+" GST: "+gstamt+" Discount: "+disamt;
    document.getElementById("statusinfo2").innerHTML = mrp_hsn;
}

