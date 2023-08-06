
function validateDBEntry(savebool){
  
  if (typeof recdic['pan']['name']=='undefined'){
      CreateAlertDiv("Party Name Not Selected "+
        "OR Page Reloaded... Select Party Again !!"); 
      savebool=false;
      window.scrollTo(0,0);
      return savebool;}
    
    if (recdic['pan'].name==undefined){CreateAlertDiv("Either Party Name Not Selected "+
        "OR Page Reloaded... Select Party Again !!"); 
      savebool=false;
      window.scrollTo(0,0);
      return savebool;}
    
    if (recdic['pan']['billno']===""){CreateAlertDiv("Wait.. !! Invoice Number Not Given !! "); 
       savebool=false;
       window.scrollTo(0,0);
       return savebool;}

    if (typeof recdic['grid'][0]=='undefined'){CreateAlertDiv("Item Name Not Selected !! "); 
      savebool=false;
      window.scrollTo(0,20);
      return savebool;}

    if (isNaN(recdic['grid'][0]['qty'])){CreateAlertDiv("Item or Qty Not Given, Fill Both !! "); 
       // Checking first row of grid item ONLY 
       savebool=false;
       window.scrollTo(0,20);
       return savebool;}
    if (recdic['grid'][0]['qty']=='0'){CreateAlertDiv("ZERO Qty Not Allowed !! "); 
       // Checking first row of grid item ONLY 
       savebool=false;
       window.scrollTo(0,20);
       return savebool;}
    return savebool;
    };

function DbSaveBill(recdicdata, cs, mode, method, givenurl){
    var main = true;
    if(document.getElementById("cscr").value === "CHALLAN"){main = false;}
    $.ajax({
     url: givenurl,
     type: method,
     data: {getdata:recdicdata,idf:cs, mode:mode, main:main},
     dataType: 'json',
     success: function(result) {
        // result data must be here *** this is not working here check in dbsearch.js sendbilltodb POST method 
        //console.log(mode, "Saved", result);
        //showPrintConfirm(); // this print function using in onSave function which is risky or incorrect; remember
     }
  });
}

function showPrintConfirm(){
  $('#save').css('display', 'none');
  $('#update').css('display', 'none');
  $('#delete').css('display', 'none');
  $('#reset').css('display', 'none');
  $('#close').css('display', 'none');
  $('#exportpdf').css('display', 'none');
  $('#exportxls').css('display', 'none');
  $('#deleteconfirm').css('display', 'none');
  $('#printconfirm').css('display', 'inline-flex');
  $('#printcancel').css('display', 'inline-flex');
  $('#printconfirm').css('text-align', 'center');
  $('#printcancel').css('text-align', 'center');
  $('#printconfirm').focus();
  }

function hidePrintConfirm(){
  $('#save').css('display', 'inline-flex');
  $('#delete').css('display', 'inline-flex');
  $('#reset').css('display', 'inline-flex');
  $('#close').css('display', 'inline-flex');
  $('#deleteconfirm').css('display', 'none');
  $('#printconfirm').css('display', 'none');
  $('#printcancel').css('display', 'none');
  //$('#reset').focus();
  window.location.reload(); 
  }

function playGIF(imgsrc){
    image = document.getElementById('rungif');
    divgid = document.getElementById('gifboard');
    divgid.classList.add("gifboard");
    image.src = imgsrc;
    $('#rungif').show();
}

function stopGIF(){
    //element.classList.remove("mystyle");
    $("#gifboard").removeClass("gifboard");
    $('#rungif').hide();
}

function getLogo(url){
    var img = new Image();
    img.src = url ;
    return img;
};

