var express = require('express');
var router = express.Router();

/* GET Offers */
router.get('/offers', function(req, res) {
  var db = req.db;
  db.collection('offers').find().toArray(function(err, items) {
    res.json(items);
  });
});

/* PUT- Update Offer */
router.put('/offers/:id', function(req, res) {
  var db = req.db;
  var oid = req.params.id;
  var offer = req.body;
  delete offer._id;
  db.collection('offers').update({offer_id: oid}, offer, {strict: true}, function(e, result) {
    if (e) {
      console.log(e);
      return next(e);
    }
    res.send((result === 1) ? {
      msg: 'Changes Saved.'
    } : {
      msg: 'Error : Multiple offers were affected. Data is likely corrupted now. :-('
    })
  })
});

router.delete('/offers/:id', function(req, res) {
  var db = req.db;
  var oid = req.params.id;
  var offer = req.body;
  delete offer._id;
  db.collection('offers').remove({offer_id: oid}, function(e, result) {
    if (e) {
      console.log(e);
      return next(e);
    }
    res.send((result === 1) ? {
      msg: 'Deleted.'
    } : {
      msg: 'Error : Multiple offers were affected. Data is likely corrupted now. :-('
    })
  })
});

/* PUT- Update Offer */
router.post('/offers', function(req, res) {
  var db = req.db;
  var offer = req.body;
  delete offer._id;
  db.collection('offers').insert(offer, {strict: true}, function(e, result) {
    if (e) {
      console.log(e);
      return next(e);
    }
    res.send({
      msg: 'Created successfully.'
    })
  })
});



module.exports = router;
