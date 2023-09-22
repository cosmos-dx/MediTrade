
const fs = require('fs');
const multer = require('multer');
const mlog = require('./userlogin');
const { join } = require('path');
const qry = require('./qrystore');
const { log } = require('console');
var ObjectId = require('mongodb').ObjectId;
const app = mlog.app ;
app.set('views',__dirname + '/vws');



app.get('/partysearchenter',async function(req,res){ 
  var column = "name";
  var idf = req.query.idf.trim(); // removal of white space is important
  let db_info = req.query.identity;
  if (typeof req.query.getcolumn == 'undefined'){
      column = "all"; // send message to fetch all column available in select query
     }
  else{
     column = req.query.getcolumn;
   }
   var textlike = req.query.name.toUpperCase() ;
   var limit = req.query.limit;
   let tclc_db = mlog.MongoConnect(db_info);
   var tclc = tclc_db[0];
   var mgodb = tclc_db[1];
   var client = tclc_db[2];
   qry.csfind_by_name(tclc, "GET", idf, textlike, column, limit, function(data){
         res.send(JSON.stringify(data));
         
    });
 
 });
 
 app.post('/partysearchenter', (req, res) => {
   //Update recdic only on POST method on ejs pages
   var raw_idf = req.body.idf.split("||");
   var idf = raw_idf[3];
   var column = raw_idf[2];
   var selection = raw_idf[1];
   var search_for = raw_idf[0];
   
   qry.csfind_by_name(mlog.tclc, "POST", idf, req.body.searchtxt, column, 1, function(data){
         res.send(JSON.stringify(data));
     });
   
 });
 

app.get('/itemsearchenter',function(req,res){
  var column = "name";
  var idf = req.query.idf.trim(); // removal of white space is important
  let db_info = req.query.identity;
  let tclc_db = mlog.MongoConnect(db_info);
  var tclc = tclc_db[0];
  var mgodb = tclc_db[1];
  var client = tclc_db[2];
  if (typeof req.query.getcolumn == 'undefined'){
     column = "all"; // send message to fetch all column available in select query
    }
 else{
    column = req.query.getcolumn;
  }
  var limit = parseInt(req.query.limit);
  qry.csfind_by_name(tclc, "GET", idf, req.query.name.toUpperCase(), column, limit, function(data){
        res.send(JSON.stringify(data));
    });
  
});

app.post('/itemsearchenter', (req, res) => {
  var raw_idf = req.body.idf.split("||");
  var idf = raw_idf[3];
  var column = raw_idf[2];
  var selection = raw_idf[1];
  var search_for = raw_idf[0];
  var stockfetchlimit = 5;
  qry.csfind_by_name(mlog.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, stockfetchlimit, function(data){ 
        res.send(JSON.stringify(data));
    });
  
});
app.get('/batchsearch', async function (req, res) {
  var idf = req.query.idf;
  // if (idf == 'undefined') return res.json({});
  let db_info = req.query.identity;
  let tclc_db = mlog.MongoConnect(db_info);
   var tclc = tclc_db[0];
   var mgodb = tclc_db[1];
   var client = tclc_db[2];
  const findResult = await tclc['stk'].find({"itemid": idf}).sort({'itemid': -1}).toArray();
  res.json(findResult);
  
  
});
app.post('/sppartysearch',function(req,res){
  //var db = mlog.db;
  var idf = req.body.name; // sale or purchase confused
  var column = "all";
  var frm =  req.body.frm;
  var limit = {"frm":frm,"tod":req.body.tod,
          "itype":req.body.itype,"billas":req.body.billas, "partyname": req.body.partyname, "billno": req.body.billno}; 
  
   let db_info = req.body.identity;
   let tclc_db = mlog.MongoConnect(db_info);
   var tclc = tclc_db[0];
   var mgodb = tclc_db[1];
   var client = tclc_db[2];
  qry.csfind_by_name(tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, limit, function(data){
    res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    });
});

