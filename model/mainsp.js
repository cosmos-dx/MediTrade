
const medilogin = require('./userlogin');


const app = medilogin.app ;
app.set('views',__dirname + '/vws');

//var rscr = medilogin.rscr ;

var updict ={};

function CommonRender(res, rscr, getid){
    if (typeof(rscr) === 'undefined'){
        res.redirect('/medilogin');
        return false;
    }

    if (getid === 'undefined'){
        res.redirect('/medilogin');
        return false;
    }
    if (getid == 'medihome'){
        rscr['title']="MediTrade-Home";
        rscr['cssearch']="";
        rscr['cs']="";
        rscr["recdic"]["edit"]=false;
        res.render('medipages/medihome', {spinfo: rscr})
    }
    if (getid == 'logout'){
        rscr['title']="MediTrade-Login";
        rscr['cssearch']="";
        rscr['cs']="";
        res.redirect('/medilogin');
    }
    if (getid == 'purchase'){
        rscr['title']="MediTec-Purchase";
        rscr['cssearch']="purchase";
        rscr['cs']="supplier";
        rscr["recdic"]["edit"]=false;
        res.render('medipages/spmaster', {spinfo: rscr, 'prows':{}, 'itemrows':{}, 'acrows':{} ,'spedit': false});
    }
    if (getid == 'sales'){
        rscr['title']="MediTec-Sale";
        rscr['cssearch']="sale";
        rscr['cs']="customer";
        rscr["recdic"]["edit"]=false;
        res.render('medipages/spmaster', {spinfo: rscr, 'prows':{}, 'itemrows':{}, 'acrows':{} , 'spedit': false});
    }
    if (getid == 'spurchase'){
        rscr['title']="MediTec-Purchase Search";
        rscr['cssearch']="purchase";
        rscr['cs']="supplier";
        res.render('medipages/spsearch', {spinfo: rscr,  'prows':{}, 'itemrows':{}, 'acrows':{} ,'spedit':true});
    }
    if (getid == 'ssales'){
        rscr['title']="MediTec-Sale Search";
        rscr['cssearch']="sale";
        rscr['cs']="customer";
        res.render('medipages/spsearch', {spinfo: rscr,  'prows':{}, 'itemrows':{}, 'acrows':{} , 'spedit':true});
    }
    if (getid == 'addcustomer'){
        rscr['title']="MediTec-AddCustomer";
        rscr['cssearch']="addcustomer";
        rscr['cs']="customer";
        res.render('medipages/addp', {spinfo: rscr});
    }
    if (getid == 'addsupplier'){
        rscr['title']="MediTec-AddSupplier";
        rscr['cssearch']="addsupplier";
        rscr['cs']="supplier";
        res.render('medipages/addp', {spinfo: rscr});
    }
    if (getid == 'additem'){
        rscr['title']="MediTec-AddItem";
        rscr['cssearch']="additem";
        rscr['cs']="items";
        res.render('medipages/addp', {spinfo: rscr});
    }
    if (getid == 'cashledger'){
        rscr['title']="MediTec-Cash Ledger";
        rscr['cssearch']="CASH";
        rscr['cs']="cashledger";
        res.render('medipages/searchledger', {spinfo: rscr});
    }
    if (getid == 'saleledger'){
        rscr['title']="MediTec-Customer's Ledger";
        rscr['cssearch']="CUSTOMER";
        rscr['cs']="saleledger";
        res.render('medipages/searchledger', {spinfo: rscr});
    }
    if (getid == 'purchaseledger'){
        rscr['title']="MediTec-Supplier's Ledger";
        rscr['cssearch']="SUPPLIER";
        rscr['cs']="purchaseledger";
        res.render('medipages/searchledger', {spinfo: rscr});
    }
    

    if (getid == 'gstsummary'){
        rscr['title']="MediTec-GST SUMMARY";
        rscr['cssearch']="GSTSUMMARY";
        rscr['cs']="gstsummary";
        res.render('medipages/searchledger', {spinfo: rscr});
    }

    if (getid == 'companystock'){
        rscr['title']="MediTec-COMP STOCK ADJUST";
        rscr['cssearch']="COMPANY";
        rscr['cs']="companystock";
        res.render('medipages/searchledger', {spinfo: rscr});
    }

    if(getid == 'userinfo'){
        res.render('medipages/user-info',{spinfo : rscr['userinfo'], update :" "});
    }

    if(getid == 'bankinfo'){
        res.render('medipages/bank-info',{spinfo : rscr['bankinfo'], update :" "}); 
    }

    if(getid == 'seriesinfo'){ 
        res.render('medipages/billseries-info',{spinfo : rscr['billseriesinfo']['bill'], update: " "});
    }

}

app.get('/medinav', function(req, res){
    CommonRender(res, req.session.rscr, req.query.id);
})

app.post('/medinav', function(req, res) {
    CommonRender(res, req.session.rscr, req.body.name);
  });

app.post('/itemtable', function(req, res){ // <<< could be use, good example 
    res.status(204).json({success : {'phone':'asdasd',  'status':204}, status : 204});
});



module.exports.app = app