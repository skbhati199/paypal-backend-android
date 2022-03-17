var express = require('express');
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "ggcpcj7nyhhwpkqg",
    publicKey: "vsvf6cmzvsmmghjc",
    privateKey: "dded365087fd8f2dfc3f01a4c37acdc9"
});
var router = express.Router();

/* GET users listing. */
router.get('/client_token', function (req, res, next) {
    gateway.clientToken.generate({}, (err, response) => {
        res.send("{\"client_token\":\"" + response.clientToken + "\"}");
    });
});


/* GET users listing. */
router.post('/checkout', function (req, res, next) {
    const nonceFromTheClient = req.body.payment_method_nonce;
    const merchantAccountId = req.body.merchantAccountId;
    const requireThreeDSecure = req.body.requireThreeDSecure;

    let threeDSecureObj = {};

    if(requireThreeDSecure == "true"){
        threeDSecureObj = {
            required: requireThreeDSecure
        };   
    } else {
        threeDSecureObj = undefined
    }

    gateway.transaction.sale({
        amount: "10.00",
        merchantAccountId: merchantAccountId,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            threeDSecure: threeDSecureObj,
            submitForSettlement: true
        }
    }, (err, result) => {
        if (result.success) {
            res.send(JSON.stringify(result));
        } else {
            res.send(JSON.stringify("{message: " + "error occured" + err + "}"));
        }

    });
});

module.exports = router;
