const { Validator } = require('node-input-validator');
const { resCallback } = require('../utils/helper');

exports.validateInput = function(callback, params, rules) {
    const v = new Validator(params, rules);
     v.check().then(function (passed) {
        if(passed == false) {
               console.log(v.errors)
             return resCallback(403, {
                  errors: v.errors
             }, callback);
        }
    });
}