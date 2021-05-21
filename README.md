> Swydo is no longer using `cheddar` and will no longer maintain this package. If you'd like to adopt this package please let us know!


## Node.js Cheddar API wrapper
This module will simplify the process of integrating [Cheddar](https://www.getcheddar.com/) into your existing node.js apps.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Implemented methods](#implemented-methods)
- [Using a proxy](#using-a-proxy)
- [Running tests](#running-tests)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```
npm install cheddar
```

Also install the peer dependencies:

```
npm install request
```

# Basic usage
```javascript
import Cheddar from 'cheddar';

const cheddar = new Cheddar({
  username: "email@example.com",
  password: "passwordExample",
  productCode: "PRODUCT_CODE",
});

cheddar.getPlans()
  .then(plans => console.log(plans))
  .catch(err => console.error(err));

// When inside an async function, you can simply await any Cheddar function
const plans = await cheddar.getPlans();
```

Or using ES5:

```javascript
var Cheddar = require("cheddar");

var cheddar = new Cheddar({
  username: "email@example.com",
  password: "passwordExample",
  productCode: "PRODUCT_CODE",
});

cheddar.getPlans()
  .then(function (plans) { console.log(plans); })
  .catch(function (err) { console.error(err); });
```

# Implemented methods

* `getPlans()`
* `getPlan(planCode)`
* `getCustomers([query])`
* `getCustomer(customerCode)`
* `searchCustomers([query])`
* `createCustomer(customerData)`
* `editCustomerAndSubscription(customerData)`
* `editCustomer(customerCode, customerData)`
* `editSubscription(customerCode, customerData)`
* `deleteCustomer(customerCode)`
* `cancelSubscription(customerCode)`
* `addItem(customerCode, itemCode, [amount])`
* `removeItem(customerCode, itemCode, [amount])`
* `setItemQuantity(customerCode, itemCode, amount)`
* `addCustomCharge(customerCode, chargeCode, quantity, amount, description)`
* `deleteCustomCharge(customerCode, chargeId)`
* `resendInvoiceEmail(idOrNumber)`
* `oneTimeInvoice(customerCode, invoiceData)`
* `getPromotions([query])`
* `getPromotion(promotionCode)`

All methods return a promise with the requested data in JSON format.

# Using a proxy

You might want to set up a proxy to communicate with Cheddar. Cheddar blocks most of the Heroku servers (a range of AWS IPs):

> Recently, a large block of IPs on the Heroku platform were listed by DenyHosts due to a spike in SSH brute force attacks coming from the Heroku platform. In short, you need to be coming from an IP that isn't listed.

A proxy url is easily set with the `CHEDDAR_PROXY_URL` environment variable:

```
CHEDDAR_PROXY_URL=https://example.com:1234 node your-server.js
```

# Running tests
First add a config file (`config.json`) with all your Cheddar credentials:

```javascript
{
  "username": "EMAIL",
  "password": "PASSWORD",
  // User either productCode OR productId
  "productCode": "PRODUCTCODE",
  "productId": "PRODUCTID",
  "planCode": "PLANCODE",
  "itemCode": "ITEMCODE",
  "promoCode": "PROMOCODE"
}
```

Now you can install all dependencies and run the tests:

```
npm install
npm test
```

> **WARNING:** Only run the tests on a development account to prevent any side effects in production

> **NOTE**: Not all API calls have been fully tested yet.

# Credits
Original work was done by [Kevin Smith](https://github.com/respectTheCode).
