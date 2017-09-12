<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Goals and Status](#goals-and-status)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Using a proxy](#using-a-proxy)
- [Running tests](#running-tests)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Goals and Status

This module will simplify the process of integrating [Cheddar](https://www.getcheddar.com/) into your existing node.js apps.

* `getAllPricingPlans()`
* `getPricingPlan(planCode)`
* `getAllCustomers([searchParams])`
* `getCustomer(customerCode)`
* `createCustomer(customerData)`
* `editCustomerAndSubscription(customerData)` or `updateCustomerAndSubscription(customerData)`
* `editCustomer(customerCode, customerData)` or `updateCustomer(customerCode, customerData)`
* `editSubscription(customerCode, customerData)` or `updateSubscription(customerCode, customerData)`
* `deleteCustomer(customerCode)`
* `cancelSubscription(customerCode)`
* `addItem(customerCode, itemCode, [amount])`
* `removeItem(customerCode, itemCode, [amount])`
* `setItemQuantity(customerCode, itemCode, amount)`
* `addCustomCharge(customerCode, chargeCode, quantity, amount, description)`
* `deleteCustomCharge(customerCode, chargeId)`
* `resendInvoiceEmail(idOrNumber)`
* `oneTimeInvoice(customerCode, {data})`

All methods return a promise with the requested data in JSON format.

# Installation

```
npm install cheddar
```

Also install the peer dependencies:

```
npm install request request-promise-native
```

# Basic usage

```javascript
var Cheddar = require("cheddar");

var cheddar = new Cheddar("email@example.com", "passwordExample", "ProductCode");

cheddar.getAllPricingPlans().then(function (results) {
  console.log(results);
}).catch(function (err) {
  console.error(err);
});
```

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
  "email": "EMAIL",
  "pass": "PASSWORD",
  "productCode": "PRODUCTCODE",
  "planCode": "PLANCODE",
  "itemCode": "ITEMCODE"
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
