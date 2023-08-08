
# Contribution Guidelines

Here is a quick info about our working environment.

1. Our all calculation handler and the one which communicates between server and client that middleware is a complicated and nested giant.

Let's welcome him.

```
{
  "info": "MediTrade-Soft",
  "alert": "",
  "title": "",
  "htmlheaderdp": "",
  "pathinfo": "",
  "updatemediregister": false,
  "mediregister": "",
  "getsdc": "",
  "csinfo": {
    "c": "",
    "s": "",
    "sdc": 1,
    "sdcinfo": "Pharma Distribution"
  },
  "dbfname": "",
  "loginpage": "/",
  "homepage": "",
  "recdic": {
    "pan": {
      "spid": 0,
      "transid": 0,
      "csid": 0,
      "ledgid": 0,
      "billas": "M",
      "itype": 1,
      "bal": 0,
      "name": "",
      "partyname": "",
      "add1": "",
      "add2": "",
      "add3": "",
      "stcode": "0",
      "pincode": 0,
      "area": "",
      "phone": 0,
      "email": 0,
      "ophone": 0,
      "pan": 0,
      "regn": 0,
      "gstn": "",
      "cmnt": "",
      "mode": 0,
      "esti": 0,
      "dbcscr": 1,
      "cscr": "CASH",
      "billdate": "2023-08-08",
      "invoicedate": "2023-08-08",
      "invdate": "2023-08-08",
      "dbbilldate": "2023-08-08",
      "dbinvdate": "2023-08-08",
      "fyear": 0,
      "ddisc": 0,
      "dis": 0,
      "billno": 0,
      "prolo": 0,
      "roundoff": 0,
      "gtotwords": 0,
      "taxamt1": 0,
      "taxamt2": 0,
      "sgst": 0,
      "cgst": 0,
      "tdisamt": 0,
      "ttaxamt": 0,
      "tamt": 0,
      "ttaxable": 0,
      "tsubtot": 0,
      "rgtot": 0,
      "gtot": 0,
      "acentries": false,
      "pexpense": 0,
      "updtval": 0
    },
    "grid": {
      "0": {
        "sno": 0,
        "spiid": "",
        "spid": "",
        "csid": "0",
        "itemid": "",
        "name": "",
        "pack": "",
        "unit": "",
        "hsn": "",
        "compid": "",
        "igroup": "",
        "irack": "",
        "qty": 0,
        "tqty": 0,
        "bbool": false,
        "edited": false,
        "batreplace": false,
        "stockid": null,
        "dbstock": 0,
        "dbbatchstock": 0,
        "expdate": "",
        "dbbatchno": "",
        "totstk": 0,
        "stockarray": [],
        "batchno": "",
        "bonus": "",
        "cgst": 0,
        "sgst": 0,
        "gst": 0,
        "igst": 0,
        "tax1": 0,
        "tax2": 0,
        "tax": 0,
        "bonus": "",
        "dis": 0,
        "mrp": "",
        "prate": 0,
        "srate": 0,
        "rate_a": "0",
        "rate": 0,
        "tax": 0,
        "ttax": 0,
        "amttot": 0,
        "amt": 0,
        "batchno": "",
        "ttaxamt": 0,
        "tdisamt": 0,
        "tax1amt": 0,
        "tax2amt": 0,
        "multibat": false,
        "netrate": 0,
        "netamt": 0,
        "updatedqty": 0,
        "pnet": 0
      }
    },
    "ac": {
      "acname1": "",
      "acname2": "",
      "acname3": "",
      "acid1": 0,
      "acid2": 0,
      "acid3": 0,
      "acval1": 0,
      "acval2": 0,
      "acval3": 0
    },
    "static": {},
    "edit": false,
    "other": {},
    "itemtemplate": {
      "sno": 0,
      "spiid": "",
      "spid": "",
      "csid": "0",
      "itemid": "",
      "name": "",
      "pack": "",
      "unit": "",
      "hsn": "",
      "compid": "",
      "igroup": "",
      "irack": "",
      "qty": 0,
      "tqty": 0,
      "bbool": false,
      "edited": false,
      "batreplace": false,
      "stockid": null,
      "dbstock": 0,
      "dbbatchstock": 0,
      "expdate": "",
      "dbbatchno": "",
      "totstk": 0,
      "stockarray": [],
      "batchno": "",
      "bonus": "",
      "cgst": 0,
      "sgst": 0,
      "gst": 0,
      "igst": 0,
      "tax1": 0,
      "tax2": 0,
      "tax": 0,
      "bonus": "",
      "dis": 0,
      "mrp": "",
      "prate": 0,
      "srate": 0,
      "rate_a": "0",
      "rate": 0,
      "tax": 0,
      "ttax": 0,
      "amttot": 0,
      "amt": 0,
      "batchno": "",
      "ttaxamt": 0,
      "tdisamt": 0,
      "tax1amt": 0,
      "tax2amt": 0,
      "multibat": false,
      "netrate": 0,
      "netamt": 0,
      "updatedqty": 0,
      "pnet": 0
    },
    "pantemplate": {
      "spid": 0,
      "transid": 0,
      "csid": 0,
      "ledgid": 0,
      "billas": "M",
      "itype": 1,
      "bal": 0,
      "name": "",
      "partyname": "",
      "add1": "",
      "add2": "",
      "add3": "",
      "stcode": "0",
      "pincode": 0,
      "area": "",
      "phone": 0,
      "email": 0,
      "ophone": 0,
      "pan": 0,
      "regn": 0,
      "gstn": "",
      "cmnt": "",
      "mode": 0,
      "esti": 0,
      "dbcscr": 1,
      "cscr": "CASH",
      "billdate": "2023-08-08",
      "invoicedate": "2023-08-08",
      "invdate": "2023-08-08",
      "dbbilldate": "2023-08-08",
      "dbinvdate": "2023-08-08",
      "fyear": 0,
      "ddisc": 0,
      "dis": 0,
      "billno": 0,
      "prolo": 0,
      "roundoff": 0,
      "gtotwords": 0,
      "taxamt1": 0,
      "taxamt2": 0,
      "sgst": 0,
      "cgst": 0,
      "tdisamt": 0,
      "ttaxamt": 0,
      "tamt": 0,
      "ttaxable": 0,
      "tsubtot": 0,
      "rgtot": 0,
      "gtot": 0,
      "acentries": false,
      "pexpense": 0,
      "updtval": 0
    }
  },
  "daterow": null,
  "daterange": [],
  "owner": {
    "o": "own",
    "cal": null,
    "oth": "",
    "ownername": "",
    "ownerstatic": "",
    "ownervar": ""
  },
  "uqpath": {
    "dbdir": null,
    "odb": null,
    "usersettingspath": null,
    "dbfname": null
  },
  "estidict": {
    "e": "E",
    "E": "E",
    "m": "M",
    "M": "M",
    "": "M",
    "undefined": "M",
    " ": "M"
  },
  "dbcscr": {
    "CASH": "1",
    "CREDIT": "2",
    "CHALLAN": "3",
    "ORDER": "4",
    "": "1",
    "0": "1"
  },
  "cscr": {
    "1": "CASH",
    "2": "CREDIT",
    "3": "CHALLAN",
    "4": "ORDER",
    "0": "",
    "": ""
  },
  "fyear": 0,
  "sfyear": null
}
```