app.get('/speditcalculate', async function (req, res) {
  try {
    var rscr = req.session.cookie.rscr;
    let transid = req.query.transid;
    let ledgid = req.query.ledgid;
    let fyear = req.query.fyear;
    let cgst = 0;
    let sgst = 0;
    let ttaxamt = 0;
    let tsubtot = 0;
    let tdisamt = 0;
    let gtot = 0;
    let roundoff = 0;
    let roundnetamt = 0;
    var grididarr = [];
    let tamt = 0;

    let cscrobj = {
      "1": "CASH",
      "2": "CREDIT",
      "3": "CHALLAN",
      "": "CASH",
      1: "CASH",
      2: "CREDIT",
      3: "CHALLAN",
    };

    if (req.query.idf == "supplier") {
      let [rows, itemrows, acrows] = await qry.SPINFO(
        mlog.tclc,
        ledgid,
        transid,
        "sup",
        "pur",
        "pitm",
        fyear
      );

      if (rows) {
        rows[0]['tamt'] = tamt;
        rows[0]['amt'] = 0;
        rscr['cssearch'] = 'purchase';
        rscr['cs'] = 'supplier';

        rscr["recdic"]["pan"] = rows[0];
        rscr["recdic"]["grid"] = itemrows;
        rscr["recdic"]["ac"] = acrows;
        rscr["recdic"]["edit"] = true;
        rscr["recdic"]["pan"]["dis"] = 0;

        rscr["recdic"]["grid"].forEach((obj, i) => {
          gtot += parseFloat(obj.netamt);
          tamt += parseFloat(obj.amttot || 0);
          cgst += parseFloat(obj.cgst || 0);
          sgst += parseFloat(obj.sgst || 0);
          ttaxamt += parseFloat(obj.ttaxamt || 0);
          tsubtot += parseFloat(obj.amt || 0);
          tdisamt += parseFloat(obj.tdisamt || 0);
          grididarr.push({ id: i });
        });

        roundnetamt = gtot.toFixed(0);
        roundoff = parseFloat(roundnetamt) - gtot;

        for (const[k, v] of Object.entries({"gtot": parseFloat(gtot), "cgst" : cgst, "sgst": sgst, "ttaxamt" : ttaxamt, 
                                  "tsubtot":tsubtot, "tamt":tamt, "tdisamt":tdisamt, "roundoff":roundoff, "grididarr":grididarr})){
                rscr["recdic"]["pan"][k]=v;
               }

        rscr["recdic"]["pan"]["gtot"] = rscr["recdic"]["pan"]["amount"];
        rscr["recdic"]["pan"]["dbcscr"] = rscr["recdic"]["pan"]["cscr"];
        rscr["recdic"]["pan"]["cscr"] = cscrobj[rscr["recdic"]["pan"]["cscr"]];

        res.send(JSON.stringify(rscr["recdic"]));
      }
    }

    if (req.query.idf == "customer") {
      let [rows, itemrows, acrows] = await qry.SPINFO(
        mlog.tclc,
        ledgid,
        transid,
        "cust",
        "sale",
        "sitm",
        fyear
      );

      rows[0]['tamt'] = tamt;
      rows[0]['amt'] = 0;
      rscr['cssearch'] = "sale";
      rscr['cs'] = "customer";
      rscr["recdic"]["pan"] = rows[0];
      rscr["recdic"]["grid"] = itemrows;
      rscr["recdic"]["ac"] = acrows;
      rscr["recdic"]["edit"] = true;
      rscr["recdic"]["pan"]["dis"] = 0;

      rscr["recdic"]["grid"].forEach((obj, i) => {
        gtot += parseFloat(obj.netamt);
        tamt += parseFloat(obj.amttot || 0);
        cgst += parseFloat(obj.cgst || 0);
        sgst += parseFloat(obj.sgst || 0);
        ttaxamt += parseFloat(obj.ttaxamt || 0);
        tsubtot += parseFloat(obj.amt || 0);
        tdisamt += parseFloat(obj.tdisamt || 0);
        grididarr.push({ id: i });
      });

      roundnetamt = gtot.toFixed(0);
      roundoff = parseFloat(roundnetamt) - gtot;

      for (const [k, v] of Object.entries({
        "gtot": parseFloat(gtot),
        "cgst": cgst,
        "sgst": sgst,
        "ttaxamt": ttaxamt,
        "tsubtot": tsubtot,
        "tamt": tamt,
        "tdisamt": tdisamt,
        "roundoff": roundoff,
        "grididarr": grididarr
      })) {
        rscr["recdic"]["pan"][k] = v;
      }

      rscr["recdic"]["pan"]["gtot"] = rscr["recdic"]["pan"]["amount"];
      rscr["recdic"]["pan"]["dbcscr"] = rscr["recdic"]["pan"]["cscr"];
      rscr["recdic"]["pan"]["cscr"] = cscrobj[rscr["recdic"]["pan"]["cscr"]];

      res.send(JSON.stringify(rscr["recdic"]));
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/sendbilltodb', async (req, res) => {
  try {
    const idf = req.body.idf;
    const mode = req.body.mode;
    const redicdata = req.body.getdata;
    const gridArray = Object.values(redicdata.grid);
    redicdata.grid = gridArray;
    let main = req.body.main;
    let db_info = req.body.identity;
    let tclc_db = mlog.MongoConnect(db_info);
    var tclc = tclc_db[0];
    var mgodb = tclc_db[1];
    var client = tclc_db[2];

    if (typeof(main) === "undefined") {
      // main true for Cash dbcscr 1 credit false for challan
      main = true;
    }
    // console.log(redicdata);
    qry.csfinalbill(tclc, idf, redicdata, mode, main, async function(data) {
      const isSuccess = data.every(value => value === true);
      if (isSuccess) {
        res.json({"success": true});
      } else {
        res.json({"success": false});
      }
    });
  } catch (error) {
    console.error(error);
    res.json({"success": false});
  }
});


app.get('/addtodb',function(req,res){
  var rscr = req.session.rscr;
  var idf = req.query.idf ;         // old ---- cs     //new idf
  var text = req.query.name;        // old ---- text   // name
  var column = req.query.getcolumn;
  var limit = req.query.limit;
  var mode = req.query.mode;
  let db_info = req.query.identity;
  let tclc_db = mlog.MongoConnect(db_info);
  var tclc = tclc_db[0];
  var mgodb = tclc_db[1];
  var client = tclc_db[2];
  console.log(idf, text, column, limit, mode);
  qry.add_to_db(tclc, idf, text, column, mode, limit, function(data){
        res.send(JSON.stringify(data));
    });

  });

app.post('/getTotalsp', async function(req, res){
  var frm = req.body.fromday; 
  var tod = req.body.today;
  var data = 0.0;
  var idf = req.body.idf;
  var coll = "pur";

  if (!frm || !tod || !idf) {
    res.json({});
    return;
  }
  if(idf === "sales" || idf === "customer") {
    coll = "sale";
  }
  else if(idf === "purchase") {
    coll = "pur";
  }
  else if(idf === "recentpurchase"){
    var ledgid = 0;
    var datatosend = {
      ledgid : "",
      name : "",
      amount : "",
      billno : "",
      billdate : "",
      cscr : "",
    }
    const result = mlog.tclc['pur'].find({}).sort({ _id: -1 }).limit(1).toArray();
    result.then(function(fin){
      if(fin.length > 0){
      ledgid = fin[0]['ledgid'];
      datatosend['ledgid'] = fin[0]['ledgid'];
      datatosend['amount'] = fin[0]['amount'];
      datatosend['billno'] = fin[0]['billno'];
      datatosend['billdate'] = fin[0]['billdate'];
      datatosend['cscr'] = fin[0]['cscr'];
      const finresult = mlog.tclc['sup'].find({ledgid : fin[0]['ledgid']}).limit(1).toArray();
      finresult.then(function(val){
        if(val.length > 0){
          datatosend['name'] = val[0]['name'];
          res.json(datatosend);
        }
        
      })
    }
    })
    return;
  }
  else if (idf === "products") {
    const resultArr = await mlog.tclc['itm'].find({}).toArray();
    res.json(resultArr.length);
    return;
  }
  else if (idf === "recentsale") {
    var ledgid = 0;
    var data = [];
  
    const resultArr = await mlog.tclc['sale'].find({}).sort({ _id: -1 }).limit(5).toArray();
    var name = "";
    for (let i = 0; i < resultArr.length; i++) {
      ledgid = resultArr[i]['ledgid'];
      const val = await mlog.tclc['cust'].find({ ledgid: resultArr[i]['ledgid'] }).limit(1).toArray();
      if(val[0]){name = val[0]["name"]}
      else{name = ""}
      
      var datatosend = {
        ledgid: resultArr[i]['ledgid'],
        name: name,
        amount: resultArr[i]['amount'],
        billno: resultArr[i]['billno'],
        billdate: resultArr[i]['billdate'],
        cscr: resultArr[i]['cscr'],
      };
  
      data.push(datatosend);
    }
    res.json(data);
    return;
  }
  try{
    var resul = await mlog.tclc[coll].aggregate([
      {
        $addFields: {
          billdateISO: {
            $dateFromString: {
              dateString: "$billdate",
              format: "%Y-%m-%d" 
            }
          }
        }
      },
      {
        $match: {
          billdateISO: {
            $gte: new Date(frm),
            $lte: new Date(tod)
          }
        }
      }
    ]).toArray();
  }catch(err){
    var resul = [];
  }
  
  
  for (const obj of resul) {
    data += obj.amount;
  }
  res.json({ [req.body.idf] : data});
})
app.post('/addtodb',function(req,res){
  var rscr = req.session.rscr;
  var idf = req.body.cs ;
  var text = req.body.text; 
  var column = req.body.getcolumn;
  var limit = 1;
  var mode = req.body.mode;
  let db_info = req.body.identity;
  let tclc_db = mlog.MongoConnect(db_info);
  var tclc = tclc_db[0];
  var mgodb = tclc_db[1];
  var client = tclc_db[2];
  console.log(idf, text, column, mode, limit);
  qry.add_to_db(tclc, idf, text, column, mode, limit, function(data){
        res.send(JSON.stringify(data));
  });

});

app.post('/adduserinfo', function(req, res){
  var rscr =  req.session.rscr;
    ownerstat = {
      "userinfo" :{"ownerstatic": [req.body.name, req.body.add1, req.body.add2, req.body.add3],
      "printsettings": req.body['pagetype'], 
      "displaysettings": {"batchlist":false,},
      "info": req.body.info, "phone": req.body.phone1, "phone1": req.body.phone2, "tpname": "", 
      "email": req.body.email, "regn":req.body.regn,"gstn":req.body.gstn,
      },
    }
    
    var filter ={};
    var updatedta = {$set : ownerstat}
      var updateuserinfo = mlog.tclc["owner"].updateOne(filter, updatedta);
      updateuserinfo.then(function(upres){
        res.json({"success": "yes"});            
      })
});

app.post('/addbankinfo', function(req, res){

  var rscr =  req.session.rscr;
  var bankstat = {
    "bankinfo" :{
      "bank2": {"add": req.body.add2.toUpperCase() , "ifsc": req.body.ifsc2.toUpperCase(), "upid": req.body.upid2, 
      "name": req.body.name2.toUpperCase(), "ac": req.body.acno2},
      "bank1": {"add": req.body.add1.toUpperCase(), "ifsc": req.body.ifsc1.toUpperCase(), "upid": req.body.upid1, 
      "name": req.body.name1.toUpperCase(), "ac": req.body.acno1},
   },
  }

      var filter = {};
      var updatedata = { $set:bankstat}
      
      var updateuserinfo = mlog.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){

          // rscr['bankinfo'] = bankstat['bankinfo'];
          res.json({"hii": "hello"})
          // res.render('medipages/bank-info', {spinfo:rscr['bankinfo'], update:"Updated"});
      })
});

