const assert = require('assert-plus');
const request = require('request');
var _ = require('lodash');
var moment = require('moment');

/*
Import any other node.js modules you need up here 
*/



module.exports = function(app) {
  return {
    getAccessToken: function(/* params */) {
      // Complete this function ONLY IF necessary, meaning that in order to use any of the other endpoints, you need to retrieve some form of access tokens from the exchange first.
      // This function should return a Promise that resolves the token, eg. resolve(token);

      return new Promise(function(resolve, reject){
        
        var fetched_token = {};
        resolve(fetched_token);
      });
    },

    getWallets: function(/* params */) {
      // Complete this function ONLY IF necessary, meaning that in order to buys, sells or transactions, you first need to getWallets().
      // This function should return a Promise that resolves the wallets, eg. resolve(wallets);

      return new Promise(function(resolve, reject){
        
        var fetched_wallets = [];
        resolve(fetched_wallets);
      });
    },

    getBuys: function(/* params */) {
      // Complete this function ONLY IF the exchange has an explicit endoint to GET just "buys"
      // This function should return a Promise that resolves the buys, eg. resolve(buys);
      // It should "paginate" (limit, offset, etc.) to get however many pages of buys there are

      return new Promise(function(resolve, reject){
        
        var fetched_buys = [];
        resolve(fetched_buys);
      });
    },

    getSells: function(/* params */) {
      // Complete this function ONLY IF the exchange has an explicit endoint to GET just "sells"
      // This function should return a Promise that resolves the sells, eg. resolve(sells);
      // It should "paginate" (limit, offset, etc.) to get however many pages of sells there are

      return new Promise(function(resolve, reject){
        
        var fetched_sells = [];
        resolve(fetched_sells);
      });
    },

    getTransactions: function(wallet) {
      // Complete this function ONLY IF the exchange does not have explicit endoints to GET just "buys" and "sells"
      // This function should return a Promise that resolves the transactions, eg. resolve(transactions);
      // It should "paginate" (limit, offset, etc.) to get however many pages of transactions there are

      return new Promise(function(resolve, reject){
        
        var fetched_transactions = [];
        resolve(fetched_transactions);
      });
    },

    /*********************************
    **********************************
    ******** IMPORTANT TO DO! ********
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








    /**************************************************************
    ***************************************************************
    ******** RUN THIS METHOD TO TEST ALL THE METHODS ABOVE ********
    ***************************************************************
    ***************************************************************/
    testAllMethods: function() {
      this.getAccessToken().then(token => {
        assert.optionalObject(token);
      });

      this.getWallet().then(wallet => {
        assert.optionalObject(wallet);
        assert.string(wallet);
      });

      this.getWallets().then(wallets => {
        assert.arrayOfObject(wallets);
      });

      this.getBuys().then(buys => {
        assert.arrayOfObject(buys);
      });

      this.getSells().then(sells => {
        assert.arrayOfObject(sells);
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