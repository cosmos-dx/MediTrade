const fs = require('fs');
const multer = require('multer');
const mlog = require('./userlogin');
const { join } = require('path');
const qry = require('./qrystore');
const { log } = require('console');
const axios = require('axios');
const ReadText = require('text-from-image')
var ObjectId = require('mongodb').ObjectId;
const app = mlog.app ;
const upload = mlog.upload;
app.set('views',__dirname + '/vws');

app.get('/nearestShops',async function(req,res){ 
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    if(!latitude || !longitude){
        res.json({"error": "Provide Latitude and Longitude"});
    }
    let nearestShop;
    try {
        const connectDb = await mlog.MemberConnect();
        nearestShop = await connectDb.collection("members").aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude], 
                    },
                    distanceField: 'distance',
                    spherical: true,
                },
            },
            {
                $match: {
                    distance: { $lte: 10000 } 
                }
            },
            { $limit: 10 },
        ]).toArray();
    } catch (error) {
        console.log(error);
        res.json({"error": "Internal Error"});
    }
        const data = nearestShop.map((index) => {
            return {
            "name": index.name,
            "lastname": index.lastname,
            "phone": index.phone,
            "shopName" : index.shopName,
            "GSTnumber": index.GSTnumber,
            "district" :index.district,
            "locality": index.locality,
            "address" : index.address,
            "location": index.location['coordinates']
            }
        })
        res.json({"success": data})
});

app.post('/searchMedicine',async (req,res) => { 
    // console.log(req.body);
    let username = req.body.shopOwnerData.username;
    let phone = req.body.shopOwnerData.phone;
    let dbname = username+"_"+phone+"_"+username;
    let searchMethod = req.body.searchMethod;
    let searchValue = req.body.searchValue.toUpperCase();
    let tclc_db = mlog.MongoConnect(dbname);
    var tclc = tclc_db[0];
    var mgodb = tclc_db[1];
    var client = tclc_db[2];
    let data;
    if(searchMethod == "name"){
         data = await tclc["itm"].find({"name": new RegExp("^" + searchValue, "i")}).limit(5).toArray();
    }
    else{       
         data = await tclc["itm"].find({"igroup": new RegExp("^" + searchValue, "i")}).limit(5).toArray();
    }
    
    const searchedData = []; 
    data.forEach(item => {
        const perProduct = {
            name: item['name'],
            pack: item['pack'],
            mrp: item['mrp'],
            gst: item['gst'],
            salt: item['igroup'],
            _id: item["_id"]
        };
        searchedData.push(perProduct);
    });

    res.json({"success" : searchedData});
});
