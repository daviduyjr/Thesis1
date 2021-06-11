const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const adminController = require('../../controller/admin/admin.controller');
const adminCategoryController = require('../../controller/admin/products/addCategory');
const adminDistributorController = require('../../controller/admin/products/distributor');
const adminProductController = require('../../controller/admin/products/product');
const inventoryController = require('../../controller/inventory/ReceivingOrder');
const customerController = require('../../controller/admin/POS/customer');
const securityPOS = require('../../controller/admin/POS/security');
const transaction = require('../../controller/admin/POS/transaction');
const passportSignIn = passport.authenticate('login', { session: false });

router.route('/profile').get(passportSignIn, adminController.profile);

router.get('/usersList', passportSignIn, adminController.usersList);

router.post('/register', passportSignIn, adminController.grantAccess('createAny', 'profile'), adminController.register);
// router.post('/register', adminController.register);

router.put(
  '/updateUsersProfile',
  passport.authenticate('login', { session: false }),
  adminController.grantAccess('updateAny', 'profile'),
  adminController.updateUsersProfile
);

router.get('/newUser/', passportSignIn, adminController.usersProfile);

///para sa category

router.get('/categoryList', passportSignIn, adminCategoryController.categoryList);

// router.post('/addCategory', passportSignIn, adminController.grantAccess('createAny', 'category'), adminCategoryController.addCategory);
router.post('/addCategory', adminCategoryController.addCategory);

router.put('/updateCategoryName', passportSignIn, adminController.grantAccess('updateAny', 'category'), adminCategoryController.updateCategoryName);

///para sa distributors
router.get('/distributorList', passportSignIn, adminController.grantAccess('readAny', 'distributor'), adminDistributorController.distributorList);

router.post('/addDistributor', passportSignIn, adminController.grantAccess('createAny', 'distributor'), adminDistributorController.addDistributor);

router.put(
  '/updateDistributor',
  passportSignIn,
  adminController.grantAccess('updateAny', 'distributor'),
  adminDistributorController.updateDistributor
);

/// para sa productDetails
router.post('/addProduct', passportSignIn, adminController.grantAccess('createAny', 'products'), adminProductController.addProduct);

router.get('/productList', passportSignIn, adminController.grantAccess('readAny', 'products'), adminProductController.productList);
//passportSignIn, adminController.grantAccess('readAny', 'products'),
router.get('/productListPOS', adminProductController.productListPOS);

// para sa product inventory

router.get('/productInventory', passportSignIn, adminProductController.productInventory);

// para sa receiving order
router.post('/addRecievingOrder', passportSignIn, inventoryController.addRecievingOrder);

router.get('/getReceivingOrderList', passportSignIn, inventoryController.getReceivingOrderList);

//para sa customer
router.get('/customerList', customerController.CustomerList);
router.post('/addCustomer', customerController.AddCustomer);

//para sa security sa POS
router.post('/posSecurity', securityPOS.checkIfAdmin);

//para sa POS
router.post('/payment', transaction.payment);
module.exports = router;
