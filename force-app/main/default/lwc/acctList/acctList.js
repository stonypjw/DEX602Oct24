import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AcctList extends LightningElement {

    displayedAccts = [];

    @wire(getAccounts) wiredAccts(acctRecords){
        console.log(acctRecords);
        this.displayedAccts = acctRecords.data;
    };

}