app.post('/addbillseriesinfo', function(req, res){
  var rscr =  req.session.rscr;
  var billstat = {
    "billseriesinfo" : {
      "bill" :{"main":req.body.main.toUpperCase(), "esti":req.body.esti.toUpperCase(), "challan":req.body.challan.toUpperCase(),
       "saleorder":req.body.saleorder.toUpperCase(),"purchaseorder":req.body.purchaseorder.toUpperCase(),"receipt":req.body.receipt.toUpperCase()},
     }
  }

      var filter = {};
      var updatedata = { $set: billstat}
      
      var updateuserinfo = mlog.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){
        res.json({"success": "yes"});
      })
});


app.post('/ledgersearch', function(req, res){
  var rscr =  req.session.rscr;
  var fyear = 0; //rscr["fyear"];
  
  var idf = req.body.name;
  var text = req.body.searchtxt;
  var ledgid = req.body.ledgid;
  var frm =  req.body.frm;
  var tod = req.body.tod;
  var itype = req.body.itype;
  var billas = req.body.billas;
  var limitrange = req.body.limitrange;
  let db_info = req.body.identity;
  let tclc_db = mlog.MongoConnect(db_info);
  var tclc = tclc_db[0];
  var mgodb = tclc_db[1];
  var client = tclc_db[2];
  // csonsole.log("db seardch --- >>> ", idf, text, ledgid,frm, tod, itype, billas, limitrange);
  qry.ledger_n_tax_search(tclc, idf, text, ledgid, frm, tod, itype, billas, fyear, limitrange, function(data){
    let i,j;
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    for (const key in obj) {
      if (!isNaN(key)) {
        delete obj[key];
      }
    }
  }
        res.send(JSON.stringify(data))
    });
  

});

