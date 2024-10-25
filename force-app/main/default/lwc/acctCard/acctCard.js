import { LightningElement, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import creditCheckAPI from '@salesforce/apexContinuation/CreditCheck.creditCheckAPI';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
    

    creditObj = {};

    get isSelected() {
        return this.acctId === this.selectedId;
    }

    get cardClass() {
        console.log('IsSelected?:'+this.acctWebsiteisSelected);
        if(this.isSelected){
            return 'slds-card-selected';
        }
        else {
            return 'slds-card';
        }
    }
    dispatchAccId(){
        console.log('AcctCard Clicked');
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

    checkCredit(){
        creditCheckAPI({ accountId: this.acctId })
            .then ( response => {
                console.log(response);
                this.creditObj = JSON.parse(response);
                console.log(this.creditObj.Company_Name__c);

                var toastMessage = 'Credit check approved for '+ this.creditObj.Company_Name__c;

                const toastEvent = new ShowToastEvent({
                    title: 'Credit Check Completed',
                    message: toastMessage,
                    variant: 'success',
                    mode: 'sticky'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch( error => {
                console.error(JSON.stringify(error));
            })
            .finally(() => {
                console.log('Finished credit check');
            });
    }

}