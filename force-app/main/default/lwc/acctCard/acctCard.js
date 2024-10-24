import { LightningElement, api } from 'lwc';

export default class AcctCard extends LightningElement {

    @api acctId;
    @api acctName;
    @api acctNum;
    @api annualRevenue;
    @api acctPhone;
    @api acctWebsite;
    
    dispatchAccId(){
        console.log('AcctCard Clicked');
        const selectEvent = new CustomEvent('selected', 
                               { detail: {'prop1': this.acctId,
                                          'prop2': this.acctName}
                               });
           this.dispatchEvent(selectEvent);                    
    }
}