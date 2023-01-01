const {expect} = require("chai");
const {ethers} = require("hardhat");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


describe("InvoiceRecord Contract", function() {
  let Database;
  let database;
  let owner;

  Record_List = 5;
  
  function verifyInvoice(recordChain, invoice) {
      expect(invoice.buyerPAN).to.equal(recordChain.buyerPAN.toString());
      expect(invoice.sellerPAN.toString()).to.equal(recordChain.sellerPAN.toString());
      expect(invoice.invoiceAmount).to.equal(recordChain.invoiceAmount);
      expect(invoice.invoiceDate).to.equal(recordChain.invoiceDate.toString());
  }

  function verifyInvoiceLedger(recordsFromChain, invoiceLedger) {
      expect(recordsFromChain.length).to.not.equal(0);
      expect(recordsFromChain.length).to.equal(invoiceLedger.length);
      for (let i = 0; i < invoiceLedger.length; i++) {
          const recordChain1 = recordsFromChain[i];
          const record1 = invoiceLedger[i];
          verifyInvoice(recordChain1, record1);
      }
  }


  beforeEach(async function() {
    Database = await ethers.getContractFactory("InvoiceRecord");
    [owner] = await ethers.getSigners();
    database = await Database.deploy();

    invoiceLedger = [];

    for(let i=0; i< Record_List; i++) {
      let invoice = {
        'buyerPAN': getRandomInt(1, 1000).toString(),
        'sellerPAN': getRandomInt(1800, 2021).toString(),
        'invoiceAmount': getRandomInt(1, 1000),
        'invoiceDate': getRandomInt(1, 1000).toString(),
        
      };

      await database.addRecord(invoice.buyerPAN, invoice.sellerPAN, invoice.invoiceAmount, invoice.invoiceDate);
      invoiceLedger.push(invoice);
    } 

  });




  describe("Get Invoices List", function() {
   
    it("should return all the invoices", async function(){
      const recordsFromChain = await database.getInvoiceList();
      expect(recordsFromChain.length).to.equal(Record_List);
      verifyInvoiceLedger(recordsFromChain, invoiceLedger);
    })
  })




  describe("Add Record", function(){
    it("should emit AddRecord event", async function() {
      let invoice = {
        'buyerPAN': getRandomInt(1, 1000).toString(),
        'sellerPAN': getRandomInt(1800, 2021).toString(),
        'invoiceAmount': getRandomInt(1, 1000),
        'invoiceDate': getRandomInt(1, 1000).toString(),

      };

      await expect(await database.addRecord(invoice.buyerPAN, invoice.sellerPAN, invoice.invoiceAmount, invoice.invoiceDate)
    ).to.emit(database, 'AddRecord').withArgs(invoice.buyerPAN, 5);
    })
  })

 

  
});