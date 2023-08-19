const { ObjectId } = require("mongodb");

const ObjectID = require('mongodb').ObjectId; 

function getUniqueId(){
    var dtt = new Date();
    var myyy = (dtt.getYear()-100).toString()
    var mymm = (dtt.getMonth()+1).toString();
    var mydd = (dtt.getDate()).toString();
    var myhh = dtt.getHours().toString();
    var mymi = dtt.getMinutes().toString();
    var myse = dtt.getSeconds().toString();

    if (mydd < 10){mydd = '0' + mydd};
    if (mymm < 10){mymm = '0' + mymm};
    if (mymi < 10){mymi = '0' + mymi};
    if (myse < 10){myse = '0' + myse};
    if (myhh < 10){myhh = '0' + myhh};
    return [mydd,mymm,myyy,myhh,mymi,myse].join('');  
}

function DistinctQryResults(ydb, text, field, limit, sort){
//var setmatch = {"$match": { "igroup" : new RegExp("^" +textlike)} }; 
	var match = {"$match":{}}; 
	match["$match"][field]=new RegExp("^" +text); // fill on key field
	match["$match"][" "+field+" "]={$ne:""};	    // fill on key field with extra space otherwise this will overrite previous;
	var dstf = "$"+field; // dstf = Distinct Field;
	var xx = `${field}`;
	var group = JSON.parse(`{"$group":{"_id":null, "${field}":{"$addToSet":"$${field}"}}}`);
	var agr = [group,{$unwind:dstf},match,{$limit:limit},{$sort:{"_id":sort}},]; 
	var data = [];
	return ydb.aggregate(agr).toArray();
	}


 
