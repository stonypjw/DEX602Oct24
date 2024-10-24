import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import {subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class AcctRelated extends LightningElement {

    selectedId;
    oppsLabel;

    selectedAcctName;
    subscription = {};

    @wire(MessageContext)
    messageContext;

    subscribeToMC(){
        this.subscription = subscribe(this.messageContext, AccountMC,
                                        (message) => this.handleMessage(message));
    }

    unsubscribeToMC(){
        unsubscribe(this.subscription);
    }

    connectedCallback(){
        this.subscribeToMC();
    }

    disconnectedCallback(){
        this.unsubscribeToMC();
    }

    handleMessage(message){
        console.log('Message recieved by AcctRelated');
        this.selectedId = message.recordId;
        this.selectedAcctName = message.accountName;
        this.oppsLabel = 'Opportunities for: '+this.selectedAcctName;
    }
}