import { LightningElement, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class AcctCard extends LightningElement {

    @api acctId;
    @api acctName;
    @api acctNum;
    @api annualRevenue;
    @api acctPhone;
    @api acctWebsite;
    @api selectedId;

    loadingContacts = false;
    showContacts = false;
    contacts;
    cardClass = 'slds-card';

    dispatchAccId(){
        console.log('AcctCard Clicked');
        if(this.acctId === this.selectedId) {
            this.cardClass = 'slds-card-selected';
        }
        else {
            this.cardClass = 'slds-card'; 
        }
        console.log('Class:'+this.cardClass);
        const selectEvent = new CustomEvent('selected', 
                               { detail: {'prop1': this.acctId,
                                          'prop2': this.acctName}
                               });
           this.dispatchEvent(selectEvent);                    
    }

    displayContacts(){
        if(this.showContacts){
            this.showContacts = false;
        }
        else {

            this.loadingContacts = true;

            getContactList({ accountId: this.acctId})
               .then((data) => {
                this.contacts = data;
                this.showContacts = true;
               })
               .catch((error) => {
                console.error('Error retrieving contacts');
                this.showContacts = false;
               })
               .finally(() => {
                 this.loadingContacts = false;
               })
        }
    }



}