app.post('/gstreports', function(req,res){
  var rscr = req.session.cookie.rscr;
  var frm = req.body.frm; //"2021-01-01";
  var tod = req.body.tod; //"2025-01-01";
  var ledgid = req.body.ledgid; //"";
  var billas= req.body.billas; //['I', 'M'];
  var itype = req.body.itype; //["1","2"]; 
  var fyear = rscr.fyear; //0;
  var sp = req.body.sp; //"sale";
  var gsttable = req.body.gsttable;
  var typ = "report";
  let db_info = req.body.identity;
  let tclc_db = mlog.MongoConnect(db_info);
  var tclc = tclc_db[0];
  var mgodb = tclc_db[1];
  var client = tclc_db[2];
  //var taxslab = ["12", "5", "18"];
  var taxslab = req.body.taxslab; //[0, 5, 12, 18, 28]; // tax rate must include array of integers;
  var agreegate = req.body.agreegate;
  var idf = req.body.idf;
  if(Object.keys(tclc).length>0){
      
      qry.GST_REPORT(tclc, ledgid, billas, itype, frm, tod, sp, typ, taxslab, fyear, async function(data){
      //var newobj = {0:[], 5:[], 12:[], 18:[], 28:[]};
        if(gsttable==="b2cs"){
          var newobj = {0:{"gst":0,"netamt":0,"amt":0,"cgst":0,"sgst":0,"tdisamt":0,"qty":0,"taxcount":0,"-":"","--":"","---":"","":"",}, 
                        5:{"gst":5,"netamt":0,"amt":0,"cgst":0,"sgst":0,"tdisamt":0,"qty":0,"taxcount":0,"-":"","--":"","---":"","":"",},
                        12:{"gst":12,"netamt":0,"amt":0,"cgst":0,"sgst":0,"tdisamt":0,"qty":0,"taxcount":0,"-":"","--":"","---":"","":"",},
                        18:{"gst":18,"netamt":0,"amt":0,"cgst":0,"sgst":0,"tdisamt":0,"qty":0,"taxcount":0,"-":"","--":"","---":"","":"",},
                        28:{"gst":28,"netamt":0,"amt":0,"cgst":0,"sgst":0,"tdisamt":0,"qty":0,"taxcount":0,"-":"","--":"","---":"","":"",},};
          for (const[k, v] of Object.entries(data)){
            newobj[v["gst"]]["netamt"] += v.netamt;
            newobj[v["gst"]]["amt"] += v.amt;
            newobj[v["gst"]]["cgst"] += v.cgst;
            newobj[v["gst"]]["sgst"] += v.sgst;
            newobj[v["gst"]]["tdisamt"] += v.tdisamt;
            newobj[v["gst"]]["qty"] += v.qty;
            newobj[v["gst"]]["taxcount"] += 1;
          }
          res.header("Access-Control-Allow-Origin", "*").json(Object.values(newobj));
          //console.log(Object.values(newobj))
        }
        else{
          if(agreegate){
            var newobj = {};
            for (const[k, v] of Object.entries(data)){
              newobj[v["ledgid"]]={"billno":"", "billdate":"", "name":"", "gstn":"", "stcode":"","itemname":"", 
                                  "gst":0,"netamt":0,"amt":0,"cgst":0,"sgst":0,"tdisamt":0,"qty":0,"taxcount":0,}
              newobj[v["ledgid"]]["netamt"] += v.netamt;
              newobj[v["ledgid"]]["amt"] += v.amt;
              newobj[v["ledgid"]]["cgst"] += v.cgst;
              newobj[v["ledgid"]]["sgst"] += v.sgst;
              newobj[v["ledgid"]]["tdisamt"] += v.tdisamt;
              newobj[v["ledgid"]]["qty"] += v.qty;
              newobj[v["ledgid"]]["taxcount"] += 1;
            }
            res.header("Access-Control-Allow-Origin", "*").json(Object.values(newobj));
          }
          else{
            res.header("Access-Control-Allow-Origin", "*").json(Object.values(data));
          }
          //console.log("====>>>>> ", Object.values(data));
        }
      });
  }
  else{
    res.header("Access-Control-Allow-Origin", "*").json({});
  }

});