async function add_to_db(db, idf, text, column, mode, limit, callback){
	var data = []; 
	var qrystr = "";
	var actype = 4; // profite-loss ; 3=Expense; 2:Liability; 1:Assests Account Types 
	var sp_id = 1; // 1 for suppliers and 2 for customers

	if(mode==="search"){
		if (idf === "compsupsearch") {
			try {
			  const findResult1 = await db["sup"].find({ "ledgid": text[0], "mode": { "$eq": 6 } }).limit(1).toArray();
			  const findResult2 = await db["sup"].find({ "csid": text[1], "mode": { "$ne": 6 } }).limit(1).toArray();
		  
			  if (findResult2.length > 0) {
				data.push({ "name": findResult2[0]["name"] });
			  } else {
				data.push({ "name": "N.A" });
			  }
		  
			  if (typeof findResult1 !== "undefined") {
				data.push({ "name": findResult1[0]["name"] });
			  }
		  
			  callback(data);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "hsn") {
			try {
			  const result = await DistinctQryResults(db["itm"], text.toUpperCase(), "hsn", 5, -1);
			  const data = result.map(item => ({ "name": item["hsn"] }));
			  callback(data);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "comp") {
			try {
			  const findResult = await db["sup"].find({ "name": new RegExp("^" + text.toUpperCase(), "i"), "mode": { $eq: 6 } })
				.sort({ "_id": -1 }).limit(5).toArray();
			  callback(findResult);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "sup") {
			try {
			  const findResult = await db["sup"].find({ "name": new RegExp("^" + text.toUpperCase(), "i"), "mode": { $ne: 6 } })
				.sort({ "_id": -1 }).limit(5).toArray();
			  callback(findResult);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "supplier_area") {
			try {
			  const result = await DistinctQryResults(db["sup"], text.toUpperCase(), "area", 5, -1);
			  const data = result.map(item => ({ "name": item["area"] }));
			  callback(data);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "customer_area") {
			try {
			  const result = await DistinctQryResults(db["cust"], text.toUpperCase(), "area", 5, -1);
			  const data = result.map(item => ({ "name": item["area"] }));
			  callback(data);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  

		  if (idf === "items_igroup") {
			try {
			  const result = await DistinctQryResults(db["itm"], text.toUpperCase(), "igroup", 5, -1);
			  const data = result.map(item => ({ "name": item["igroup"] }));
			  callback(data);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "items_irack") {
			try {
			  const result = await DistinctQryResults(db["itm"], text.toUpperCase(), "irack", 5, -1);
			  const data = result.map(item => ({ "name": item["irack"] }));
			  callback(data);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		if(idf==="ITEMDBSEARCH"){}	
		if (idf === "items") {
			try {
			  const textlike = text.toUpperCase();
			  const findResult = await db["itm"].find({ "name": new RegExp("^" + textlike, "i") }).limit(5).toArray();
			  callback(findResult);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "customer") {
			try {
			  const textlike = text.toUpperCase();
			  const findResult = await db["cust"].find({ "name": new RegExp("^" + textlike, "i") }).limit(5).toArray();
			  callback(findResult);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "supplier") {
			try {
			  const textlike = text.toUpperCase();
			  const findResult = await db["sup"].find({ "name": new RegExp("^" + textlike, "i"), "mode": { "$ne": 6 } }).limit(5).toArray();
			  callback(findResult);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		if(qrystr===""){
			callback([">>>*** Wrong Methods Check Again !"]);
			return true;
		}
	}; 

	if(mode==="save"){
		if (idf === "items") {
			try {
			  const itemid = new ObjectID().toString();
			  const pnet = parseFloat(parseFloat(text['prate']) * (100 + 12) / 100).toFixed(2);
			  const insertdict = {
				"itemid": itemid,
				"name": text['name'],
				"pack": text['pack'],
				"unit": text['unit'],
				"netrate": pnet,
				"prate": parseFloat(text['prate']),
				"srate": parseFloat(text['srate']),
				"cgst": parseFloat(text['cgst']),
				"sgst": parseFloat(text['sgst']),
				"gst": parseFloat(text['igst']),
				"dis": "0.00",
				"mrp": text['mrp'],
				"hsn": text['hsn'],
				"igroup": text['igroup'],
				"irack": text['irack'],
				"compid": text['compid'],
				"csid": text['csid']
			  };
		  
			  if (text['addcomp']) {
				const compmode = 6;
				const sp_id = "6";   // 1 for suppliers and 2 for customers and 6 is reserved for companies
				const actype = "6";  // reserved Only for Company
				const ledgid = new ObjectID().toString();
				const insertledgD = { "ledgid": ledgid, "ac_type": actype, "sale_pur_ID": sp_id };
				const csid = new ObjectId().toString();
		  
				const getledger = await db["ledg"].insertOne(insertledgD);
		  
				const compdict = {
				  "csid": csid,
				  "ledgid": ledgid,
				  "name": text['compname'],
				  "add1": "",
				  "add2": "",
				  "add3": "",
				  "pincode": "",
				  "area": "",
				  "phone": "",
				  "email": "",
				  "offphone": "",
				  "pan": "",
				  "bal": "",
				  "regn": "",
				  "gstn": "",
				  "cmnt": "",
				  "mode": compmode
				};		  
				insertdict["compid"] = ledgid;		  
				await db["sup"].insertOne(compdict);		  
				console.log(">>>> NEW COMPANY ADDED WHILE CREATING NEW ITEM (qrystore) <<<< ");
			  }  
			  await db["itm"].insertOne(insertdict);
			  callback([insertdict["name"]]);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  if (idf === "customer") {
			try {
			  const sp_id = "2";   // 1 for suppliers and 2 for customers
			  const actype = "4";  // profite-loss
			  const supmode = "2"; // 6 for company
			  const ledgid = new ObjectId().toString();
			  const insertledgD = { "ledgid": ledgid, "ac_type": actype, "sale_pur_ID": sp_id };
		  
			  const getledger = await db["ledg"].insertOne(insertledgD);
		  
			  const csid = new ObjectId().toString();
			  const insertdict = {
				"csid": csid,
				"ledgid": ledgid,
				"name": text['name'],
				"add1": text['add1'],
				"add2": text['add2'],
				"add3": text['stcode'],
				"pincode": text['pincode'],
				"area": text['area'],
				"phone": text['phone'],
				"email": text['email'],
				"offphone": text['offphone'],
				"pan": text['pan'],
				"bal": parseFloat(text['obal']),
				"regn": text['regn'],
				"gstn": text['gstn'],
				"cmnt": text['cmnt'],
				"mode": parseInt(text['mode'])
			  };
		  
			  await db["cust"].insertOne(insertdict);
			  callback([insertdict["name"]]);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }		  
		  if (idf === "supplier") {
			try {
			  const sp_id = "1";   // 1 for suppliers and 2 for customers
			  const actype = "4";  // profite-loss
			  const ledgid = new ObjectId().toString();
			  const insertledgD = { "ledgid": ledgid, "ac_type": actype, "sale_pur_ID": sp_id };
		  
			  const getledger = await db["ledg"].insertOne(insertledgD);
		  
			  const csid = new ObjectId().toString();
			  const newledgid = new ObjectId().toString();
			  const insertdict = {
				"csid": csid,
				"ledgid": newledgid,
				"name": text['name'],
				"add1": text['add1'],
				"add2": text['add2'],
				"add3": text['stcode'],
				"pincode": text['pincode'],
				"area": text['area'],
				"phone": text['phone'],
				"email": text['email'],
				"offphone": text['offphone'],
				"pan": text['pan'],
				"bal": parseFloat(text['obal']),
				"regn": text['regn'],
				"gstn": text['gstn'],
				"cmnt": text['cmnt'],
				"mode": parseInt(text['mode'])
			  };
		  
			  await db["sup"].insertOne(insertdict);
			  callback([insertdict["name"]]);
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
	};

	if(mode==="update"){
		if (idf === "items") {
			try {
			  const oid = new ObjectId(text["_id"]);
			  const myquery = { "_id": oid };
			  delete text["_id"];  // CANNOT Update Unique ID _id, so deleting from text object;
			  const pnet = parseFloat(parseFloat(text['prate']) * ((100 + (12)) / 100)).toFixed(2);
			  text['netrate'] = parseFloat(pnet);
			  text['prate'] = parseFloat(text['prate']);
			  text['srate'] = parseFloat(text['srate']);
			  text['cgst'] = parseFloat(text['cgst']);
			  text['sgst'] = parseFloat(text['sgst']);
			  text['gst'] = parseFloat(text['gst']);
			  text['igst'] = parseFloat(text['gst']);
			  text['dis'] = parseFloat(text['dis']);
			  text['mrp'] = parseFloat(text['mrp']);
		  
			  const updateval = { $set: text };
			  await db["itm"].updateOne(myquery, updateval);
			  callback({ "name": text["name"] });
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
		  if (idf === "customer") {
			try {
			  const oid = new ObjectId(text["_id"]);
			  const myquery = { "_id": oid };
			  delete text["_id"];  // CANNOT Update Unique ID _id, so deleting from the text object;
			  text['bal'] = parseFloat(text['bal']);
			  text['mode'] = parseInt(text['mode']);
			  const updateval = { $set: text };
			  await db["cust"].updateOne(myquery, updateval);
			  callback({ "name": text["name"] });
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  if (idf === "supplier") {
			try {
			  const oid = new ObjectId(text["_id"]);
			  const myquery = { "_id": oid };
			  delete text["_id"];  // CANNOT Update Unique ID _id, so deleting from the text object;
			  text['bal'] = parseFloat(text['bal']);
			  text['mode'] = parseInt(text['mode']);	  
			  const updateval = { $set: text };
			  await db["sup"].updateOne(myquery, updateval);
			  callback({ "name": text["name"] });
			  return true;
			} catch (error) {
			  console.error("Error:", error);
			  return false;
			}
		  }
		  
	};
	if(mode==="delete"){
		
	};
};

function spsearch_Ledgid_PartyName(db, sp, cs, frm, tod, itype, billas, ledgid, partyname, callback){
	var newitype = itype.replace(/["'\(|\)]/g,'').split(",");
	var itypeary = [];
	for(var i=0; i<newitype.length; i++){itypeary.push(newitype[i])};

	var newbillas = billas.replace(/["'\(|\)]/g,'').split(",");
	var billasary = [];
	for(var i=0; i<newbillas.length; i++){billasary.push(newbillas[i])};
	
	var searchparam = {"ledgid":ledgid,"billdate":{"$gte":frm, "$lte":tod,},
			"itype":{"$in":itypeary}, "billas":{"$in":billasary} }
	
	
	const findResultSale = db[sp].find(searchparam).toArray();
	findResultSale.then(function(result){
			result["partyinfo"]={};
			for(var i=0; i<result.length; i++){
				result[i]["name"]=partyname;
				result[i]["invdate"]=result[i]["billdate"];
				} 
			callback(result);
		})
}
	
function spsearch_Ledgid_Billno(db, sp, cs, frm, tod, itype, billas, billno, ledgid, callback){
	var newitype = itype.replace(/["'\(|\)]/g,'').split(",");
	var itypeary = [];
	for(var i=0; i<newitype.length; i++){itypeary.push(newitype[i])};

	var newbillas = billas.replace(/["'\(|\)]/g,'').split(",");
	var billasary = [];
	for(var i=0; i<newbillas.length; i++){billasary.push(newbillas[i])};
	db[cs].find({"ledgid":ledgid}).sort({"_id":-1}).toArray().then(function(partydetails){
		
		var ledgid = partydetails[0]["ledgid"];
		var searchparam = {"ledgid":ledgid,"billno":billno,"billdate":{"$gte":frm, "$lte":tod,},
			"itype":{"$in":itypeary}, "billas":{"$in":billasary}, }
		
		const findResultSale = db[sp].find(searchparam).toArray();
		findResultSale.then(function(result){
			result["partyinfo"]=partydetails[0];
			for(var i=0; i<result.length; i++){
				result[i]["name"]=partydetails[0]["name"];
				result[i]["invdate"]=result[i]["billdate"];
				} 
			
			callback(result);
		})
	});
}

function spsearch_With_Ledgid(db, sp, cs, text, frm, tod, itype, billas, callback){
	var newitype = itype.replace(/["'\(|\)]/g,'').split(",");
	var newbillas = billas.replace(/["'\(|\)]/g,'').split(",");

	var itypeary = [];
	for(var i=0; i<newitype.length; i++){itypeary.push(newitype[i])};

	var billasary = [];
	for(var i=0; i<newbillas.length; i++){billasary.push(newbillas[i])};
	
	db[cs].find({"name":text.toUpperCase().trim()}).sort({"_id":-1}).toArray().then(function(partydetails){
	  var ledgid = partydetails[0]["ledgid"];
	  
	  const findResultSale = db[sp].find({
	  "ledgid":ledgid,
	  "billdate":{"$gte":frm, "$lte":tod,},
	  "itype":{"$in":itypeary}, "billas":{"$in":billasary} }).toArray();
		findResultSale.then(function(result){
		  result["partyinfo"]=partydetails[0];
		
		  for(var i=0; i<result.length; i++){
		      result[i]["name"]=partydetails[0]["name"];
		      result[i]["invdate"]=result[i]["billdate"];
		  	} 
		  callback(result);
		})
	});

}

function spsearch_WithOut_Ledgid(db, sp, cs, frm, tod, callback){
  db[sp].find({"billdate":{"$gte":frm, "$lte":tod,},}).sort({"_id":-1}).toArray().then(function(salerow){
    let maxlen = salerow.length
    if(maxlen>0){ 
	    for(let i=0; i<salerow.length; i++){
	      
	      db[cs].find({"ledgid":salerow[i]["ledgid"],}).toArray().then(function(partyrow){
	        var setdict = {"billno":salerow[i]["billno"], "billdate":salerow[i]["billdate"],
	          "billas":salerow[i]["billas"], 
	          "cscr":salerow[i]["cscr"], "amount":salerow[i]["amount"], 
	          "spid":salerow[i]["spid"], "transid":salerow[i]["transid"], 
	          "csid":salerow[i]["csid"], "ledgid":salerow[i]["ledgid"], "itype":salerow[i]["itype"],
	          "fyear":salerow[i]["fyear"],"cmnt":salerow[i]["cmnt"], 
	          "name":partyrow[0]["name"], "add1":partyrow[0]["add1"],
	          "sprow":salerow[i], "partyrow":partyrow[0],
	          "maxlen":maxlen, "cidx":i, 
	        }
	        callback(setdict, i)
	      })
	      
	    }
  }else{callback({"maxlen":1}, 0)}; // Trick is used to match data.length === spsearchdata.maxlen for callbackwork
    
  })

  }
  

function csfind_by_name(db, method, idf, text, column, limit, callback){
	var data = []; 
	var qrystr = "";
	
	if (idf==="items"){
		const findResult = db["itm"].find({"name":new RegExp("^" +text, "i")}).limit(5).toArray();
		findResult.then(function(result){
		
		if (result.length > 0) {
			const fin_res = [];
			for (let i = 0; i < result.length; i++) 
			{
				const itemid = result[i].itemid.toString();
				result[i].stockarray = [];
				fin_res.push(db["stk"].find({ "itemid": itemid }).sort({ 'itemid': -1 }).toArray().then(function (stkresult) {
						result[i].stockarray = stkresult;
					})
				);
			}
			Promise.all(fin_res)
			  .then(() => {
				callback(result);
				
			  })
			  .catch((e) => {console.log(e)});
		  }
		  else{
			callback([]);
		  }
		});

		return true;
		
	};
   
   if (idf==="stock"){
	   const findResult = db["stk"].find({"itemid":text}).sort({'itemid' : -1}).limit(limit).toArray();
	   findResult.then(function(result){
		   callback(result); 
		 });
	   return true;

	};

	if (idf==="customer"){
	
		const findResult = db["cust"].find({"name":new RegExp("^" +text)}).limit(5).toArray();
		findResult.then(function(result){
			callback(result);
			// if(method==="GET"){ 
			// 	for(var i=0; i<result.length; i++){data.push(result[i].name);}
			//   	callback(data);
			// }else{
			// 	callback(result);
			// }  
		});
		return true;
	};
	if (idf==="supplier"){
		const findResult = db["sup"].find({"name":new RegExp("^" +text, "i"), "mode":{"$ne":6}}).limit(5).toArray();
		findResult.then(function(result){
			callback(result);
			// if(method==="GET"){ 
			// 	for(var i=0; i<result.length; i++){data.push(result[i].name);}
			//   	callback(data);
			// }else{
			// 	callback(result);
			// }  
		});
		return true;
	};
   
	if (idf==="sale"){
		var frm = limit["frm"];
		var tod = limit["tod"];
		var itype = limit["itype"];
		var billas = limit["billas"];
		var billno = limit["billno"];
		var ledgid = limit["ledgid"];
		var partyname = limit["partyname"];
		if (text.trim()){	
			spsearch_With_Ledgid(db, "sale", "cust", text, frm, tod, itype, billas, callback);
		}else{
			if(partyname.trim()){
				spsearch_Ledgid_PartyName(db, "sale", "cust", frm, tod, itype, billas, ledgid, partyname, callback)
			}
			else if(billno.trim()){
				spsearch_Ledgid_Billno(db, "sale", "cust", frm, tod, itype, billas, billno, ledgid, callback)
				
			}
			else{
				spsearch_WithOut_Ledgid(db, "sale", "cust", frm, tod, function(spsearchdata, idx){
					data.push(spsearchdata)
				    if (data.length === spsearchdata.maxlen){callback(data);}
				})
			}
		}
		return true;
	};

	if (idf==="purchase"){
		var frm = limit["frm"];
		var tod = limit["tod"];
		var itype = limit["itype"];
		var billas = limit["billas"];
		var billno = limit["billno"];
		var ledgid = limit["ledgid"];
    	var partyname = limit["partyname"];
		if (text.trim()){	
			spsearch_With_Ledgid(db, "pur", "sup", text, frm, tod, itype, billas, callback);
		}else{
			if(partyname.trim()){
				spsearch_Ledgid_PartyName(db, "pur", "sup", frm, tod, itype, billas, ledgid, partyname, callback)
			}
			else if(billno.trim()){
				spsearch_Ledgid_Billno(db, "pur", "sup", frm, tod, itype, billas, billno, ledgid, callback)
				
			}
			else{
				spsearch_WithOut_Ledgid(db, "pur", "sup", frm, tod, function(spsearchdata, idx){
					data.push(spsearchdata)
				    if (data.length === spsearchdata.maxlen){callback(data);}
				})
			}
			
		}
		return true;
		
	};

   if (idf==="billnoset"){
   	var fy = parseInt(limit["fyear"]);
   	var bas = limit["billas"].toUpperCase();
   	var bhd = limit["billhead"].toUpperCase();
    // project attribute return field by name of field and 0 = off; 1= on 1==> will return given field only with _id;
    // project attribute second argumentt "name":"$billno" act as alias ==> ( SELECT billno as name FROM SALES .... ) in SQL;

	const findResult = db["sale"].find({"fyear":fy, "billas":bas, "billno":new RegExp("^"+bhd),
		}).project({"billno":1, "name":"$billno"}).sort({"_id":-1}).limit(1).toArray();
	findResult.then(function(result){
		let fornewuser = {
			billno: 'S00000',
			name : 'S00000',
		}
		if(result.length > 0){
			callback(result);
		}
		else{
			result.push(fornewuser);
			callback(result)
		}
		
	});
	return true;
   };

	if(qrystr===""){
	 	callback([">>>*** Wrong Methods Check Again !"]);
	 	return true;
	 } 
 	
 	}

function Get_GSTSUMMARY(db, sp, cs, frm, tod, callback){
  // var agr = [{"$lookup":{"from":"purchase","localField":"spid","foreignField":"spid", "as":"spmain"}},
  //            {"$lookup":{"from":"products","localField":"itemid","foreignField":"itemid", "as":"iteminfo"}}]; 
  var agr = [{"$match": {"billdate":{"$gte":frm, "$lte":tod,}}},
           {"$lookup":{"from":cs,"localField":"spid","foreignField":"spid", "as":"spitems"},
            },];
  db[sp].aggregate(agr).toArray().then(function(spmain){ 
    let maxlen = spmain.length
    if(maxlen>0){ 
      maxlen = 0; // reset to zero; so that will add actual spitems(sales_items or purchase_items to maxlen) 
      for(let i=0; i<spmain.length; i++){
        let spd = spmain[i]["spitems"]
	
        maxlen += spd.length;
        for(let j=0; j<spd.length; j++){
          db["itm"].find({"itemid":spd[j]["itemid"]}).toArray().then(function(items){
           
            var setdict = {"billno":spmain[i]["billno"], "billdate":spmain[i]["billdate"],
            "taxable":spd[j]["amt"]-spd[j]["tdisamt"],
            "netpayable":spd[j]["netamt"]*spd[j]["qty"],
            "tax":items[0]["gst"], "tax1":items[0]["cgst"],
            "tax2":items[0]["sgst"],
            "cgst":parseFloat(spd[j]["cgst"]),"sgst":parseFloat(spd[j]["cgst"]),
            "igst":parseFloat(spd[j]["cgst"])+parseFloat(spd[j]["cgst"]),
            "billas":spmain[i]["billas"], 
            "itype":spmain[i]["itype"], "amount":spmain[i]["amount"], 
            "cscr":spmain[i]["cscr"], "transid":spmain[i]["transid"], 
            "csid":spmain[i]["csid"], "ledgid":spmain[i]["ledgid"],
            "fyear":spmain[i]["fyear"],"cmnt":spmain[i]["cmnt"], 
            "maxlen":maxlen, "cidx":i, 
          }
          callback(setdict, i)
          })
        } 
      }
  }else{callback({"maxlen":1}, 0)}; // Trick is used to match data.length === spsearchdata.maxlen for callbackwork
    
  })
}

function fetch_cash_ledger_detail(db, sp, cs, frm, tod, callback){
  db[sp[0]].find(sp[1]).toArray().then(function(mresult){
    let maxlen = mresult.length
    if(maxlen>0){ 
	    for(let i=0; i<mresult.length; i++){
	      db["sup"].find({"ledgid":mresult[i]["ledgid"]}).toArray().then(function(result){
	      	if(result.length>0){
	      		var p = result[0];
	      		//console.log(">>> SUP <<<<", p)
	          var setdict = {"cashid":mresult[i]["cashid"], "transid":mresult[i]["transid"], "ledgid":mresult[i]["ledgid"],"trtype":"1", 
			        "type":mresult[i]["type"], "billno":mresult[i]["billno"], "credit":mresult[i]["credit"],"debit":mresult[i]["debit"],
			        "billdate":mresult[i]["date"], "comment":mresult[i]["comment"], "name":p["name"], "add1":p["add1"],
			        "add2":p["add2"],"add3":p["add3"],"phone":p["phone"],"email":p["email"],"cash":p["name"],
			        "gstn":p["gstn"],"regn":p["regn"],"pincode":p["pincode"],"area":p["area"],
			        "mode":p["mode"],"cmnt":p["cmnt"],"maxlen":maxlen,}
			        callback(setdict, i)

	      }else{
	      	db["cust"].find({"ledgid":mresult[i]["ledgid"]}).toArray().then(function(result){
	      		if(result.length>0){
	      			var p = result[0];
	      			//console.log(">>> CUST <<<<", p)
		      		var setdict = {"cashid":mresult[i]["cashid"], "transid":mresult[i]["transid"], "ledgid":mresult[i]["ledgid"],"trtype":"1", 
			        "type":mresult[i]["type"], "billno":mresult[i]["billno"], "credit":mresult[i]["credit"],"debit":mresult[i]["debit"],
			        "billdate":mresult[i]["date"], "comment":mresult[i]["comment"], "name":p["name"], "add1":p["add1"],
			        "add2":p["add2"],"add3":p["add3"],"phone":p["phone"],"email":p["email"],"cash":p["name"],
			        "gstn":p["gstn"],"regn":p["regn"],"pincode":p["pincode"],"area":p["area"],
			        "mode":p["mode"],"cmnt":p["cmnt"],"maxlen":maxlen,}
	          callback(setdict, i)
	         }
	      	})
	      }
	      })
	    }
  }else{callback({"maxlen":1}, 0)}; // Trick is used to match data.length === spsearchdata.maxlen for callbackwork
    
  })

  }

function fetch_sp_ledger_detail(db, sp, cs, lookuptable, frm, tod, callback){
	var agr = [{"$match": sp[1]},
           {"$lookup":{"from":lookuptable,"localField":"ledgid","foreignField":"ledgid", "as":"spmain"},
            },];
			// console.log(sp);
  db[sp[0]].aggregate(agr).toArray().then(function(mresult){ 
  //db[sp[0]].find(sp[1]).toArray().then(function(mresult){
    let maxlen = mresult.length;
	// console.log(mresult[0]['spmain'], sp);
	// console.log(mresult[i]['spmain']);
	if(maxlen>0){ 
	    for(let i=0; i<mresult.length; i++){
		 var count=0;
	      db[cs].find({"ledgid":mresult[i]["ledgid"]}).toArray().then(function(result){

	      	if(result.length>0){
	      		var p = result[0];
	          var setdict = {"cashid":mresult[i]["cashid"], "transid":mresult[i]["transid"], "ledgid":mresult[i]["ledgid"],"trtype":"1", 
			        "type":mresult[i]["type"], "billno":"", "spid":"", 
			        "credit":mresult[i]["credit"],"debit":mresult[i]["debit"],"billdate":mresult[i]["date"], 
			        "cmnt":mresult[i]["cmnt"], "name":p["name"], "add1":p["add1"],
			        "add2":p["add2"],"add3":p["add3"],"phone":p["phone"],"email":p["email"],"cash":p["name"],
			        "gstn":p["gstn"],"regn":p["regn"],"pincode":p["pincode"],"area":p["area"],
			        "mode":p["mode"],"cmnt":p["cmnt"],"maxlen":maxlen,}
			      var spmaindata = mresult[i]["spmain"];
				  
			      for(let j=0; j<spmaindata.length; j++){
					// console.log(spmaindata[j]['billno']);
					setdict[j] = {'billno' : spmaindata[j]["billno"], 'spid' : spmaindata[j]["spid"], 'cmnt' : spmaindata[j]["cmnt"] }
			      	setdict["billno"]=spmaindata[j]["billno"]; // updateing records from spmaindata (sale,purchase main table)
			      	setdict["spid"]=spmaindata[j]["spid"] ; // updateing records from spmaindata (sale,purchase main table)
			      	setdict["cmnt"]=spmaindata[j]["cmnt"] ; // updateing records from spmaindata (sale,purchase main table)
					// callback(setdict, i)
				}
				//   setdict['billno'] = setdict[count]['billno'] ;
				//   setdict['spid'] = setdict[count]['spid'];
				//   setdict['cmnt'] = setdict[count]['cmnt'];
					// console.log("======");
				  setdict['billno'] = spmaindata[count]['billno'];
				  setdict['spid'] = spmaindata[count]['spid'];
				  setdict['cmnt'] = spmaindata[count]['cmnt'];
				//   console.log(i," -- ", count, spmaindata[count]['billno'], setdict['billno']);
				  count += 1;
				//   delete setdict[count];
				//   console.log(setdict[count]);
			      callback(setdict, i);
				  
				//   delete setdict[count];
	      }
	      })
	    }
  }
	  else{callback({"maxlen":1}, 0)}; // Trick is used to match data.length === spsearchdata.maxlen for callbackwork
    
  })

  }

function ledger_n_tax_search(db, idf, text, ledgid, frm, tod, itype, billas, fyear, limitrange, callback){
	var data=[];

	if(idf=="cashledger"){
		fetch_cash_ledger_detail(db, ["cash", {"date":{"$gte":frm, "$lte":tod,},}], "cust", frm, tod, function(ledgerdata, idx){
				data.push(ledgerdata)
			  if (data.length === ledgerdata.maxlen){callback(data);}// <<< data is comming from FOR LOOP, **MUST CALLBACK AFTER FULL DATA FETCHED 
			  // *** ledgerdata.maxlen show total data length available, after data.push >>> data.length === ledgerdata.maxlen callback called !
		});
	}

	if(idf=="saleledger"){
		if (ledgid.trim()==""){var searcfilter = {"date":{"$gte":frm, "$lte":tod,},"type":2,}}
		else{var searcfilter = {"date":{"$gte":frm, "$lte":tod,},"ledgid":ledgid,"type":2,}}

		fetch_sp_ledger_detail(db, ["trns", searcfilter], "cust", "sales", frm, tod, function(ledgerdata, idx){

				// console.log("coming here saleledger  ", ledgerdata);
				data.push(ledgerdata)

				// callback(data);
			  if (data.length === ledgerdata.maxlen){callback(data);}// <<< data is comming from FOR LOOP, **MUST CALLBACK AFTER FULL DATA FETCHED 
			  // *** ledgerdata.maxlen show total data length available, after data.push >>> data.length === ledgerdata.maxlen callback called !
		});
	}

	if(idf=="purchaseledger"){
		if (ledgid.trim()==""){var searcfilter = {"date":{"$gte":frm, "$lte":tod,},"type":1,}}
		else{var searcfilter = {"date":{"$gte":frm, "$lte":tod,},"ledgid":ledgid,"type":1,}}

		fetch_sp_ledger_detail(db, ["trns", searcfilter], "sup", "purchase", frm, tod, function(ledgerdata, idx){
				data.push(ledgerdata)
			  if (data.length === ledgerdata.maxlen){callback(data);}// <<< data is comming from FOR LOOP, **MUST CALLBACK AFTER FULL DATA FETCHED 
			  // *** ledgerdata.maxlen show total data length available, after data.push >>> data.length === ledgerdata.maxlen callback called !
		});
	}

	if (idf==="suppliersearch"){
		db["sup"].find({"name":new RegExp("^" +text, "i"), "mode":{"$ne":6}}).limit(5).toArray().then(function(result){
			callback(result); 
		});
		return true;
	};
  if (idf==="companysearch"){
		db["sup"].find({"name":new RegExp("^" +text, "i"), "mode":{"$eq":6}}).limit(5).toArray().then(function(result){
			callback(result); 
		});
		return true;
	};
  if (idf==="companystock"){
	  	// compid is the ledgerId of supplier or company
	  	var agr = [{"$match": {"compid":ledgid}},
	           {"$lookup":{"from":"stock","localField":"itemid","foreignField":"itemid", "as":"stock"},
	            },];
	  	db["itm"].aggregate(agr).toArray().then(function(itemdata){ 
				for(let i=0; i<itemdata.length; i++){
				
				if(itemdata[i]["stock"].length > 0){
					itemdata[i]["stockid"]=itemdata[i]["stock"][0]["stockid"];
					itemdata[i]["batchno"]=itemdata[i]["stock"][0]["batchno"];
					itemdata[i]["qty"]=itemdata[i]["stock"][0]["qty"];
					itemdata[i]["expdate"]=itemdata[i]["stock"][0]["expdate"];
				}
			  }
			  //console.log(itemdata)
			  callback(itemdata); 
			});
			return true;
	};

	if (idf==="Updatecompanystock"){
			for(let i=0; i<text.length; i++){
				const filter = {"stockid":text[i]["stockid"],"itemid":text[i]["itemid"],};
				const updateObj = { "$set": {"qty":parseInt(text[i]["qty"]), "expdate":text[i]["expdate"],}};
				db["stk"].updateMany(filter, updateObj).then(function(stkupdate){})
			}
			callback("Updated");
		return true;
	}

	if (idf==="customersearch"){
		db["cust"].find({"name":new RegExp("^" +text, "i")}).limit(5).toArray().then(function(result){
			callback(result); 
		});
		return true;
	};
	
	if (idf==="gstsummary"){
		var gstrowdict = {"rowp":[], "rows":[], "info":{"purdata":true,"saledata":true}};
		// >>>> "billno":"","cmnt":"" <<<< adding these keys just for html/javascript adjustment only; no further utilized here   
		var agpur = {"0":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""}, 
          "5":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""},
          "12":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""}, 
          "18":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""},
          "28":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""}, }
		var agsale = {"0":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""}, 
          "5":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""},
          "12":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""}, 
          "18":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""},
          "28":{"netpayable":0,"taxable":0,"amount":0,"cgst":0,"sgst":0,"taxamt":0,"tax":0,"billas":'',"itype":"","billno":"","cmnt":""}, }
    Get_GSTSUMMARY(db, "pur", "purchase_item", frm, tod, function(gstpurdata, idx){
      gstrowdict["rowp"].push(gstpurdata);
   
      if (gstrowdict["rowp"].length === gstpurdata.maxlen){  
       
        Get_GSTSUMMARY(db, "sale", "sales_item", frm, tod, function(gstsaledata, idx){
              gstrowdict["rows"].push(gstsaledata)
              
              if (gstrowdict["rows"].length === gstsaledata.maxlen){
                if(typeof(gstrowdict["rowp"][0]["itype"])=="undefined"){
                  gstrowdict["rowp"]=[{"taxable":"0.00","netpayable":"0.00","tax":"0","tax1":"0","tax2":"0","amount":"0","itype":"0",}]
                  gstrowdict["info"]["purdata"]=false;
                }else{
                  for(let i=0; i<gstrowdict["rowp"].length; i++){
                    if(agpur.hasOwnProperty(gstrowdict["rowp"][i]["tax"])){
                        agpur[gstrowdict["rowp"][i]["tax"]]["taxable"]+=gstrowdict["rowp"][i]["taxable"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["netpayable"]+=gstrowdict["rowp"][i]["netpayable"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["amount"]+=parseFloat(gstrowdict["rowp"][i]["amount"])
                        agpur[gstrowdict["rowp"][i]["tax"]]["cgst"]+=gstrowdict["rowp"][i]["cgst"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["sgst"]+=gstrowdict["rowp"][i]["sgst"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["taxamt"]+=gstrowdict["rowp"][i]["igst"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["tax"]=gstrowdict["rowp"][i]["tax"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["billas"]=gstrowdict["rowp"][i]["billas"]
                        agpur[gstrowdict["rowp"][i]["tax"]]["itype"]=gstrowdict["rowp"][i]["itype"]
                     }
                  }
                  
                } 

                if(typeof(gstrowdict["rows"][0]["itype"])=="undefined"){
                  gstrowdict["rows"]=[{"taxable":"0.00","netpayable":"0.00","tax":"0","tax1":"0","tax2":"0","amount":"0","itype":"0",}]
                  gstrowdict["info"]["saledata"]=false;
                }else{
                  for(let i=0; i<gstrowdict["rows"].length; i++){
                    if(agsale.hasOwnProperty(gstrowdict["rows"][i]["tax"])){
                        agsale[gstrowdict["rows"][i]["tax"]]["taxable"]+=gstrowdict["rows"][i]["taxable"]
                        agsale[gstrowdict["rows"][i]["tax"]]["netpayable"]+=gstrowdict["rows"][i]["netpayable"]
                        agsale[gstrowdict["rows"][i]["tax"]]["amount"]+=parseFloat(gstrowdict["rows"][i]["amount"])
                        agsale[gstrowdict["rows"][i]["tax"]]["cgst"]+=gstrowdict["rows"][i]["cgst"]
                        agsale[gstrowdict["rows"][i]["tax"]]["sgst"]+=gstrowdict["rows"][i]["sgst"]
                        agsale[gstrowdict["rows"][i]["tax"]]["taxamt"]+=gstrowdict["rows"][i]["igst"]
                        agsale[gstrowdict["rows"][i]["tax"]]["tax"]=gstrowdict["rows"][i]["tax"]
                        agsale[gstrowdict["rows"][i]["tax"]]["billas"]=gstrowdict["rows"][i]["billas"]
                        agsale[gstrowdict["rows"][i]["tax"]]["itype"]=gstrowdict["rows"][i]["itype"]
                     }
                  }
                }  
                //console.log(">>>>> ",gstrowdict);
                gstrowdict["rowp"]=agpur;
                gstrowdict["rows"]=agsale;
                callback(gstrowdict);
              }
          })

      }
  });
	}

}

async function deleteSalePurDocuments(db, rp, sp, spitm, fyear) {
    try {
        const cfilter = { "transid": rp["transid"], "ledgid": rp["ledgid"] };

        const res = await db[spitm].find({ "spid": rp["spid"] }).toArray();
        for (let i = 0; i < res.length; i++) {
            const stkres = await db['stk'].find({ "itemid": res[i]['itemid'], "batchno": res[i]['batchno'] }).toArray();
            let qty;
            if (sp == "pur") {
                qty = stkres[0]["qty"] - res[i]['qty'];
            } else if (sp == "sale") {
                qty = stkres[0]["qty"] + res[i]['qty'];
            }
            const filter = { "stockid": stkres[0]["stockid"], "itemid": stkres[0]["itemid"] };
            const update = { "$set": { "qty": qty } };
            await db["stk"].updateOne(filter, update);
        }

        await db["trns"].deleteOne(cfilter);
        await db["cash"].deleteOne(cfilter);
        await db["pr"].deleteOne(cfilter);
        await db[sp].deleteOne(cfilter);
        await db[spitm].deleteMany({ "spid": rp["spid"] });

        // ** here stock should be updated after delete ** //
    } catch (err) {
        console.log(err);
    }
}

async function pay_rcpt_cash_update(db, typ, rp, cr, dr, fyear) {
    const cfilter = { "transid": rp["transid"], "ledgid": rp["ledgid"] };
    const cupdate = { "$set": { "type": typ, "billno": rp["billno"], "credit": cr, "debit": dr, "date": rp["billdate"], "comment": rp["cmnt"] } };
    const cinsert = {
        "cashid": 0,
        "ledgid": rp["ledgid"],
        "transid": rp["transid"],
        "type": typ,
        "billno": rp["billno"],
        "credit": cr,
        "debit": dr,
        "date": rp["dbbilldate"],
        "comment": rp["cmnt"]
    };
    const prupdate = { "$set": { "type": typ, "billno": rp["billno"], "credit": dr, "debit": cr, "date": rp["dbbilldate"] } };
    const prinsert = {
        "prid": 0,
        "ledgid": rp["ledgid"],
        "transid": rp["transid"],
        "vautono": "",
        "type": typ,
        "cash": 0,
        "billno": rp["billno"],
        "credit": dr,
        "debit": cr,
        "date": rp["dbbilldate"],
        "status": 0,
        "fyear": fyear
    };

    if (rp["cscr"] == 'CASH') {
        await db["pr"].deleteOne(cfilter);
        const cdata = await db["cash"].find(cfilter).toArray();
        if (cdata.length > 0) {
            await db["cash"].updateOne(cfilter, cupdate);
            // "UPDATE cash document Here because data Exists";
        } else {
            cinsert["cashid"] = new ObjectId().toString(); // updating required cashid 
            await db["cash"].insertOne(cinsert);
            // "Insert cash document Here because data NOT-Exists";
        }
    }
    if (rp["cscr"] == 'CREDIT') {
        await db["cash"].deleteOne(cfilter);
        if (rp['mode'] == 2) {
            const prdata = await db["pr"].find(cfilter).toArray();
            if (prdata.length > 0) {
                await db["pr"].updateOne(cfilter, prupdate);
                // "UPDATE pay_rcpt document Here because data Exists";
            } else {
                prinsert["prid"] = new ObjectId().toString(); // updating required prid 
                await db["pr"].insertOne(prinsert);
                // "Insert pay_rcpt document Here because data NOT-Exists";
            }
        }
    }
}


async function csfinalbill(db, idf, rd, mode, main, callback){
	var rp = rd["pan"];
	var cscr = rp["cscr"];
	var fyear = parseInt(rp["fyear"]);
	var lastID;
	var grid = rd["grid"];
	var rgrid = rd["grid"];
	var rac = rd["ac"];
	//var main = false;
	var typ = 1 ; // FOR PURCHASE typ=2 FOR SALE, typ=3 FOR PAYMENT typ=4 FOR RECEIPT typ=7 FOR BANK TARNSACTION, typ=8 PUR RETURN, typ=9 SALE RETURN
	var transid;
	var cashid;
	var saleid;
	var purchaseid;
	var acinsertid;
	var purflag;
	var itemflag;
	var saleflag;
	var transflag;
	var prupdaterow;
	var spid;
	var prid = 0;
	var ins_upd_row;
	var crdrtype="crdeit";
	var cr = "credit";
	var dr = "debit"
	var row = {"transid":"N.A","pay_recipt":"N.A","saleid":"N.A","items":"N.A","cashid":"N.A",};
  
	if (idf==="supplier"){
		if (mode=="save"){
			    if (cscr=="CHALLAN"){
			    	main = false;
			    	var transid = "0";
					  spid = new ObjectId().toString();
						var insert_purchase = {"spid" : spid,"ledgid":rp['ledgid'],"transid":transid,"billautono":"","itype":rp['itype'],
							"billno":rp['billno'],"billdate":rp['dbbilldate'],"invdate":rp['dbinvdate'],"cscr":rp['cscr'],"csid":rp['csid'],
							"amount":parseFloat(rp['gtot']),"billas":rp['billas'],"cmnt":rp['cmnt'],"fyear":fyear,};
							try {
								const purchaseid = await db["puro"].insertOne(insert_purchase);
								const itemflag = await PANEL_PURCHASE_PROD(fyear, "", "", rd, db, spid, transid, main, callback);
							} catch (err) {
								console.log(err);
							}
							
						return true;
						}

				transid = new ObjectId().toString();
				var insert_mytrans = {"transid":transid,"ledgid":rp['ledgid'],"trtype":rp['itype'],"type":typ,"credit":0, "debit":0,'date':rp['dbbilldate'],"fyear":fyear,};
				if (cscr=="CASH"){insert_mytrans["debit"]=parseFloat(rp['gtot']);};
				if (cscr=="CREDIT"){insert_mytrans["credit"]=parseFloat(rp['gtot']); };
				try {
					const trnsresult = await db["trns"].insertOne(insert_mytrans);
					if (cscr == 'CREDIT') {
						if (rp['mode'] == 2) {
							const prid = new ObjectId().toString();
							const probj = {
								"prid": prid,
								"ledgid": rp['ledgid'],
								"transid": transid,
								"vautono": "",
								"type": typ,
								"cash": 0,
								"billno": rp['billno'],
								"credit": parseFloat(rp['gtot']),
								"debit": 0,
								'date': rp['dbbilldate'],
								"status": 0,
								"fyear": fyear,
							};
							const prinst = await db["pr"].insertOne(probj);
						}
					}
					
					if (cscr == 'CASH') {
						const cashid = new ObjectId().toString();
						const cashobj = {
							"cashid": cashid,
							"ledgid": rp['ledgid'],
							"transid": transid,
							"type": typ,
							"billno": rp['billno'],
							"credit": 0,
							"debit": parseFloat(rp['gtot']),
							'date': rp['dbbilldate'],
							'comment': rp['cmnt'],
							"fyear": fyear,
						};
						const cashinst = await db["cash"].insertOne(cashobj);
					}
					
					const spid = new ObjectId().toString();
					const insert_purchase = {
						"spid": spid,
						"ledgid": rp['ledgid'],
						"transid": transid,
						"billautono": "",
						"itype": rp['itype'],
						"billno": rp['billno'],
						"billdate": rp['dbbilldate'],
						"invdate": rp['dbinvdate'],
						"cscr": rp['dbcscr'],
						"csid": rp['csid'],
						"amount": parseFloat(rp['gtot']),
						"billas": rp['billas'],
						"cmnt": rp['cmnt'],
						"fyear": fyear,
					};
					const purchaseid = await db["pur"].insertOne(insert_purchase);
					await PANEL_PURCHASE_PROD(fyear, "", "", rd, db, spid, transid, main, callback);
				} catch (error) {
					console.error("error in insert",error);
				}

	  } // supplier save mode close

	  if (mode=="update"){
		
	  	  typ = 1 ; // FOR PURCHASE typ=2 FOR SALE, typ=3 FOR PAYMENT typ=4 FOR RECEIPT typ=7 FOR BANK TARNSACTION, typ=8 PUR RETURN, typ=9 SALE RETURN
	  	  transid = rp['transid'];
		    spid = rp['spid'];
		    const filter = {"spid":spid,"transid":transid,};
		    const pur_update = { "$set": {"ledgid":rp['ledgid'], "itype":rp['itype'], "billno":rp["billno"], "billdate":rp["dbbilldate"],
				      "cscr":rp["dbcscr"], "csid":rp['csid'], "amount":parseFloat(rp['gtot']), "billas":rp['billas'],"cmnt":rp['cmnt'],}};

		  if (cscr=='CHALLAN'){
				console.log("yaha aya kya ?");
				main = false;
				try {
					const puroupdate = await db["puro"].updateOne(filter, pur_update);
					await PANEL_PURCHASE_PROD(fyear, callback, "", rd, db, spid, transid, main, callback);
					return true;
				} catch (err) {
					console.log(err);
					return false;
				}
				//
		  	} // purchase order update challan closed
				
			  try {
				const filter_mytrans = {"ledgid": rp['ledgid'], "transid": rp['transid']};
				const mytransobj = {
					"transid": rp['transid'],
					"ledgid": rp['ledgid'],
					"trtype": rp['dbcscr'],
					"type": typ,
					"credit": 0,
					"debit": 0,
					'date': rp['billdate'],  //changed dbbilldate to billdate
					"fyear": fyear,
				};
				
				if (cscr == "CASH") {
					mytransobj["debit"] = parseFloat(rp['gtot']);
				} else if (cscr == "CREDIT") {
					mytransobj["credit"] = parseFloat(rp['gtot']);
				}
				
				const update_mytrans = { "$set": mytransobj };
			
				const filter_pur = {"spid": spid, "transid": transid};
				const update_pur = {
					"$set": {
						"spid": spid,
						"ledgid": rp['ledgid'],
						"transid": transid,
						"billautono": "",
						"itype": rp['itype'],
						"billno": rp['billno'],
						"billdate": rp['billdate'], // here dbbilldate changed in below line too
						"invdate": rp['invdate'],
						"cscr": rp['dbcscr'],
						"csid": rp['csid'],
						"amount": parseFloat(rp['gtot']),
						"billas": rp['billas'],
						"cmnt": rp['cmnt'],
						"fyear": fyear,
					}
				};
			
				await pay_rcpt_cash_update(db, typ, rp, parseFloat(rp["gtot"]), 0, fyear);
				console.log("----",filter_mytrans, update_mytrans);
				const resultMyTrans = await db["trns"].updateOne(filter_mytrans, update_mytrans);
				const resultPur = await db["pur"].updateOne(filter_pur, update_pur);
			
				itemflag = await PANEL_PURCHASE_PROD(fyear, "", "", rd, db, spid, transid, main, callback);
			} catch (error) {
				console.error("error in update",error);
			}
			

		} // supplier update mode close
		if (mode=="delete"){deleteSalePurDocuments(db, rp, "pur", "pitm", fyear);} // supplier delete close final
	} // supplier closed finally

	if (idf==="customer"){

		typ = 2; // FOR SALES typ=1 FOR PURCHASE, typ=3 FOR PAYMENT typ=4 FOR RECEIPT typ=7 FOR BANK TARNSACTION, typ=8 PUR RETURN, typ=9 SALE RETURN
		try {
			if (mode == "save") {
				if (cscr == "CHALLAN") {
					const main = false;
					const transid = "0";
					const spid = new ObjectId().toString();
					const insert_sale = {
						"spid": spid,
						"ledgid": rp['ledgid'],
						"transid": transid,
						"itype": rp['itype'],
						"billautono": "",
						"billno": rp['billno'],
						"billdate": rp['dbbilldate'],
						"cscr": rp['dbcscr'],
						"csid": rp['csid'],
						"amount": parseFloat(rp['gtot']),
						"billas": rp['billas'],
						"cmnt": rp['cmnt'],
						"fyear": fyear,
					};
					await db["puro"].insertOne(insert_sale);
					await PANEL_SALE_PROD(fyear, callback, "", rd, db, spid, transid, main);
					return true;
				}
	
				const transid = new ObjectId().toString();
				const cashid = new ObjectId().toString();
				const spid = new ObjectId().toString();
	
				const insert_mytrans = {
					"transid": transid,
					"ledgid": rp['ledgid'],
					"trtype": rp['dbcscr'],
					"type": typ,
					"credit": 0,
					"debit": 0,
					'date': rp['billdate'],
					"fyear": fyear,
				};
	
				if (cscr == "CASH") {
					insert_mytrans["credit"] = parseFloat(rp['gtot']);
				}
				if (cscr == "CREDIT") {
					insert_mytrans["debit"] = parseFloat(rp['gtot']);
				}
	
				const insert_sale = {
					"spid": spid,
					"ledgid": rp['ledgid'],
					"transid": transid,
					"itype": rp['itype'],
					"billautono": "",
					"billno": rp['billno'],
					"billdate": rp['billdate'], //here dbbilldate
					"cscr": rp['dbcscr'],
					"csid": rp['csid'],
					"amount": parseFloat(rp['gtot']),
					"billas": rp['billas'],
					"cmnt": rp['cmnt'],
					"fyear": fyear,
				};
	
				const cashquery = {
					"cashid": cashid,
					"ledgid": rp['ledgid'],
					"transid": transid,
					"type": typ,
					"billno": rp['billno'],
					"credit": 0,
					"debit": parseFloat(rp['gtot']),
					'date': rp['billdate'],
					'comment': rp['cmnt'],
					"fyear": fyear,
				};
	
				await db["trns"].insertOne(insert_mytrans);
				if (cscr == 'CASH') {
					await db["cash"].insertOne(cashquery);
				}
				if (cscr == 'CREDIT') {
					if (rp['mode'] == 2) {
						const prid = new ObjectId().toString();
						const pr_insert = {
							"prid": prid,
							"ledgid": rp['ledgid'],
							"transid": transid,
							"vautono": "",
							"type": typ,
							"cash": 0,
							"billno": rp['billno'],
							"date": rp['dbbilldate'],
							"credit": parseFloat(rp['gtot']),
							"debit": 0,
							"status": 0,
							"fyear": fyear,
						};
						await db["pr"].insertOne(pr_insert);
					}
				}
	
				await db["sale"].insertOne(insert_sale);
				await PANEL_SALE_PROD(fyear, callback, "", rd, db, spid, transid, main);
	
				return true;
			}
		} catch (err) {
			console.log(err);
			return false;
		}// customer save close final

		if (mode == "update") {
			transid = rp['transid'];
			spid = rp['spid'];
			const filter = { "spid": rp['spid'], "transid": rp['transid'], };
			const sale_update = {
			  "$set": {
				"ledgid": rp['ledgid'], "itype": rp['itype'], "billno": rp["billno"], "billdate": rp["billdate"],
				"cscr": rp["dbcscr"], "csid": rp['csid'], "amount": parseFloat(rp['gtot']), "billas": rp['billas'], "cmnt": rp['cmnt'],
			  }
			};
			
			if (cscr == 'CHALLAN') {
			  main = false;
			  await db["saleo"].updateOne(filter, sale_update);
			  await PANEL_SALE_PROD(fyear, callback, "", rd, db, rp['spid'], rp['transid'], main);
			  return true;
			}
			
			const filter_mytrans = { "ledgid": rp['ledgid'], "transid": rp['transid'], };
			var mytransobj = {
			  "transid": rp['transid'], "ledgid": rp['ledgid'], "trtype": rp['dbcscr'], "type": typ, "credit": 0, "debit": 0, 'date': rp['dbbilldate'], "fyear": fyear,
			};
			
			if (cscr == "CASH") { mytransobj["credit"] = parseFloat(rp['gtot']); }
			if (cscr == "CREDIT") { mytransobj["debit"] = parseFloat(rp['gtot']); }
			var update_mytrans = { "$set": mytransobj };
		  
			const filter_sale = { "spid": rp['spid'], "transid": rp['transid'], };
			var update_sale = {
			  "$set": {
				"spid": spid, "ledgid": rp['ledgid'], "transid": rp['transid'], "itype": rp['itype'], "billautono": "", "billno": rp['billno'],
				"billdate": rp['billdate'], "cscr": rp['dbcscr'], "csid": rp['csid'], "amount": parseFloat(rp['gtot']), "billas": rp['billas'],
				"cmnt": rp['cmnt'], "fyear": fyear,
			  }
			};
			
			var cashquery = {
			  "$set": {
				"ledgid": rp['ledgid'], "transid": rp['transid'], "type": typ, "billno": rp['billno'],
				"credit": 0, "debit": parseFloat(rp['gtot']), 'date': rp['billdate'], 'comment': rp['cmnt'], "fyear": fyear,
			  }
			};
			
			await pay_rcpt_cash_update(db, typ, rp, 0, parseFloat(rp["gtot"]), fyear);
		  
			await db["trns"].updateOne(filter_mytrans, update_mytrans);
			await db["sale"].updateOne(filter_sale, update_sale);
			await PANEL_SALE_PROD(fyear, callback, "", rd, db, rp['spid'], rp['transid'], main);
		  }
		  // customer update close final
		if (mode=="delete"){await deleteSalePurDocuments(db, rp, "sale", "sitm", fyear);} // customer delete close final

	} // customer closed
	
}; // csfinalbill finally closed


async function PANEL_SALE_PROD(fyear, callback, tbl, recdic, db, saleid, transid, main){
	var grid = recdic['grid'] ;
	var ins_data = [];
	var upd_data = [];
	var stk_ins_data = [];
	var stk_upd_sale_data = {};
	var stk_upd_batch_data = [];
	var item_del_update = [];
	var err_items = [];
	var callbackBoolArr = [];
	var stkinfo = {'info':'multibat'};
	var [iadd, iupdt, sno] = [0, 0, -1];
  var idx = 0;
	inforow = [] ;
	
	for (const [k, v] of Object.entries(grid)){
	  
	  if (v['itemid'] !="" && (v['qty'] !="" && v['qty'] != 0)){
		  
		//if (v['spitemid'] !=""){
			// console.log("--->",v['spiid'],"<-----", "---->", v['spiid'].length,"<----");
		if(v['spiid'].length !== 0 ){ 
		  upd_data = {'spiid':v['spiid'], 'spid':saleid, 'amt':v['amt'],'tdisamt':v['tdisamt'],
			  'itemid':v['itemid'],'batchno':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],'srate':v['srate'],
			  'rate_a':v['rate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netamt':v['netamt'],
			  'spid':saleid,};
		  
		  updatedqty = parseInt(v['staticqty'])-parseInt(v['tqty']); // catching difference of qty to be updated
		  if(typeof(v["tqty"])!=="undefined"){
	        stk_upd_sale_data = {'qty':updatedqty,'dbstock':parseInt(v['dbstock']),'stockid':v['stockid'],'itemid':v['itemid'],};
	        // First Update Stock Details Then Sales_item//
	           if (main){await StkUpdate(tbl, stk_upd_sale_data, db, v['name'], main);}; // deliberatly using StkUpdate, ease of using common function;
	           const isSaleItemUpdated = await Sale_Item_Table_Update(fyear, "", "", upd_data, db, saleid, transid);
			   callbackBoolArr.push(isSaleItemUpdated);
        }
		
		}
		else{
			
		  ins_data = {'spid':saleid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'csid':v['csid'],
			  'itemid':v['itemid'],'batchno':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],'srate':v['srate'], 
			  'rate_a':v['rate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netamt':v['netamt'],};
  
		  if (!v['stockarray'].length > 0){
			  if (main){
				stk_ins_data = {'itemid':v['itemid'],'bat':v['batchno'],'qty':parseInt(v['tqty']),'expdate':v['expdate'],};
				var InsertStockid = getUniqueId()+idx;
  	 		idx += 1;
  	 		console.log(" find1008 StockId Not Found in StkInsert PANEL_SALE_PROD Stock Inserted");
  	 		await StkInsert(tbl, stk_ins_data, db, v['name'], InsertStockid, main);
				};
		  }
		  else{
			  if (main){
				  var stockid = "0";
				  var stockdbqty = '0';
				  var stk_update_flag = true;
				  var usergivenqty = parseInt(v['tqty']);
				  var dbstockqty_calculation = 0;
				  // "multibat" would be true when user give qty more than particular batch exists
				  // "multibat" "true" will autometically minus qty from next availabel batch, batch by batch
				  // "multibat" "true" condition not prepaired yet; *** prepair this is important    
				  
				  if(typeof(v['stockarray']) !== "undefined"){
					  for(var i = 0; i < v['stockarray'].length; i++){
						  var db_batch_wise_stk = parseInt(v['stockarray'][i]['qty']);
						  dbstockqty_calculation += db_batch_wise_stk
						  if (dbstockqty_calculation >= usergivenqty){
							  // dbstockqty_calculation may exceed than given qty 
							  var stockid = v['stockarray'][i]['stockid'];
							  var itemid = v['stockarray'][i]['itemid'];
							  // In Sales Stock will Minus;
							  stk_upd_sale_data = {'qty':-parseInt(v['tqty']),'dbstock':parseInt(v['dbstock']),'stockid':stockid,'itemid':itemid,};
							  await StkUpdate(db, stk_upd_sale_data, db, v['name'], main, infomsg="Sales Stock Updated")
							  break
						  }
					  }
				 	}else{// previous stock data not available, so inserting into stock (sales with Negative value)
				 	    console.log("else stock sale ");
						stk_ins_data = {'itemid':v['itemid'],'bat':v['batchno'],'qty':parseInt(v['tqty']),'expdate':v['expdate'],};
							var InsertStockid = getUniqueId()+idx;
  	 					idx += 1;
  	 					stk_ins_data['qty'] = -stk_ins_data["qty"];
  	 					console.log(" find1078 stockarray  Not Found So with StkInsert PANEL_SALE_PROD Stock Inserted with Negative value");
  	 					await StkInsert(tbl, stk_ins_data, db, v['name'], InsertStockid, main);
				 		}
			  }
		  }

		  
		 const isSaleItemInserted = await Sale_Item_Table_Insert(fyear, callback, "", ins_data, db, saleid, transid);
		 callbackBoolArr.push(isSaleItemInserted);
		}
	  }
	}
	callback(callbackBoolArr);
   
  }

  async function Sale_Item_Table_Insert(fyear, callback, tblname, d, db, saleid, transid) {
	const spiid = new ObjectId().toString();
	const insert_sale_itm = {
	  "spiid": spiid, "spid": saleid, "netamt": parseFloat(d['netamt']), "tdisamt": parseFloat(d['tdisamt']), "csid": d['csid'], "itemid": d['itemid'],
	  "batchno": d["batchno"], "qty": parseInt(d['qty']), "bonus": d['bonus'], "rate": parseFloat(d['rate']), "srate": parseFloat(d['srate']), "rate_a": parseFloat(d['rate_a']),
	  "amt": parseFloat(d['amt']), "dis": parseFloat(d['dis']), "mrp": parseFloat(d['mrp']), "cgst": parseFloat(d['tax1amt']),
	};
  
	try {
	  const sale_items = await db["sitm"].insertOne(insert_sale_itm);
	  //callback(["SALE DATA INSERTED SUCCESSFULLY !"]);
	  return true;
	} catch (error) {
	  console.error(error);
	  return false;
	}
  }

async function Sale_Item_Table_Update(fyear, callback, tbl, d, db, saleid, transid) {
	const filter = { spiid: d['spiid'], spid: saleid };
	const update = {
		$set: {
		"netamt": parseFloat(d['netamt']), "tdisamt": parseFloat(d['tdisamt']), "itemid": d['itemid'], "batchno": d['batchno'],
		"qty": parseInt(d['qty']), "bonus": d['bonus'], "rate": parseFloat(d['rate']), "srate": parseFloat(d['srate']), "rate_a": parseFloat(d['rate_a']),
		"amt": parseFloat(d['amt']), "dis": parseFloat(d['dis']), "mrp": parseFloat(d['mrp']), "cgst": parseFloat(d['tax1amt']),
		}
	};
	
	try {
		const res = await db["sitm"].updateOne(filter, update);
		return true;
	} catch (err) {
		return false;
	}
}

 async function StkInsert(tbl, d, db, itemname, stockid, main) {
    if (main === false) {
        return { 'name': itemname, 'flag': false, 'info': "CHALLAN_SAVED", 'msg': "---" };
    } else {
        var row = { 'name': "itemname", 'flag': false, 'info': "stock insert", 'msg': "---" };
        try {
            var insert_Stk = {
                "stockid": stockid,
                "itemid": d['itemid'],
                "batchno": d['batchno'],
                "qty": parseInt(d['qty']),
                "expdate": d['expdate'],
            };

            await db['stk'].insertOne(insert_Stk);
            // Handle success if needed
        } catch (err) {
            console.log(err);
        }
    }
}

async function StkUpdate(tbl, d, db, itemname, main, infomsg = "N A") {
    try {
        const filter = { "stockid": d['stockid'], "itemid": d["itemid"] };
        const update = { "$inc": { "qty": d['qty'] } };

        const res = await db["stk"].updateOne(filter, update);
    } catch (err) {
        console.log(err);
    }
}

    
async function PANEL_PURCHASE_PROD(fyear, tblname, tbl, recdic, db, purcid, transid, main, callback){
	var grid = recdic['grid'] ;
	var ins_data = [];
	var upd_data = [];
	var stk_ins_data = [];
	var stk_upd_sale_data = [];
	var stk_upd_batch_data = [];
	var item_del_update = [];
	var err_items = [];
	var [iadd, iupdt, sno] = [0, 0, -1];
	var callbackBoolArr = [];
	inforow = [] ;	
	var idx = 0
	// console.log(grid);
	for (const [k, v] of Object.entries(grid)){

		if (v['itemid'] !="" && (v['qty'] !="" && v['qty'] !=0)){
			
			if(v['spiid'].length !== 0 ){ 
				upd_data = {'spid':purcid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'csid':v['csid'], 
				'itemid':v['itemid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],'srate':v['srate'],
				'rate_a':v['rate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netamt':v['netamt'],
				'spid':purcid,'spiid':v['spiid']};
				updatedqty = parseInt(v['tqty'])-parseInt(v['staticqty']); 

				if(typeof(v["tqty"])!=="undefined"){
					stk_upd_pur_data = {'qty':updatedqty,'dbstock':parseInt(v['dbstock']),'stockid':v['stockid'],'itemid':v['itemid'],};
					if (main){await StkUpdate(tbl, stk_upd_pur_data, db, v['name'], main);};
					const isItemUpdate = await Purchase_Item_Table_Update(fyear, v['name'], tbl, upd_data, db, purcid, transid, main, callback);
					callbackBoolArr.push(isItemUpdate);
				}
			}
			else{
				ins_data = {'spid':purcid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'csid':v['csid'], 
				'itemid':v['itemid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'], 'srate':v['srate'],
				'rate_a':v['rate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netamt':v['netamt'],};
				if (!v['stockarray'].length > 0){
					if (main){
						stk_ins_data = {'itemid':v['itemid'],'batchno':v['batchno'],'qty':parseInt(v['tqty']),'expdate':v['expdate'],};
									var InsertStockid = getUniqueId()+idx;
									idx += 1;
						await StkInsert(tbl, stk_ins_data, db, v['name'], InsertStockid, main);
						console.log(" find821 entered in StkInsert Stock Inserted");  
					};
				}
				else{	
					if (main){
						var stockid = "0";
						var stockdbqty = '0';
						var stk_ins_flag = true;
				
						if(typeof(v['stockarray']) != "undefined"){
							
							for(var i = 0; i < v['stockarray'].length; i++){

								if( v['stockarray'][i]['batchno'].trim() === v['batchno'].trim()){
									
									stockid = v['stockarray'][i]['stockid'];
									stockdbqty = v['stockarray'][i]['qty'];
									stk_ins_flag = false;
									break;
								}
							}
						
							stk_upd_pur_data = {'qty':parseInt(v['tqty']),'stockid':stockid, 'dbstock': parseInt(stockdbqty), 'itemid':v['itemid'],};
								if(stk_ins_flag){
									var InsertStockid = getUniqueId()+idx;
									idx += 1;
									await StkInsert(tbl, v, db, v['name'], InsertStockid, main)
								}
								else{await StkUpdate(tbl, stk_upd_pur_data, db, v['name'], main);}
						}else{
							idx += 1;
							var InsertStockid = getUniqueId()+idx;
							await StkInsert(tbl, v, db, v['name'], InsertStockid, main)
						}
					
					};// For main==true NOT FOR CHALLAN
				}
				
				const siteminfo = await Purchase_Item_Table_Insert(fyear, v['name'], tbl, ins_data, db, purcid, transid, main, callback);
				callbackBoolArr.push(siteminfo);
				
			}
			// console.log(callbackBoolArr);
			

		}
	}
	callback(callbackBoolArr);

	return inforow;
}


async function Purchase_Item_Table_Insert(fyear, itemname, tbl, d, db, purcid, transid, main, callback) {
    try {
        const spiid = new ObjectId().toString();
        const insert_purchase_itm = {
            "spiid": spiid,
            "spid": purcid,
            "netamt": parseFloat(d['netamt']),
            "tdisamt": parseFloat(d['tdisamt']),
            "csid": d['csid'],
            "itemid": d['itemid'],
            "batchno": d["bat"],
            "qty": parseInt(d['qty']),
            "bonus": d['bonus'],
            "rate": parseFloat(d['rate']),
            "srate": parseFloat(d['srate']),
            "rate_a": parseFloat(d['rate_a']),
            "amt": parseFloat(d['amt']),
            "dis": parseFloat(d['dis']),
            "mrp": parseFloat(d['mrp']),
            "cgst": parseFloat(d['tax1amt']),
        };

        let collection;
        if (main) {
            collection = "pitm";
        } else {
            collection = "pitmo";
        }

        const result = await db[collection].insertOne(insert_purchase_itm);

        if (result && result.insertedId) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        callback({ "success": false });
    }
}

async function Purchase_Item_Table_Update(fyear, itemname, tbl, d, db, purcid, transid, main, callback) {
	// netrate will store in purchase_inv column
	// tdisamt will store in bill_date column
	// cgst amount will store in exp_date column
	// amount will store in sale_price_b column
  
	const filter = { spiid: d['spiid'], spid: purcid };
	const update = {
	  $set: {
		"netamt": parseFloat(d['netamt']), "tdisamt": parseFloat(d['tdisamt']), "itemid": d['itemid'], "batchno": d['bat'],
		"qty": parseInt(d['qty']), "bonus": d['bonus'], "rate": parseFloat(d['rate']), "srate": parseFloat(d['srate']), "rate_a": parseFloat(d['rate_a']),
		"amt": parseFloat(d['amt']), "dis": parseFloat(d['dis']), "mrp": parseFloat(d['mrp']), "cgst": parseFloat(d['tax1amt']),
	  }
	};
  
	let table;
	if (main) {
	  table = "pitm";
	} else {
	  table = "pitmo";
	}
  
	try {
	  const res = await db[table].updateOne(filter, update);
	  return true;
	} catch (err) {
	  console.error(err);
	  return false;
	}
}
  

var SPINFO = async function (db, ledgid, transid, cs, sp, spitm, fyear) {
	try {
	  const partydetails = await db[cs].find({ "ledgid": ledgid }).limit(1).toArray();
	  const sprows = await db[sp].find({ "transid": transid, "ledgid": ledgid }).toArray();
	  const getSPID = sprows[0]["spid"];
  
	  for (var i = 0; i < sprows.length; i++) {
		for (const [k, v] of Object.entries(partydetails[0])) {
		  sprows[i][k] = v;
		}
		sprows[i]["invdate"] = sprows[i]["billdate"];
	  }
  
	  const spitems = await db[spitm].find({ "spid": getSPID }).toArray();
  
	  for (let j = 0; j < spitems.length; j++) {
		let itemid = spitems[j]["itemid"];
		let batchno = spitems[j]["batchno"];
		const itemrows = await db["itm"].find({ "itemid": itemid }).toArray();
  
		spitems[j]["name"] = itemrows[0]["name"];
		spitems[j]["pack"] = itemrows[0]["pack"];
		spitems[j]["unit"] = itemrows[0]["unit"];
		spitems[j]["staticqty"] = spitems[j]["qty"];
		spitems[j]["rate_a"] = "0.0";
		spitems[j]["gst"] = itemrows[0]["gst"];
		spitems[j]["hsn"] = itemrows[0]["hsn"];
		spitems[j]["sgst"] = spitems[j]["cgst"];
		spitems[j]["cgst"] = spitems[j]["cgst"];
		spitems[j]["prate"] = itemrows[0]["netrate"];
		var amttot = spitems[j]["amt"] - spitems[j]["tdisamt"];
		var cgstamt = spitems[j]["cgst"];
		var ttaxamt = cgstamt * 2;
		var netamt = amttot + ttaxamt;
		spitems[j]["amttot"] = amttot.toFixed(2);
		spitems[j]["ttaxamt"] = ttaxamt.toFixed(2);
		spitems[j]["netamt"] = netamt.toFixed(2);
		spitems[j]["netrate"] = (netamt / parseInt(spitems[j]["qty"])).toFixed(2);
		const stkrows = await db["stk"].find({ "itemid": itemid, "batchno": batchno }).toArray();
  
		if (stkrows.length > 0) {
		  spitems[j]["stockarray"] = stkrows;
		  spitems[j]["expdate"] = stkrows[0]['expdate'];
		  spitems[j]["stockid"] = stkrows[0]['stockid'];
		} else {
		  spitems[j]["stockarray"] = [{ "stockid": null, "expdate": "", "qty": "", "batchno": "" }];
		}
	  }
	  
	  return [sprows, spitems, []];
	} catch (error) {
	  console.error(error);
	  return [error, [], [], []];
	}
  };
	function GST_REPORT(db, ledgid, billas, itype, frm, tod, sp, typ, taxslab, fyear, callback){
		//itype >>> 1 == (Without GSTN/NON-Register Party)
		//itype >>> 2 == (HAS GSTN/Register Party)
		//itype >>> 8 == PURCHASE RETURN (* in DB transaction Table                                           f
		//itype >>> 9 == SALES RETURN (* in DB transaction Table                                         
		
		if (taxslab.length < 1){
			callback({})
			return ;
		  }
		var filter = {"ledgid":ledgid,"billdate":{"$gte":frm, "$lte":tod},"billas":{"$in":billas},"itype":{"$in":itype},};  
		if (ledgid.trim()===""){
			filter = {"billdate":{"$gte":frm, "$lte":tod},"billas":{"$in":billas},"itype":{"$in":itype},};
		}
		 
		var spitem = "sitm";
		var cscoll = "cust";
		if(sp==="purchase"){
			sp="pur"; 
		  spitem = "pitm";
		  cscoll = "sup";
		}
		let collobj = {};
		db[sp].find(filter).toArray().then(async function(spdata){
		  var partyname = "";
		  var gstn = "";
		  var stcode = "";
		  var spiid = "";
		  for(const spd of spdata) {
			//collobj[spd["billno"]]={"billno":spd["billno"],"ledgid":spd["ledgid"]};
			await db[cscoll].find({"ledgid":spd["ledgid"]}).toArray().then(async function(partydata){
			  partyname = partydata[0]["name"];
			  gstn=partydata[0]["gstn"];
			  stcode=partydata[0]["stcode"];
			})
			await db[spitem].find({"spid":spd["spid"]}).toArray().then(async function(spitemdata){
			  
			  for(const spitmd of spitemdata) {
				await db["itm"].find({"itemid":spitmd["itemid"],"gst":{"$in":taxslab}}).toArray().then(async function(itemdata){
				  if(itemdata.length>0){
				   
					collobj[spitmd["spiid"]]={"billno":spd["billno"],"billdate":spd["billdate"],"ledgid":spd["ledgid"],
											"name":partyname,"gstn":gstn, "stcode":stcode};
					collobj[spitmd["spiid"]]["itemname"]=itemdata[0]["name"];
					collobj[spitmd["spiid"]]["gst"]=itemdata[0]["gst"];
					collobj[spitmd["spiid"]]["cgst"]=spitmd["cgst"];
					collobj[spitmd["spiid"]]["sgst"]=spitmd["cgst"];
					collobj[spitmd["spiid"]]["qty"]=spitmd["qty"];
					collobj[spitmd["spiid"]]["netamt"]=spitmd["netamt"];
					collobj[spitmd["spiid"]]["amt"]=spitmd["amt"];
					collobj[spitmd["spiid"]]["tdisamt"]=spitmd["tdisamt"];
				 }
				}) 
			  } // second for loop end
				
			})
		  } // first for loop end
		  await callback(collobj);
		})  
	  }
	  
	  
module.exports.add_to_db = add_to_db;
module.exports.csfind_by_name = csfind_by_name; 
module.exports.ledger_n_tax_search = ledger_n_tax_search;
module.exports.csfinalbill = csfinalbill;
module.exports.SPINFO = SPINFO ;
module.exports.GST_REPORT = GST_REPORT ;



