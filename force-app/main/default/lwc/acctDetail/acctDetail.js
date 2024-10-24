import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import {subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class AcctDetail extends LightningElement {

    selectedId;
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
        console.log('Message recieved by AcctDetail');
        this.selectedId = message.recordId;
        this.selectedAcctName = message.accountName;
    }
}