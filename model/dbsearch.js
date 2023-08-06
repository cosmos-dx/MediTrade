
const fs = require('fs');
const multer = require('multer');
const mlog = require('./userlogin');
const { join } = require('path');
const qry = require('./qrystore');
const { log } = require('console');
var ObjectId = require('mongodb').ObjectId;
const app = mlog.app ;
app.set('views',__dirname + '/vws');




// ========= Testing Area ============== //

// var tclc = mlog.MongoConnect("123_1231231231_123");
// // {"$match": { "igroup" : new RegExp("^" +textlike)} }; 
// var frm ="2023-04-01";
// var tod ="2023-04-30";
// var rp = {_id: '6454b0fd1fd25b98d2ee2863',spid: '6454b0fd1fd25b98d2ee285f',ledgid: 'x644ba658d82040a5a6ed37eb',transid: '644ba6bfd82040a5a6ed3808',
//           itype: '2',billautono: '',billno: 'S00005',billdate: '05/05/2023',cscr: 'CREDIT',csid: '644ba658d82040a5a6ed37f0',amount: '240',billas: 'M',
//           cmnt: 'Hello',fyear: '0',name: 'MEDI TEC SAMPLE CUSTOMER',add1: 'SAMPLE ADDRESS 1',add2: 'SAMPLE ADDRESS 2',stcode: '09',regn: 'REG.N',
//           gstn: '09FGHIJ0456K1ZM',mode: '2',mobile: '6666666666',invdate: '05/05/2023',gamt: '269',amt: '240',dbbilldate: '2023-05-05',
//           dbinvdate: '2023-05-05',esti: 'M',ddisc: '0',dbcscr: '1',gtot: '269',tsubtot: '240',tamt: '240',tdisamt: '0',ttaxamt: '28.8'
//         };

// var cscr = rp["cscr"];
// var fyear = 0;

// function pay_rcpt_cash_update(db, typ, rp, cr, dr, fyear){
//   const cfilter = {"transid":rp["transid"],"ledgid":rp["ledgid"]};
//   const cupdate = {"$set": {"type":typ, "billno":rp["billno"], "credit":cr,"debit":dr,"date":rp["dbbilldate"],"comment":rp["cmnt"]}};
//   const cinsert = {"cashid":0, "ledgid":rp["ledgid"], "transid":rp["transid"],"type":typ, "billno":rp["billno"], 
//                   "credit":cr,"debit":dr, "date":rp["dbbilldate"],"comment":rp["cmnt"]};
//   const prupdate = {"$set": {"type":typ, "billno":rp["billno"], "credit":dr,"debit":cr,"date":rp["dbbilldate"]}};
//   const prinsert = {"prid":0, "ledgid":rp["ledgid"], "transid":rp["transid"],"vautono":"","type":typ,"cash":0,
//                    "billno":rp["billno"], "credit":dr,"debit":cr,"date":rp["dbbilldate"],"status":0, "fyear":fyear,};

//   if(rp["cscr"] == 'CASH'){
//     db["pr"].deleteOne(cfilter).then(function(result){}); // have to delete pay_rcpt document if exists or not
//     db["cash"].find(cfilter).toArray().then(function(cdata){
//       if(cdata.length>0){
//         db["cash"].updateOne(cfilter, cupdate).then(function(cupdt){})
//         // "UPDATE cash document Here because data Exists";
//       }else{
//         cinsert["cashid"]= new ObjectId().toString(); // updating required cashid 
//         db["cash"].insertOne(cinsert).then(function(cinsert){})
//         // "Insert cash document Here because data NOT-Exists";
//       }
//     })
//   }
//   if(rp["cscr"] == 'CREDIT'){
//     db["cash"].deleteOne(cfilter).then(function(result){});
//     if(rp['mode'] == 2){
//       db["pr"].find(cfilter).toArray().then(function(prdata){
//         if(prdata.length>0){
//           db["pr"].updateOne(cfilter, prupdate).then(function(pr_updt){})
//           // "UPDATE pay_rcpt document Here because data Exists";
//         }else{
//           prinsert["prid"]= new ObjectId().toString(); // updating required prid 
//           db["pr"].insertOne(prinsert).then(function(pr_insert){})
//           // "Insert pay_rcpt document Here because data NOT-Exists";
//         }
//       })
//     }
//   }
// };

