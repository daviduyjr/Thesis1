const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const adminController = require('../../controller/admin/admin.controller');
const adminCategoryController = require('../../controller/admin/products/addCategory');
const adminDistributorController = require('../../controller/admin/products/distributor');
const adminProductController = require('../../controller/admin/products/product');
const inventoryController = require('../../controller/inventory/ReceivingOrder');

const passportSignIn = passport.authenticate('login', { session: false });

router.route('/profile').get(passportSignIn, adminController.profile);

router.get('/usersList', passportSignIn, adminController.usersList);

router.post(
  '/register',
  passportSignIn,
  adminController.grantAccess('createAny', 'profile'),
  adminController.register
);
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

router.put(
  '/updateCategoryName',
  passportSignIn,
  adminController.grantAccess('updateAny', 'category'),
  adminCategoryController.updateCategoryName
);

///para sa distributors
router.get('/distributorList', passportSignIn, adminDistributorController.distributorList);

router.post('/addDistributor', passportSignIn, adminDistributorController.addDistributor);

router.put('/updateDistributor', adminDistributorController.updateDistributor);

/// para sa productDetails
router.post('/addProduct', adminProductController.addProduct);

router.get('/productList', adminProductController.productList);

// para sa product inventory

router.get('/productInventory', adminProductController.productInventory);

// para sa receiving order
router.post('/addRecievingOrder', inventoryController.addRecievingOrder);

router.get('/getReceivingOrderList', inventoryController.getReceivingOrderList);

module.exports = router;