2. This is named as rscr in our program (Resource).
3. Inside this a object lies that is recdic (record dictionary). inside this the main guys are grid and pan. 
4. Pan is for updating final values after calculations and for handeling Supplier and Customer (for a shop owner) detials.
5. Grid handels items detials. 
6. Backend calcualtes data and send that information in this format and vice-versa.

7. /model/mainsp file was rending the pages initially when this app was on ejs.
8. /model/dbsearch handles database requests.
9. /model/qrystore is file for all db queries.
10. /model/medifun handles our middleware.




## Appendix

Variables and its information.

1. rscr - resource (Handle Middleware).
2. cinfo - customer info. (currently this is not being used much).
3. sinfo - supplier info. (currently this is not being used much).
4. recdic - record dictionary (object) Handles grid and pan.
5. cscr - CASH CREDIT 
6. cscr[1]- CASH
7. csrc[2]- CREDIT
8. cscr[3]- CHALLAN
9. estidict- Estimation dictionary (Handle Bill types)
10. spid - sale purchase id
11. transid - transaction id
12. cs - refers to customer and supplier everywhere
13. itype - transaction types
14. gtot - grand total
15. fyear - financial year


## What you can help us initially !

1. You can help us by helping us to secure our routes. if(done)
2. You are allowed and welcome for optimizing queries. if(done)
3. We will together think for fixing a huge db issue. if(done).finally(
4. Let's see if we need to switch technology or not. )

## Thanks for Reading 
