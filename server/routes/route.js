const express = require('express');
const router = express.Router();

const Factory = require('../models/Factory.js');

router.get('/', async (req, res) => {
  res.json("welcome");
});

router.get('/factory/:token0/:token1', async (req, res) => {
    
  try {
    var token0 = req.params.token0;
    var token1 = req.params.token1;

    console.log(token0);console.log(token1);
    var fact = await Factory.findOne({token0: token0, token1: token1}).collation( { locale: 'en', strength: 2 } );

    console.log(fact);
    if (fact) {
      res.status(200).json({success: 1, token: ""});
      return;
    }else {

      fact1 = await Factory.find({token0: token0}).collation( { locale: 'en', strength: 2 } );
      fact2 = await Factory.find({token1: token1}).collation( { locale: 'en', strength: 2 } );

      for (var i = 0; i < fact1.length; i++) {
        for (var j = 0; j < fact2.length; j++) {
          if (fact1[i].token1 == fact2[j].token0) {
            res.status(200).json({success: 1, token: fact1[i].token1});
            return;
          }
        }
      }
    }
    res.status(400).json({success: 0});
  }catch(err) {
      res.json("db error");
  }
});

module.exports = router;