import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import {publish, MessageContext } from 'lightning/messageService';
import { getListInfosByObjectName } from 'lightning/uiListsApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class AcctList extends LightningElement {

    displayedAccts = [];
    selectedId;
    selectedAcctName;
    @track accListViews = [];
    selectedListViewId;
    
    @wire(getListInfosByObjectName, {
        objectApiName: ACCOUNT_OBJECT,
        pageSize: 10
      })
      returnedListViews({ error, data }) {
        console.log('****LISTVIEW DATA*****');
            console.log(data);
            console.log(error);
        if(data){
            console.log('****LISTVIEW DATA*****');
            console.log(data);
            this.accListViews = 
               Object.keys(data.lists).map(id => ({
                id: data.lists.id,
                name: data.lists.label
               }));
        }
        if(error){
            console.error(error);
        }
      };

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