//pay_rcpt_cash_update(tclc[0], "2", rp, 0, parseFloat(rp["gtot"]), fyear);


// ========= Testing Area ============== //

app.get('/partysearchenter',function(req,res){ 
  var column = "name";
 
  var idf = req.query.idf.trim(); // removal of white space is important
 
  if (typeof req.query.getcolumn == 'undefined'){
      column = "all"; // send message to fetch all column available in select query
     }
  else{
     column = req.query.getcolumn;
   }
   var textlike = req.query.name.toUpperCase() ;
   var limit = req.query.limit;
   
   qry.csfind_by_name(mlog.tclc, "GET", idf, textlike, column, limit, function(data){
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
  
  if (typeof req.query.getcolumn == 'undefined'){
     column = "all"; // send message to fetch all column available in select query
    }
 else{
    column = req.query.getcolumn;
  }
  var limit = parseInt(req.query.limit);

  qry.csfind_by_name(mlog.tclc, "GET", idf, req.query.name.toUpperCase(), column, limit, function(data){
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

  const findResult = await mlog.tclc['stk'].find({"itemid": idf}).sort({'itemid': -1}).toArray();
  res.json(findResult);
  
  
});
app.post('/sppartysearch',function(req,res){
  //var db = mlog.db;
  var idf = req.body.name; // sale or purchase confused
  var column = "all";
  var frm =  req.body.frm;
  var limit = {"frm":frm,"tod":req.body.tod,
          "itype":req.body.itype,"billas":req.body.billas, "partyname": req.body.partyname, "billno": req.body.billno}; 
  
  
  qry.csfind_by_name(mlog.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, limit, function(data){
    res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    });
});

var seditdata = {};

app.get('/speditcalculate',function(req,res){
  
  var rscr = req.session.cookie.rscr;
  let db = mlog.db;
  let transid = req.query.transid ;
  let ledgid = req.query.ledgid ;
  let fyear = req.query.fyear ;
  let billdt = req.query.dt ;
  let invdt = req.query.invdt ;
  let billno = req.query.billno ;
  let tabpur = "purchase"
  let tabsale = "sales"
  let tabcs = "suppliers" 
  let tabitem = "products"
  let tabpit = "purchase_item"
  let tabsit = "sales_item"
  let dtformat = "%b/%y";
  let stk = "stock";
  let gamt = req.query.gamt ;
  
  if (req.query.idf == "supplier"){
        qry.SPINFO(mlog.tclc, ledgid, transid, "sup", "pur", "pitm", fyear, 
          function(err, rows, itemrows, acrows){
            if(rows){
              
              rows[0]['gamt'] = gamt;
              rows[0]['amt'] = 0;
              rscr['cssearch']==='purchase'
              rscr['cs']="supplier";

              rscr["recdic"]["pan"]=rows[0];
              rscr["recdic"]["grid"]=itemrows;
              rscr["recdic"]["ac"]=acrows;
              rscr["recdic"]["edit"]=true;
              res.send(JSON.stringify(rscr["recdic"]));
              //res.end(JSON.stringify(seditdata));
            }
          });
      }

  if (req.query.idf == "customer"){
    qry.SPINFO(mlog.tclc, ledgid, transid, "cust", "sale", "sitm", fyear, 
          function(err, rows, itemrows, acrows){
            rows[0]['gamt'] = gamt;
            rows[0]['amt'] = 0;
            rscr['cssearch']="sale";
            rscr['cs']="customer";
            rscr["recdic"]["pan"]=rows[0];
            rscr["recdic"]["grid"]=itemrows;
            rscr["recdic"]["ac"]=acrows;
            rscr["recdic"]["edit"]=true;

            res.send(JSON.stringify(rscr["recdic"]));
            // res.send(JSON.stringify(seditdata));
          });
      }
  });

app.get('/spedit',function(req,res){
  var rscr = req.session.rscr;
  try{
      // res.render('medipages/spmaster', {spinfo: rscr, prows:seditdata['prows'][0], 
      // itemrows:seditdata['itemrows'], acrows:seditdata['acrows'], spedit: true});
      res.render('medipages/spmaster', {spinfo:rscr, "spedit":true});
  }catch(err){}  
  });

app.post('/sendbilltodb', (req, res) => {
  
  var idf = req.body.idf;
  var mode = req.body.mode;
  var redicdata = req.body.getdata;

  var gridArray = Object.values(redicdata.grid);
  redicdata.grid = gridArray;
  var main = req.body.main; 
  // console.log("--------------------recdic pan---------------->",redicdata.pan);
  // console.log("--------------------recdic grid---------------->",redicdata.grid);
  // console.log("--------->> stockarray >>>> ",redicdata.grid[0]['stockarray'])
  if(typeof(main) === "undefined"){
    //main true for Cash dbcscr 1 credit false for challan
    main = true;
  }
  
  qry.csfinalbill(mlog.tclc, idf, redicdata, mode, main, function(){
        res.send(JSON.stringify(redicdata));
    });
  
});

app.get('/addtodb',function(req,res){
  var rscr = req.session.rscr;
  var idf = req.query.idf ;         // old ---- cs     //new idf
  var text = req.query.name;        // old ---- text   // name
  var column = req.query.getcolumn;
  var limit = req.query.limit;
  var mode = req.query.mode;
 
  qry.add_to_db(mlog.tclc, idf, text, column, mode, limit, function(data){
        res.send(JSON.stringify(data));
    });

  });

app.post('/getTotalsp', async function(req, res){
  var frm = req.body.fromday; 
  var tod = req.body.today;
  var data = 0.0;
  var idf = req.body.idf;
  var coll = "pur";
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
      itype : "",
    }
    const result = mlog.tclc['pur'].find({}).sort({ _id: -1 }).limit(1).toArray();
    result.then(function(fin){
      if(fin.length > 0){
      ledgid = fin[0]['ledgid'];
      datatosend['ledgid'] = fin[0]['ledgid'];
      datatosend['amount'] = fin[0]['amount'];
      datatosend['billno'] = fin[0]['billno'];
      datatosend['billdate'] = fin[0]['billdate'];
      datatosend['itype'] = fin[0]['itype'];
      const finresult = mlog.tclc['sup'].find({ledgid : fin[0]['ledgid']}).limit(1).toArray();
      finresult.then(function(val){
        if(val.length > 0){
          datatosend['name'] = val[0]['name'];
          res.header("Access-Control-Allow-Origin", "*").json(datatosend);
        }
        
      })
    }
    })
    return;
  }
  else if (idf === "products") {
    const resultArr = await mlog.tclc['itm'].find({}).toArray();
    res.header("Access-Control-Allow-Origin", "*").json(resultArr.length);
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
        itype: resultArr[i]['itype'],
      };
  
      data.push(datatosend);
    }
    res.header("Access-Control-Allow-Origin", "*").json(data);
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
  res.header("Access-Control-Allow-Origin", "*").json({ [req.body.idf] : data});

})
  



app.post('/addtodb',function(req,res){
  var rscr = req.session.rscr;
  var idf = req.body.cs ;
  var text = req.body.text; 
  var column = req.body.getcolumn;
  var limit = 1;
  var mode = req.body.mode;
  qry.add_to_db(mlog.tclc, idf, text, column, mode, limit, function(data){
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
  // csonsole.log("db seardch --- >>> ", idf, text, ledgid,frm, tod, itype, billas, limitrange);
  qry.ledger_n_tax_search(mlog.tclc, idf, text, ledgid, frm, tod, itype, billas, fyear, limitrange, function(data){
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


module.exports.app = app