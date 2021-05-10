var express = require('express');
const app = express();
const path = require("path");
const Razorpay = require("razorpay");
const cors = require('cors');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('./config');
/**
 * set uplocals
 */
 app.locals.currentOrderId = null;


/**
 * setup express
 */
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());


var instance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});
 

app.get("/", (req, res) => {
  res.send("Hello from express");
});

app.post("/orders", (req, res) => {
  console.log('body : ', req.body);
  instance.orders.create(req.body, function (err, order) {
    console.log(order);
    app.locals.currentOrderId = order.id;
    res.send(order);
  });
});

app.post('/verifySignature', (req , res)=>{
  var paymentData = req.body;
  const digest = crypto.createHmac('sha256',RAZORPAY_KEY_SECRET)
                 .update(`${app.locals.currentOrderId}|${paymentData.paymentId}`)
                 .digest('hex') ;
    
    if(digest === paymentData.razorSignature)
    {
      // save to backend db
      require('fs').writeFileSync('payments.json', JSON.stringify(paymentData,null,4));
      return res.send({success:true});
    } else {
      res.send({success:false});
    }

});

app.post('/verificationHook', (req, res) => {
	const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
              // save to backend db
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
	}
	res.json({ status: 'ok' })
})

app.listen(4000 , () => console.log('app running on port 4000') )