import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import {publish, MessageContext } from 'lightning/messageService';
import { getListInfosByObjectName,  getListRecordsByName  } from 'lightning/uiListsApi';

export default class AcctList extends LightningElement {

    displayedAccts = [];
    selectedId;
    selectedAcctName;
    @track accListViews = [];
    selectedListViewApiName = 'AllAccounts';

    @wire(getListInfosByObjectName, {
        objectApiName: 'Account',
        pageSize: 10
      })
      returnedListViews({ error, data }) {
        if(data){
            console.log('****LISTVIEW DATA*****');
            console.log(data);
            this.accListViews = 
               data.lists.map(list => ({
                value: list.apiName,
                label: list.label
               }));
        }
        if(error){
            console.error(error);
        }
      };
/*
    @wire(getAccounts) wiredAccts(acctRecords){
        console.log(acctRecords);
        if(acctRecords.data){
            this.displayedAccts = acctRecords.data;
            console.log(this.displayedAccts[0]);
            this.selectedId = this.displayedAccts[0].Id;
            this.selectedAcctName = this.displayedAccts[0].Name;
           this.sendMessageService(this.selectedId,this.selectedAcctName);
        }
        
    }; */

    @wire(getListRecordsByName, {
        objectApiName:'Account',
        listViewApiName: '$selectedListViewApiName',
        fields: ["Account.Name", "Account.AccountNumber", "Account.Id", "Account.AnnualRevenue", "Account.Phone", "Account.Website"],
        sortBy: ["Account.Name"],
      })
      returnedAccounts({ error, data }) {
        if(data){
            console.log(data);
            this.displayedAccts = data.records;
            console.log('****Account First****');
            console.log(this.displayedAccts[0]);
            console.log(this.displayedAccts[0].fields.Id.value);

            this.selectedId = this.displayedAccts[0].fields.Id.value;
            this.selectedAcctName = this.displayedAccts[0].fields.Name.value;
           this.sendMessageService(this.selectedId,this.selectedAcctName);
        }
      }

    @wire(MessageContext)
    messageContext;

    handleSelection(event){
        console.log('Selected Event Detected By AcctList');
        
        this.selectedId = event.detail.prop1;
        this.selectedAcctName = event.detail.prop2;
        console.log('AccountId: '+this.selectedId);
        console.log('AccountName: '+this.selectedAcctName);
        this.displayedAccts = [...this.displayedAccts];
        this.sendMessageService(this.selectedId,this.selectedAcctName);
    }

    sendMessageService(accountId, accountName){
        console.log('Message sent');
        publish(this.messageContext, AccountMC, { recordId: accountId, accountName: accountName});
    }

    changeList(event){
        this.selectedListViewApiName = event.detail.value;
        console.log('NewAPIName:'+this.selectedListViewApiName);
    }
}