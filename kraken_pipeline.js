const assert = require('assert-plus');
const request = require('request');
var _ = require('lodash');
var moment = require('moment');

const KrakenClient = require('@warren-bank/node-kraken-api')
var client;

module.exports = function() {
  return {
    initializeClient: function(key, secret) {
      assert.string(key);
      assert.string(secret);

      return new Promise(function(resolve, reject){
        client = new KrakenClient(key, secret, {timeout: 10000});
        return resolve(client);
      });
    },

    getTransactions: function() {
      var limit = 100;

      return new Promise(function(resolve,reject){
        var transactions = [];

        var getTrans = function(pagination) {

          // Public API method: Get Ticker Info
          client.api('TradesHistory', pagination)
          .then((result) => {
            console.log('Kraken Trade history:', result);

            if (!result.trades.length) {
              return resolve(transactions);
            }

            var txns = result.trades;

            transactions = transactions.concat(txns);

            // Need to break out of the inifinite loop:
            if (txns.length >= limit) {
              pagination.start = txns[txns.length - 1].time;
              getTrans(pagination); // call recursively!
            } else {
              return resolve(transactions);
            }
          })
          .catch((error) => {
            var new_error = new Error();
            new_error.message = error.message
            return reject(new_error);
          });
        }

        var pagination = {'ofs': limit};
        return getTrans(pagination);
      });
    },

    /*********************************
    **********************************
    ******** IMPORTANT TODO! *********
    **********************************
    *********************************/
    formatTransactions: function(unformatted_transactions) {
      // Important: Complete this function to convert unformatted_transactions into formatted_transactions that YaxReturns can use in its database:
      var formatted_transactions = [];
      
      /*
        ... Do your work here

        example: 

      */

      return formatted_transactions;
    },

    testAllMethods: function() {
      this.initializeClient().then(client => {
        assert.optionalString(client.key);
        assert.optionalString(client.secret);
        assert.optionalString(client.passphrase);
      });

      this.getTransactions().then(transactions => {
        assert.arrayOfObject(transactions);
      });

      // The ultimate test!:
      this.getTransactions().then(unformatted_transactions => {
        assert.arrayOfObject(unformatted_transactions);

        // This checks for properly formatted Transactions, which will ultimately be required by YaxReturns to enter the data into our database:
        this.formatTransactions(unformatted_transactions).then(formatted_transactions => {
          _.each(formatted_transactions, function(transaction) {

            /* 
              Here is some properly formatted Example data, ready to be inserted into the YaxReturns database:
              var transactions = [{
                exchange: "kraken",
                transaction_pair: "USD-BTC",
                currency: "BTC",
                exchange_transaction_id: "64b3c8c4-cc1e-5b89-8797-46937fa08fb9",
                type: "sell",
                status: "completed",
                price: "3.053",
                quantity: "1.066",
                cost: "3.254",
                fee: "0.53",
                exchange_created_at: "2018-01-15T18:41:19.436Z",
                exchange_updated_at: "2018-01-17T00:32:53.731Z"
              }]
            */

            //assert.optionalString(transaction.source); // eg. "etherscan"
            assert.string(transaction.exchange); // eg. "kraken"
            assert.string(transaction.transaction_pair); // eg. "USD-BTC"
            assert.string(transaction.currency); // eg. "BTC"
            assert.string(transaction.exchange_transaction_id); // The id of the object given by the exchange. eg. "64b3c8c4-cc1e-5b89-8797-46937fa08fb9"
            assert.string(transaction.type); // Transaction type eg. "sell"
            assert.optionalString(transaction.status); // eg. "completed"
            assert.string(transaction.price); // Price in USD ($). eg. "3.053"
            assert.string(transaction.quantity); // Quantity. Number of units. eg. "1.066"
            assert.optionalString(transaction.cost); // The total cost of the transaction. eg. transaction.price x transaction.quantity (YaxReturns can calculate this implicitly if this field does not exist in the exchange data).
            assert.string(transaction.fee); // Fee in USD ($). eg. "0.53"

            var exchange_created_at = moment().utc(transaction.exchange_created_at).format("YYYY-MM-DD HH:mm:ss.SSSSSS");
            assert.string(exchange_created_at); // The date this transaction was created on the exchange. In UTC timestampz. eg. 
            var exchange_updated_at = moment().utc(transaction.exchange_updated_at).format("YYYY-MM-DD HH:mm:ss.SSSSSS");
            assert.optionalString(transaction.exchange_updated_at); // The date this transaction was last updated on the exchange. In UTC timestampz. eg. 
            
          });
        });
      });
    },
  }
}