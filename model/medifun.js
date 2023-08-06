

function emptyRSCR(){
    var rscr = {"info":"MediTrade-Soft", "alert":"","title":"","htmlheaderdp":"","pathinfo":"",
        "updatemediregister":false, "mediregister":"","getsdc":"", "csinfo":"","cinfo":"","sinfo":"",
        "dbfname":"", "loginpage":"/","homepage":"","tables":null,"recdic":null,"daterow":null,"daterange":[],
        "owner":"","uqpath":"","estidict":"","dbcscr":"","cscr":"","fyear":0, "sfyear":null,}//'sfyear'==>> Selected Fyear 
    return rscr;
}

function readRSCR(){
      let dbcscr={"CASH":"1","CREDIT":"2", "CHALLAN":"3", "ORDER":"4","":"1","0":"1"} // Force to CASH if empty values in keys
      let cscr={"1":"CASH","2":"CREDIT", "3":"CHALLAN", "4":"ORDER", "0":"","":""}
      //pan =>> hold panel headr or party (while billing) info related to bill
      //spid==>> saleID or purchaseID, transid==>>transationID, csid==>>customerID or supplierID
      //ledgid==>ledgerID, nameid==>ledgerID,id==>>saleID or purchaseID, billas==>>('M':Main GST Bill, 'E':EstimateBill, 'I':InterState GST Bill) 
      //itype = Invoice Type (GST Registered Party or Un-Registered Pary Usually Cash Bill, 1==>GST UnRegisterd 2==>GST Registered) 
      //dbcscr==> Cash Credit Value that sores in Database ('1'='CASH','2'='CREDIT','3'='CHALLAN','4'='Pending ORDER')
      //cscr==>('CASH','CREDIT'.'CHALLAN','ORDER'), area==> Where Party Work Place
      //regn==> Party's Registeration Number, gstn=>GST Number, pan==> Pancard Number,acentries==>>Account Entries
      //billdate==> dd/mm/yyyy, dbbilldate==>'yyyy/mm/dd', prolo==>> Profit or Loss on Bill
      //dis==>Discount on Bill, ddis==>Default Discount, mode==> Basically Payment Method
      //tdisamt=Total Discount Amount, tamt==>> Total Amount, pexpense==>Purchase Expences
      //tsubtot==>Amount without Discount or Bonus, updtval==>if Bill Updated then Diffenece After Update Bill 

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
      let pan={"spid":0,"transid":0,"csid":0,"ledgid":0,"billas":"M","itype":1,"bal":0,
        "name":"","partyname":"", "add1":"", "add2":"", "add3":"","stcode":"0","pincode":0,"area":"","phone":0,
        "email":0, "ophone":0, "pan":0, "regn":0, "gstn":"", "cmnt":"", "mode":0, "esti":0,
        "dbcscr":1, "cscr":'CASH', "billdate":formattedDate, "invoicedate":formattedDate, "invdate":formattedDate, "dbbilldate":formattedDate, "dbinvdate":formattedDate,"fyear":0,
        "ddisc":0, "dis":0, "billno":0, "prolo":0, "roundoff":0,"gtotwords":0,    
        "taxamt1":0,"taxamt2":0,"sgst":0,"cgst":0,"tdisamt":0,"ttaxamt":0,"tamt":0,"ttaxable":0,
        "tsubtot":0,"rgtot":0,"gtot":0, "acentries":false,"pexpense":0, "updtval":0,}

      // Stores Bill Item Details
      //sno==>>Serial Number, spitemid==>> Sale or Purchase ItemID,nameid==>ProductID, id==>ProductID
      //expdbf==> ExpieryDate of Idem in yyyy/mm/dd DataBase Format
      //stkvariable==>balance stock while user entering Quantity  

      let itemtemplate={"sno":0,"spiid":"","spid":"","csid":"0","itemid":"","name":"","pack":"","unit":"","hsn":"",
         "compid":"", "igroup":"","irack":"","qty":0, "tqty":0,"bbool":false,"edited":false,"batreplace":false,
         "stockid":null,"dbstock":0,"dbbatchstock":0,"expdate":"","dbbatchno":"","totstk":0,"stockarray":[],
         "batchno":"","bonus":"","cgst":0, "sgst":0,"gst":0,"igst":0,"tax1":0, "tax2":0,"tax":0,
         "bonus":"", "dis":0, "mrp":"","prate":0,"srate":0, "rate_a":"0","rate":0,"tax":0, "ttax":0,
         "amttot":0, "amt":0,"batchno":"","ttaxamt":0,"tdisamt":0,"tax1amt":0,"tax2amt":0,"multibat":false,
         "netrate":0,"netamt":0,"updatedqty":0,"pnet":0};
           
      //acid1 ==> Account ID 1
      let ac={"acname1":"" ,"acname2":"" ,"acname3":"" ,"acid1":0,"acid2":0,"acid3":0,"acval1":0,"acval2":0,"acval3":0,}
      //recdic==>store records of sales or purchase bill 
      let recdic={"pan":pan,"grid":{0:itemtemplate},"ac":ac,"static":{},"edit":false,
       "other":{}, "itemtemplate": itemtemplate, "pantemplate": pan }
      let estidict={"e":"E","E":"E","m":"M","M":"M","":"M","undefined":"M", " ":"M"}
      let sdcinfo={"1":"Pharma Distribution","2":"Retail Medical","11":"General Trade",
                1:"Pharma Distribution",2:"Retail Medical",11:"General Trade",};
      // ownerstatic will get values from usersettings json ownerstatic as keys 
      // ownervar will get values from usersettings json ownervar as keys stores user info including user bank details   

      let owner={"o":"own", "cal":null,"oth":"","ownername":"","ownerstatic":"","ownervar":"",} // "cal" =>> finencial year calander
      let uqpath={"dbdir":null,"odb":null,"usersettingspath":null,"dbfname":null} // odb will be sqlitedb connection ready 
      let csinfo={"c":"", "s":"","sdc":1,"sdcinfo":"Pharma Distribution",}; // 1 for wholesale medical; 2 for retail medical; and 11 for general trade 

      //Database Table Name in Short
      let tables = {"CUST":"customer","SUP":"suppliers","CASH":"cash",
      "TRANS":"mytrans","ACNT":"`account`","AC_TRN":"ac_trans","P_R":"pay_rcpt","LEDG":"ledger",
      "PROD":"products","PURC":"purchase","SALE":"sales","SL_ITM":"sales_item","PR_ITM":"purchase_item",
      "STK":"stock","OWN_DT":"owner_det","OT_SETT":"oth_sett","BANK":"bank","TAX_RT":"vat_rate",
      "STK_FOR":"stockist_for","SALE_O":"sales_order","SL_O_ITM":"sales_order_item","PURC_O":"purchase_order",
      "PR_O_ITM":"purchase_order_item", "E_STK":"estistock",}
      let cinfo = {"cs":"sale","title":"Sale Panel","csname":"Customer",
              "cssearch":"Customer","recdic":recdic,}
      let sinfo = {"cs":"purchase","title":"Purchase Panel","csname":"Supplier",
              "cssearch":"suppliers","recdic":recdic,"tables":tables};

      //rscr==>Resources
      var rscr = {"info":"MediTrade-Soft", "alert":"","title":"","htmlheaderdp":"","pathinfo":"",
        "updatemediregister":false, "mediregister":"","getsdc":"", "csinfo":csinfo,"cinfo":cinfo,"sinfo":sinfo,
        "dbfname":"", "loginpage":"/","homepage":"","tables":tables,"recdic":recdic,"daterow":null,"daterange":[],
        "owner":owner,"uqpath":uqpath,"estidict":estidict,"dbcscr":dbcscr,"cscr":cscr,"fyear":0, "sfyear":null,}//"sfyear"==>> Selected Fyear  
      return rscr;
}


module.exports.emptyRSCR = emptyRSCR
module.exports.readRSCR = readRSCR