async function PRSearch(db, idf, sp, typ, trtype, ledgid, fyear, callback){
  filter = {"ledgid":ledgid,"fyear":fyear,"type":typ,"trtype":trtype};
  var getboth = {"partybalance":{"balance":0}, "totalbalance":{"balance":0},};
  const data = await db["trns"].find(filter).toArray();
  for(let i=0; i<data.length; i++){
    if(!isNaN(data[i].debit-data[i].credit)){
      getboth["partybalance"]["balance"]+=(data[i].debit-data[i].credit);
    }
  };
  const data2 = await db["cash"].find({"fyear":fyear}).toArray();
  for(let i=0; i<data2.length; i++){
    if(!isNaN(data2[i].debit-data2[i].credit)){
      getboth["totalbalance"]["balance"]+=(data2[i].debit-data2[i].credit);
    }
  }
  callback(getboth);
}

app.post('/payrcptsearch', function(req,res){
  console.log("sdfsdf");
  var rscr = req.session.cookie.rscr;
  var idf = req.body.idf; 
  var sp = req.body.sp; 
  var ledgid = req.body.ledgid; 
  var fyear = rscr.fyear; 
  let db_info = req.body.identity;
  let tclc_db = mlog.MongoConnect(db_info);
  var tclc = tclc_db[0];
  var mgodb = tclc_db[1];
  var client = tclc_db[2];
  var typ = 2; // typ = {1:"purchase",2:"sale",3:"payment",4:"receipt",5:[reserved for cash table],6:"",7:"bank",8:"",9:""}
  var trtype = "2"; //{"1":"cash transaction", "2":"credit transaction","3":"other account transaction","7":"bank transaction"};
  if(sp==="receipt"){typ=2};
  if(sp==="payment"){typ=1};
  console.log("hiii");
  if(Object.keys(tclc).length>0){
    PRSearch(tclc, idf, sp, typ, trtype, ledgid, fyear, function(data){
      console.log(data);
      res.header("Access-Control-Allow-Origin", "*").json(data);
    })
  }
  else{
    res.header("Access-Control-Allow-Origin", "*").json({});
  }
  
});


module.exports.app = app