function SFStr(v){
    try{return parseFloat(v).toFixed(2).toString();}
    catch(err){return "[err]"}
}
function CreatePDF(rscr, recdic, ornt="landscape", invtype="GST-Invoice"){
    
    var doc = new jsPDF({orientation:ornt});
  
    var pgwh = {"landscape":[300, 210, 10], "potrait":[210, 300, 10],}
    var page = pgwh[ornt];
    var [pageWidth, pageHight, pgpadd] = pgwh[ornt];
    var hln = pgpadd; 
    var hlnspace = 7;
    var shlnspace = 4;
    var centerpos = (pageWidth/2)-(pgpadd*3); // center postion with text adjustment toward left side * 3 means left,right and center
    var pagetop_v_col_heigth = 60;
    var itemheader_firstline_v_col_start = pagetop_v_col_heigth+7;
    var item_vline_height = itemheader_firstline_v_col_start+73; // 73 is force increment for line height;
    var vfp = 100;
    var btmTaxPos = 140; // force position
    var btmTaxColHeight = btmTaxPos+32; // only for GST tax rate collection at Bottom of this page;
    var [gtcl1,gtcl2,gtcl3,gtcl4,gtcl5,gtcl6,gtcl7,gtcl8] = [pgpadd+13,pgpadd+32,pgpadd+52,pgpadd+72,pgpadd+92,pgpadd+110,pgpadd+142,pgpadd+170]
    var btm_vcol = 145 // for bottom tax rows; verical posotion of taexs;
  
    var bottpayl = pgpadd+221;
    var bottpayv = pgpadd+247;
    var tmctxt1 = vfp+20;  // top middle column text "Inv.No" static label
    var tmctxt2 = vfp+42; // top middle column text "Inv.No" variable values
    var tmctxt3 = vfp+66; // top middle column text "L.R No" static label
    var tmctxt4 = vfp+88; // top middle column text "L.R No" variable values
    var tmcVL1 = vfp+19 ; // top middle column vertical line 1 static line (Left Side);; 
    var tmcVL2 = tmctxt2-1 // top middle column vertical line 2 of "Inv.No" varaibel values;
    var tmcVL3 = tmctxt3-1 // top middle column vertical line 3 of "L.R.No" static label;
    var tmcVL4 = tmctxt4-1 // top middle column vertical line 4 of "L.R.No" varaibel values;
    var tmcVL5 = pageWidth-(vfp-11) ; // top middle column vertical static line (Right Side);
    var tmcHLwidth = pageWidth-(vfp-11);
    
    var vfmid = 6; // vertical first section line space
    var toplefthz = pgpadd;
    var toprighthz = pgpadd;
    var toprightvt = pgpadd;
    var toprighttxt = pgpadd;
    var ifsz = 10;           // item font size
    var partyfontsize = ifsz+4;
    var rp = recdic['pan'] ;
    var rg = recdic['grid'] ;
    
    //var [owner,oadd1,oadd2] = rscr['owner']['ownername'].split(',');
   // var ownervar = rscr['owner']['ownervar'];
    //var ownerstatic = rscr['owner']['ownerstatic'];

    var [owner,oadd1,oadd2,oadd3] = rscr['userinfo']['ownerstatic'];
    
    
    var bank1 = rscr['bankinfo']['bank1'];
    var bank2 = rscr['bankinfo']['bank2'];
    
    var totitems = 0;
    var totqty = 0;
    //var bluetxt = [24, 54, 204];
    //var url = '../../public/img/mylogo.png';
    var url = '../../mylogo.png';
    $.getScript(url);
    var mylogo = getLogo(url);
    //var mylogo = new Image()
    //mylogo.src = '../../static/img/mylogo.png';
    doc.setProperties({
            title: 'MEDI_SALES_BILL',
            subject: 'to Party Name',     
            author: 'http://meditradesoft.in/',
            keywords: 'sale, item, total',
            creator: 'Abhishek Gupta'
        });

    //oc.setFont("Arial"); //doc.setFont("courier");
   
    doc.setFontType("bold");
    doc.setFontSize(partyfontsize-2);
    hln += hlnspace
    doc.setTextColor(33, 24, 99);
    doc.text(centerpos+23, hln, invtype); 
    doc.setFontSize(ifsz);
    hln += hlnspace
    
    doc.text(centerpos+pgpadd+18, hln-2, rp['cscr']); 
    
    doc.setTextColor(0, 0, 0);
    //page boarder top horizontal line
    doc.line(pgpadd, pgpadd, pageWidth-pgpadd, pgpadd); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    //page boarder bottom horizontal line
    doc.line(pgpadd, pageHight-pgpadd, pageWidth-pgpadd, pageHight-pgpadd); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    //page boarder left vertical line
    doc.line(pgpadd, pgpadd, pgpadd, pageHight-pgpadd);  //vertical line (start_col, start_row, end_col, end_row)
    //page boarder roght vertical line
    doc.line(pageWidth-pgpadd, pgpadd, pageWidth-pgpadd, pageHight-pgpadd);  //vertical line (start_col, start_row, end_col, end_row)
    
    //first Horizontal Line
    //hln += hlnspace
    doc.line(tmcVL1, hln, tmcHLwidth, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    
    hln += vfmid
    doc.line(tmcVL1, hln, tmcHLwidth, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)

    //toprightvt = vfp+83;
   
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt1, hln-1, 'Invoice.No:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt2, hln-1, rp['billno']); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt3, hln-1, 'L.R.No:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt4, hln-1, '________'); // (horizontal_col_pos, vertical_row_pos, text)

    hln += vfmid
    doc.line(tmcVL1, hln, tmcHLwidth, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    
    //toprightvt = vfp+83;
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt1, hln-1, 'Invoice.Date:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt2, hln-1, rp['billdate']); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt3, hln-1, 'L.R.Date:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt4, hln-1, rp['billdate']); // (horizontal_col_pos, vertical_row_pos, text)

    hln += vfmid
    doc.line(tmcVL1, hln, tmcHLwidth, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
  
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt1, hln-1, 'Order.No:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt2, hln-1, rp['billno']); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt3, hln-1, 'Boxes:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt4, hln-1, '________'); // (horizontal_col_pos, vertical_row_pos, text)

    hln += vfmid
    doc.line(tmcVL1, hln, tmcHLwidth, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)

    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt1, hln-1, 'Order.Date:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt2, hln-1, rp['billdate']); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt3, hln-1, 'Due Date:'); // (horizontal_col_pos, vertical_row_pos, text)
    doc.setFontSize(ifsz+1);
    doc.setFontType("bold");
    doc.text(tmctxt4, hln-1, '7 Days'); // (horizontal_col_pos, vertical_row_pos, text)

    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(tmctxt1, hln+5, 'Transport :-'); // (horizontal_col_pos, vertical_row_pos, text)

    doc.line(tmcVL2, hln, tmcVL2, vfmid*4);  //vertical line of "Inv.No col static" (start_col, start_row, end_col, end_row)
    doc.line(tmcVL3, hln, tmcVL3, vfmid*4);  //vertical line of "Inv.No col variable"(start_col, start_row, end_col, end_row)
    doc.line(tmcVL4, hln, tmcVL4, vfmid*4);  //vertical line (start_col, start_row, end_col, end_row)
    
    toplefthz += hlnspace
    //doc.text(pgpadd+2, toplefthz, 'LOGO');
    //doc.addImage(mylogo, 'png', 90, 10, 19, 19);
    //doc.addImage(niceimage, 'PNG' 15, 40, 50, 60);

    doc.setFontSize(partyfontsize+2);
    doc.setFontType("bold");
    toplefthz += 16
    doc.setTextColor(33, 24, 99);
    doc.text(pgpadd+2, toplefthz, owner);
    

    toplefthz += shlnspace
    doc.setFontSize(ifsz);
    doc.setFontType("bold");
    doc.text(pgpadd+2, toplefthz, oadd1);
    toplefthz += shlnspace
    doc.text(pgpadd+2, toplefthz, oadd2);
    toplefthz += shlnspace
    doc.text(pgpadd+2, toplefthz, 'Phone No');
    doc.text(pgpadd+18, toplefthz, rscr['userinfo']['phone']);
    toplefthz += shlnspace
    doc.text(pgpadd+2, toplefthz, 'R.N/D.L.N:');
    doc.text(pgpadd+19, toplefthz, rscr['userinfo']['regn']);
    toplefthz += shlnspace
    doc.text(pgpadd+2, toplefthz, 'GSTN:');
    doc.text(pgpadd+15, toplefthz, rscr['userinfo']['gstn']);
    toplefthz += shlnspace
    doc.text(pgpadd+2, toplefthz, 'Email:');
    doc.text(pgpadd+15, toplefthz, rscr['userinfo']['email']);
    doc.setTextColor(0, 0, 0);
   
    doc.setFontSize(ifsz-1);
    doc.setFontType("italic");
    toprighttxt = tmctxt4+25; //toprightvt+35;
    toprighthz += shlnspace
    doc.text(toprighttxt, toprighthz, 'Party Name :');
    toprighthz += hlnspace
    doc.setFontSize(partyfontsize-2);
    doc.setFontType("bold");
    doc.setTextColor(33, 24, 99);
    doc.text(toprighttxt, toprighthz, rp['name']);
    
    toprighthz += shlnspace
    doc.setFontSize(ifsz);
    doc.setFontType("normal");
    doc.text(toprighttxt, toprighthz, rp['add1'].toString());
    toprighthz += shlnspace
    doc.text(toprighttxt, toprighthz, rp['add2'].toString());
    toprighthz += shlnspace
    doc.text(toprighttxt, toprighthz, 'Phone No');
    doc.text(toprighttxt+18, toprighthz, rp['mobile'].toString());
    toprighthz += shlnspace
    doc.text(toprighttxt, toprighthz, 'R.N/D.L.N:');
    doc.text(toprighttxt+19, toprighthz, rp['regn'].toString());
    toprighthz += shlnspace
    doc.text(toprighttxt, toprighthz, 'GSTN:');
    doc.text(toprighttxt+15, toprighthz, rp['gstn'].toString());
    toprighthz += shlnspace
    doc.text(toprighttxt, toprighthz, 'Email:');
    doc.text(toprighttxt+15, toprighthz, rp['email'].toString());
    doc.setTextColor(0, 0, 0);
    toprighthz += shlnspace
    doc.setFontType("bolditalic");
    doc.text(toprighttxt, toprighthz, 'Delivery At :');
    doc.setFontType("normal");
    
    hln = pagetop_v_col_heigth; // force position
    //vertical first left partition 
    doc.line(tmcVL1, pgpadd, tmcVL1, hln);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical second left partition 
    doc.line(tmcVL5, pgpadd, tmcVL5, hln);  //vertical line (start_col, start_row, end_col, end_row)
    //horizontal first section end
    doc.line(pgpadd, hln, pageWidth-pgpadd, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    //horizontal first section end


    doc.line(pgpadd, itemheader_firstline_v_col_start, pageWidth-pgpadd, itemheader_firstline_v_col_start); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    
    var itemsheader = {'sno':['S.N', 1, ifsz-1],'hsn':['HSN',8, ifsz-2],'name':['Item Name',19, ifsz],'pack':['Pack',99, ifsz-2],
    'qty':['Qty',110, ifsz],'bonus':['Free',125, ifsz],'batchno':['Batch',137, ifsz-3],'expdate':['Exp',160, ifsz],'mrp':['MRP',170, ifsz],
    'rate':['Rate',188, ifsz],'dis':['Dis',205, ifsz],'tax':['TAX',215, ifsz],'amt':['Amount',225, ifsz],
    'ttaxamt':['TaxAmt',245, ifsz-2],'netamt':['Netamount',261, ifsz], };
    for (const [i, vl] of Object.entries(itemsheader)) {
        doc.text(pgpadd+vl[1], itemheader_firstline_v_col_start-2, vl[0]);
        if (vl[1]>1){
        doc.line(pgpadd+(vl[1]-1), itemheader_firstline_v_col_start-hlnspace, 
        pgpadd+(vl[1]-1), item_vline_height);  //vertical line (start_col, start_row, end_col, end_row)
        }
        };
    
    var gstxdict = {};

    for (const [key, value] of Object.entries(recdic['grid'])) {
        itemheader_firstline_v_col_start += 4;
       
        if (typeof value !== "undefined") {
            totitems += 1;
            totqty += value['tqty'];
            //if value['tqty']
            //console.log(value);
            for (const [k, v] of Object.entries(value)){
                if (typeof itemsheader[k] !== "undefined"){
                    doc.setFontSize(itemsheader[k][2]);
                    doc.text(pgpadd+itemsheader[k][1], itemheader_firstline_v_col_start, v.toString())
                    //try{console.log(pgpadd+itemsheader[k][1], ' == ', k,' == ',v.toString())}
                }
            }
           // collection tax wise information for tax display 
           if(value['tax']in gstxdict){gstxdict[value['tax']].push(value)}
           else{gstxdict[value['tax']]=[value];}     
        }    
    }
   
    doc.setFontSize(ifsz);
    hln = btmTaxPos; // force position
    //horizontal bottom first section end
    doc.line(pgpadd, hln, pageWidth-pgpadd, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    
    //vertical taxclass sections 1st
    //doc.line(pgpadd+25, vfp, pgpadd+25, vfp+29);  //vertical line (start_col, start_row, end_col, end_row)
    doc.line(gtcl1, btmTaxPos, gtcl1, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 2nd
    //doc.line(pgpadd+57, vfp, pgpadd+57, vfp+29);  //vertical line (start_col, start_row, end_col, end_row)
    doc.line(gtcl2, btmTaxPos, gtcl2, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 3rd
    //doc.line(pgpadd+85, vfp, pgpadd+85, vfp+29);  //vertical line (start_col, start_row, end_col, end_row)
    doc.line(gtcl3, btmTaxPos, gtcl3, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 4rth
    doc.line(gtcl4, btmTaxPos, gtcl4, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 5th
    doc.line(gtcl5, btmTaxPos, gtcl5, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 6th
    doc.line(gtcl6, btmTaxPos, gtcl6, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 7th
    doc.line(gtcl7, btmTaxPos, gtcl7, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 8th
    doc.line(gtcl8, btmTaxPos,gtcl8, btmTaxColHeight);  //vertical line (start_col, start_row, end_col, end_row)
    //vertical taxclass sections 9th
    doc.line(pageWidth-70, btmTaxPos, pgpadd+220, pageHight-pgpadd);  //vertical line (start_col, start_row, end_col, end_row)
    
    hln = btm_vcol+1; // force position
    
    //horizontal bottom second section end
    
    doc.line(pgpadd, btm_vcol+1, pageWidth-pgpadd, btm_vcol+1); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    doc.setFontSize(ifsz-1);
    doc.setFontType("normal");

    
    var gtspadd = [pgpadd,pgpadd+16,pgpadd+35,pgpadd+55,pgpadd+75,pgpadd+100,pgpadd+122, pgpadd+145,];
    var gts = ['TAX', 'AMOUNT', 'S4HEME', 'DISCOUNT', 'CGST', 'SGST', 'IGST', 'TOTAL'];
    for (let i = 0; i < gts.length; i++) {
        doc.text(gtspadd[i], btm_vcol, gts[i]); 
        
        }

    var gamt = 0;
    var gtdisamt = 0;
    var gigst = 0;
    var gcgst = 0;
    var gsgst = 0;
    var gttaxamt = 0
    var gnetamt = 0;
    var gstxlength = Object.keys(gstxdict).length ;
    var statictaxlength = 5; //Total GSTAX available == 5 only;
    var blankrows = statictaxlength - gstxlength;  

    for (const [key, value] of Object.entries(gstxdict)) {
        var amt = 0;
        var tdisamt = 0;
        var cgst = 0;
        var sgst = 0;
        var igst = 0;
        var sumtax = 0;
        var ttaxamt = 0;
        var bonus = 0;
        var netamt = 0;
        for (let i = 0; i < value.length; i++) {

            amt += parseFloat(value[i]['amt']);
            tdisamt += parseFloat(value[i]['tdisamt']);
            cgst += parseFloat(value[i]['cgst']);
            sgst += parseFloat(value[i]['sgst']);
            sumtax = cgst + sgst
            igst += sumtax;
            ttaxamt += parseFloat(value[i]['ttaxamt']);
            netamt += parseFloat(value[i]['netamt']);
            bonus = value[i]['bonus'];

            
        }
        gamt += amt;
        gtdisamt += tdisamt;
        gcgst += cgst;
        gsgst += sgst;
        gigst += igst;
        gnetamt += netamt;

        hln += shlnspace
        doc.text(gtspadd[0], hln, key.toString()+' % ');
        doc.text(gtspadd[1], hln, amt.toFixed(2).toString());
        doc.text(gtspadd[2], hln, bonus.toString());
        doc.text(gtspadd[3], hln, tdisamt.toFixed(2).toString());
        doc.text(gtspadd[4], hln, cgst.toFixed(2).toString());
        doc.text(gtspadd[5], hln, sgst.toFixed(2).toString());
        doc.text(gtspadd[6], hln, igst.toFixed(2).toString());
        doc.text(gtspadd[7], hln, netamt.toFixed(2).toString());
        }
    for (let i = 0; i < blankrows; i++) {
        // creating blank space left when reseved space for required tax rate not exists;
        hln += shlnspace;
    }
    
    doc.text(pgpadd+180, btm_vcol, 'Item  &  Qty');
    ;
    doc.text(bottpayl, btm_vcol, 'TOTAL Amount:');
   
    doc.setFontSize(ifsz+2);
    doc.setFontType("bold");
    
    doc.text(bottpayv, btm_vcol, SFStr(rp['tamt']));
    
    doc.setFontSize(ifsz-1);
    doc.setFontType("normal");
    btm_vcol += shlnspace
    btm_vcol += 1;
   
    doc.text(pgpadd+175, btm_vcol, 'Total Items:');
    doc.text(pgpadd+195, btm_vcol, totitems.toString());
    doc.text(bottpayl, btm_vcol, 'DIS.AMT:'); 
    doc.text(bottpayv, btm_vcol, SFStr(rp['tdisamt']));
    
    btm_vcol += shlnspace;
    doc.text(pgpadd+175, btm_vcol, 'Total Qty:');
    doc.text(pgpadd+195, btm_vcol, totqty.toString());
    doc.text(bottpayl, btm_vcol, 'GST Payable:');
    doc.text(bottpayv, btm_vcol,SFStr(rp['ttaxamt']));

    btm_vcol += shlnspace;
    
    doc.text(bottpayl, btm_vcol, 'Taxable Amount:'); 
    doc.text(bottpayv, btm_vcol, SFStr(rp['tsubtot']));
    btm_vcol += shlnspace

    
    doc.text(bottpayl, btm_vcol, 'Round Off:');
    doc.text(bottpayv, btm_vcol, recdic['pan']['roundoff'].toString());
    
    //horizontal line taxclass bottom section 
    doc.line(pgpadd, btmTaxColHeight-(shlnspace+1), pageWidth-70, btmTaxColHeight-(shlnspace+1)); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    
    hln += (shlnspace+1)
    doc.setFontType("bold");
    
    
    doc.text(gtspadd[0], hln, 'TOTAL');
    doc.text(gtspadd[1], hln, gamt.toFixed(2).toString());
    doc.text(gtspadd[2], hln, '---- ');
    doc.text(gtspadd[3], hln, gtdisamt.toFixed(2).toString());
    doc.text(gtspadd[4], hln, gcgst.toFixed(2).toString());
    doc.text(gtspadd[5], hln, gsgst.toFixed(2).toString());
    doc.text(gtspadd[6], hln, gigst.toFixed(2).toString());
    doc.text(gtspadd[7], hln, gnetamt.toFixed(2).toString());

    doc.text(bottpayl, hln+1, 'CR/DR Note:');
    doc.text(bottpayv, hln+1, '0.00');

    //horizontal line taxclass bottom section 
    doc.line(pgpadd, hln+1, pageWidth-70, hln+1); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    hln += (shlnspace+1)
    doc.setFontType("bold");
    
    //doc.text(pgpadd+2, hln, 'Rs - '+NumToWords(rp['rgtot']));
    doc.text(pgpadd+2, hln, 'Rs - ');
    //hln += (shlnspace-2)
    //horizontal line total amount in words bottom section 
    doc.line(pgpadd, hln+1, pageWidth-70, hln+1); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)
    hln += shlnspace
    doc.text(pgpadd+2, hln, 'MSG: ');
    doc.text(bottpayl, hln-1, 'Other: ');
    doc.text(bottpayv, hln-1, ' 0.00 ');
    
    doc.setTextColor(33, 24, 99);
    doc.text(pageWidth-65, hln+7, ' Grand Total ');
    doc.setFontSize(partyfontsize);
    doc.text(pageWidth-65, hln+13, parseFloat(rp['gtot']).toFixed(0).toString()+".00 /-" ); //
    doc.setFontSize(ifsz-1);
    doc.setTextColor(0, 0, 0);
    hln += 1;
    //vertical last bottom sections
    doc.line(pageWidth-150, hln, pageWidth-150, pageHight-pgpadd);  //vertical line (start_col, start_row, end_col, end_row)
    doc.setFontType("italic");

    //horizontal line total amount in words bottom section 
    //doc.line(pgpadd, hln, pageWidth-70, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)

    //hln = 180; // force position
    //horizontal bottom second section end
    
    doc.line(pgpadd, hln, pageWidth-pgpadd, hln); //Horizontal Line (start_pos, start_horizontal_pos, width_number,  end_pos)

    hln += shlnspace
    
    doc.text(pgpadd+5, hln, 'BANK UPID: ');
    doc.text(pgpadd+30, hln, bank1.upid);
    doc.text(pgpadd+75, hln, bank2.upid);
    doc.setFontType("bold");
    doc.text(pageWidth-149, hln, 'For ');
    doc.text(pageWidth-141, hln, owner);
    doc.text(pageWidth-145, hln+12, 'Authorised Signatory');
   
    hln += shlnspace
    doc.setFontType("normal");
    doc.text(pgpadd+2, hln, 'A/C No:');
    doc.text(pgpadd+14, hln, bank1.ac);
    doc.text(pgpadd+40, hln, ', IFSCode:');
    doc.text(pgpadd+55, hln, bank1.ifsc);
    doc.text(pgpadd+80, hln, '; ');
    doc.text(pgpadd+82, hln, bank1.name);
    hln += shlnspace
    doc.text(pgpadd+2, hln, 'A/C No:');
    doc.text(pgpadd+14, hln, bank2.ac);
    doc.text(pgpadd+40, hln, ', IFSCode:');
    doc.text(pgpadd+55, hln, bank2.ifsc);
    doc.text(pgpadd+80, hln, '; ');
    doc.text(pgpadd+82, hln, bank2.name);

    hln += 3
    doc.setFontType("italic");
    doc.text(pgpadd+5, hln, 'Terms & Conditions :');
    hln += 3
    doc.setFontSize(ifsz-3);
    doc.setFontType("normal");
    doc.text(pgpadd+2, hln, 'Term Condition Number 1');
    doc.text(pgpadd+65, hln, 'Term Condition Number 2');
    //doc.text(pgpadd+2, hln, 'Term Condition Number 3');
    //doc.text(pgpadd+65, hln, 'Term Condition Number 4');
    
    hln += 3
    doc.setFontSize(ifsz-4);
    doc.text(pgpadd+125, hln, 'Powered By MEDI-TRADE SOFT - http://meditradesoft.in/');
    
    doc.save('MEDI_SALESBILL.pdf');
}