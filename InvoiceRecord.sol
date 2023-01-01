// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract InvoiceRecord{

event AddRecord(string BuyerPAN, uint Id);

struct Invoice{

    string buyerPAN;
    string sellerPAN;
    uint invoiceAmount;
    string invoiceDate;
    uint id;
  }

  Invoice[] private invoiceLedger;

  mapping(uint => Invoice) invoiceByBuyer;

  function addRecord(string memory buyerPAN, string memory sellerPAN, uint invoiceAmount,string memory invoiceDate) external {
    uint id = invoiceLedger.length;
    invoiceLedger.push(Invoice(buyerPAN, sellerPAN, invoiceAmount,invoiceDate,id));
    invoiceByBuyer[id].buyerPAN = buyerPAN;
    emit AddRecord(buyerPAN, id);
  }

  function getInvoiceList() external view returns (Invoice[] memory) {
    return invoiceLedger;
  }

  function getInvoiceByBuyerPAN(string calldata buyerPAN) external view returns (Invoice[] memory) {
    
    Invoice[] memory temporary = new Invoice[](invoiceLedger.length);
    uint counter = 0;
    for(uint i=0; i<invoiceLedger.length; i++) {
        //if(invoiceByBuyer[i].buyerPAN.equals(buyerPAN)) {
          if(keccak256(abi.encode(invoiceByBuyer[i].buyerPAN)) == keccak256(abi.encode(buyerPAN))){
        temporary[counter] = invoiceLedger[i];
        counter++;
      }
    }

    Invoice[] memory result = new Invoice[](counter);
    for(uint i=0; i<counter; i++) {
      result[i] = temporary[i];
    }
    return result;
  }

  

}


