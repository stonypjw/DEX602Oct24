import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import {publish, MessageContext } from 'lightning/messageService';

export default class AcctList extends LightningElement {

    displayedAccts = [];
    selectedId;
    selectedAcctName;

    @wire(getAccounts) wiredAccts(acctRecords){
        console.log(acctRecords);
        if(acctRecords.data){
            this.displayedAccts = acctRecords.data;
            console.log(this.displayedAccts[0]);
            this.selectedId = this.displayedAccts[0].Id;
            this.selectedAcctName = this.displayedAccts[0].Name;
           this.sendMessageService(this.selectedId,this.selectedAcctName);
        }
        
    };

    @wire(MessageContext)
    messageContext;

    handleSelection(event){
        console.log('Selected Event Detected By AcctList');
        
        this.selectedId = event.detail.prop1;
        this.selectedAcctName = event.detail.prop2;
        console.log('AccountId: '+this.selectedId);
        console.log('AccountName: '+this.selectedAcctName);

        this.sendMessageService(this.selectedId,this.selectedAcctName);
    }

    sendMessageService(accountId, accountName){
        console.log('Message sent');
        publish(this.messageContext, AccountMC, { recordId: accountId, accountName: accountName});
    }

}