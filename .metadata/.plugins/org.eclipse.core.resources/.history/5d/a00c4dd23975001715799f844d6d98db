/**
 * 
 */

var express = require('express')
var router = express.Router()
var overallController = require('../controllers/overall.server.controller')
router.get('/', overallController.index)
router.get('/index/getSelecter', overallController.getSelecter)
router.get('/index/overall/getTable', overallController.getoverallTable)
router.get('/index/overall/getBar', overallController.getBar)
router.get('/index/overall/getPie', overallController.getPie)

var individualController = require('../controllers/individual.server.controller')
router.get('/index/individual/pullUpdate', individualController.pullUpdate)
router.get('/index/individual/getTable', individualController.getTable)
router.get('/index/individual/getBar', individualController.getBar)
router.get('/index/individual/getPie', individualController.getPie)
router.get('/index/individual/getUserChart', individualController.getUserChart)
module.exports = router