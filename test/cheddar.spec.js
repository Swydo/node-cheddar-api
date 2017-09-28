/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-env node, mocha */
const chai = require('chai');
const Cheddar = require('../lib/cheddar');
const config = require('../config.json');

async function wait(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

describe('Cheddar', function () {
    this.timeout(30000);
    this.slow(2000);

    beforeEach(function () {
        this.customerCode1 = 'customerCode1';
        this.customerCode2 = 'customerCode2';
        this.cheddar = new Cheddar(config);
    });

    describe('Plans', function () {
        describe('#getAllPricingPlans', function () {
            it('should return a plan array', async function () {
                const plans = await this.cheddar.getAllPricingPlans();

                chai.expect(plans).to.be.an('array');
                chai.expect(plans.length).to.be.at.least(1);
            });
        });

        describe('#getPricingPlan', function () {
            it('should return a single plan', async function () {
                const plan = await this.cheddar.getPricingPlan(config.planCode);

                chai.expect(typeof plan).to.equal('object');
            });

            it('should fail on bad plan code', async function () {
                try {
                    await this.cheddar.getPricingPlan('Bad Plan Code');
                } catch (err) {
                    chai.expect(err.message).to.include('Plan not found');
                }
            });
        });
    });

    describe('Customers', function () {
        describe('#createCustomer', function () {
            it('should create a customer', async function () {
                const subscriptionData = {
                    planCode: config.planCode,
                    method: 'cc',
                    ccNumber: '4111111111111111',
                    ccExpiration: '12/2020',
                    ccCardCode: '123',
                    ccFirstName: 'FName',
                    ccLastName: 'LName',
                    ccZip: '95123',
                };

                await this.cheddar.createCustomer({
                    code: this.customerCode1,
                    firstName: 'FName',
                    lastName: 'LName',
                    email: 'test@example.com',
                    subscription: subscriptionData,
                });

                // Make sure the createdDatetime are different for each user
                await wait(2000);

                await this.cheddar.createCustomer({
                    code: this.customerCode2,
                    firstName: 'FName2',
                    lastName: 'LName2',
                    email: 'test2@example.com',
                    subscription: subscriptionData,
                });

                // Make the customer is saved before continuing
                await wait(2000);
            });
        });

        describe('#getAllCustomers', function () {
            it('should retrieve all customers', async function () {
                const options = {
                    planCode: [config.planCode],
                    subscriptionStatus: 'activeOnly',
                    orderBy: 'createdDatetime',
                    orderByDirection: 'desc',
                    createdAfterDate: '2017-01-01',
                };

                const customers = await this.cheddar.getAllCustomers(options);

                chai.expect(customers).to.be.an('array');
                chai.expect(customers.length).to.equal(2);
                chai.expect(customers[0].code).to.equal(this.customerCode2);
            });
        });

        describe('#searchCustomers', function () {
            it('should retrieve pagenated customers', async function () {
                const query = {
                    perPage: 1,
                };

                const {
                    count,
                    pageNumber,
                    pageCount,
                    hasNextPage,
                    customers,
                } = await this.cheddar.searchCustomers(query);

                chai.expect(count, 'number of customers').to.equal(2);
                chai.expect(pageNumber, 'current page number').to.equal(1);
                chai.expect(pageCount, 'number of pages').to.equal(2);
                chai.expect(hasNextPage, 'has more pages').to.equal(1);
                chai.expect(customers).to.be.an('array');
                chai.expect(customers.length).to.equal(1);
            });
        });

        describe('#getCustomer', function () {
            it('should retrieve a customer with the right code', async function () {
                const customer = await this.cheddar.getCustomer(this.customerCode1);
                chai.expect(customer).to.be.an('object');
            });

            it('should fail with bad code', async function () {
                try {
                    await this.cheddar.getCustomer('Bad Customer Code');
                } catch (err) {
                    chai.expect(err.message).to.include('Customer not found');
                }
            });
        });
    });

    describe('Items', function () {
        describe('#setItemQuantity', function () {
            it('should increase the item count', async function () {
                await this.cheddar.setItemQuantity(this.customerCode1, config.itemCode, 1);

                const customer = await this.cheddar.getCustomer(this.customerCode1);

                chai.expect(customer.subscriptions[0].items[0].quantity).to.equal(1);
            });
        });

        describe('#addItem', function () {
            it('should add to the item count', async function () {
                await this.cheddar.addItem(this.customerCode1, config.itemCode, 2);

                const customer = await this.cheddar.getCustomer(this.customerCode1);

                chai.expect(customer.subscriptions[0].items[0].quantity).to.equal(1 + 2);
            });

            it('should default to 1 as item count', async function () {
                await this.cheddar.addItem(this.customerCode1, config.itemCode);

                const customer = await this.cheddar.getCustomer(this.customerCode1);

                chai.expect(customer.subscriptions[0].items[0].quantity).to.equal(1 + 2 + 1);
            });
        });

        describe('#removeItem', function () {
            it('should decrease the item count', async function () {
                await this.cheddar.removeItem(this.customerCode1, config.itemCode, 2);

                const customer = await this.cheddar.getCustomer(this.customerCode1);

                chai.expect(customer.subscriptions[0].items[0].quantity).to.equal(2);
            });

            it('should default to 1 as item count', async function () {
                await this.cheddar.removeItem(this.customerCode1, config.itemCode);

                const customer = await this.cheddar.getCustomer(this.customerCode1);

                chai.expect(customer.subscriptions[0].items[0].quantity).to.equal(1);
            });
        });
    });

    describe('#deleteCustomer', function () {
        it('should remove a specific customer', async function () {
            await this.cheddar.deleteCustomer(this.customerCode1);
        });
    });

    describe('#deleteAllCustomers', function () {
        it('should remove all customers (in development mode)', async function () {
            const ts = Math.round((new Date()).getTime() / 1000) + 2000;
            await this.cheddar.deleteAllCustomers(ts);

            try {
                this.cheddar.getAllCustomers({});
            } catch (err) {
                chai.expect(err.message).to.include('No customers found');
            }
        });
    });

    describe('#callJsonApi', function () {
        it('should retrieve revenue data', async function () {
            await this.cheddar.callJsonApi('/report/revenue-monthly', {
                dateRange: {
                    start: '2017-06-01',
                    end: '2017-08-31',
                },
            }).then(result => chai.expect(result.revenue).to.be.an('array'));
        });
    });
});
