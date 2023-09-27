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

// app.post('/chatbot', mlog.upload.single('reportfiles'), async function (req, res) {
//     // const {filename} = req.body;
//     console.log(req.body);
//     // const imageFile = req.file;
//     // newFilename = `${filename}.jpg`;
//     // fs.renameSync(imageFile.path, `public/uploads/reportfiles/${newFilename}`);
//     // try {
        
//     //     // ReadText('./image.png').then(text => {
//     //     //     console.log(text);
//     //     // }).catch(err => {
//     //     //     console.log(err);
//     //     // })
//     //   const requestData = req.body;
//     //   const externalApiResponse = await axios.post('https://medicalgpt.online/data', requestData);
//     //   const responseData = externalApiResponse.data;
  
//     //   res.status(200).json(responseData);
//     // } catch (error) {
//     //   console.error(error);
//     //   res.status(500).json({ error: 'Internal server error' });
//     // }
//   });
  