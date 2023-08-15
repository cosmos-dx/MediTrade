
# MediTrade - GST Inventory for Medical Shop Owners

MediTrade is a web-based platform designed for medical shop owners, enabling them to efficiently manage their medicine-related operations. The platform offers tools for handling GST-enabled sales, purchases, and inventory management. Built using React, it provides an intuitive interface for medical store owners to input and track details of medicines, monitor stock levels, and record sales and purchases. Additionally, MediTrade integrates GST segments, ensuring accurate tax calculations. This platform simplifies the daily tasks of medical shop owners, aiding in better inventory control, compliance with tax regulations, and informed decision-making.



## Key Features

1. GST Management : User can efficiently manage taxation and can monitor GST for Sales and Purchase of products.
2. Multiple Features : MediTrade offers shop owners a versatile range of features, including product management, rack organization, supplier and customer details, customizable bill printing, and profile management with potential future enhancements.
3. MERN Stack : Created on MERN stack with fast and efficient access to user.

## Getting Started
To get started with the project, you need to have the NodeJS and MongoDB installed on your machine. You can follow the instructions on the NodeJS/MongoDB website to download and install.

To run the project, follow these steps:

Clone the repository to your local machine. 
```
git clone https://github.com/cosmos-dx/Meditrade
```
Open a terminal window and navigate to the project directory. Run
```
npm i 
```
to install all packages and then Run
```
node ser1.js 
```
That's it now you can see server running.


## NOTE

In the __"public"__ folder, you'll find a __"dist"__ directory containing the built version of the frontend. If you're focusing on backend changes, there's no need for concern. However, for frontend modifications, follow the listed instructions.

 Open File model/userlogin.js here on entry route.
```
app.get('/',(req,res) => { 
//...
let parentDirectory = Path.dirname(__dirname);
  res.sendFile(Path.join(parentDirectory + '/public/rms_nodjs/index.html'))  // <<<--- here comment out this line or send any hello msg in json.
});
```
and delete "dist" directory.

Now to work on __FrontEnd__ part seperately.

You can access the FRONTEND 
Git link here: https://github.com/cosmos-dx/MediTrade-frontEnd



## Contribution Guidelines

We welcome contributions! If you'd like to contribute to MediTrade, please follow our [environment](https://github.com/cosmos-dx/MediTrade/blob/main/Contribution%20guidelines.md)
We believe multiple brains can lead us to a better results.



## Bug Reports and Feedback

If you encounter any issues or have feedback, please [open an issue](https://github.com/cosmos-dx/MediTrade/issues) so we can address it promptly and you can add a PR or can contact me at abhishekgupta0118@gmail.com

## Issues Need Contribution to Fix

1. We need to fix the database collections and database logic.
2. We require to optimise database queries.
3. We want to remove redundancy from server codes.
4. Have to secure the APIs. 


## Future Vision

In our Future Vision section, we aspire to integrate MediTrade with __NearMed__, a pioneering platform. NearMed empowers end-users to effortlessly compare medicine prices from nearby stores and make purchases. Leveraging Meditrade's stored store locations, users can explore medicine availability in proximity to their location. Additionally, the platform facilitates users in sending medicine purchase requests directly to shop owners via the admin panel. This synergistic integration aims to enhance user convenience and bridge the gap between medical store owners and their customers.

___We Need Contribution !!!___


##   

#### _Disclaimer_ : 
MediTrade is a work in progress and should not be used for sensitive data without thorough review and testing.

