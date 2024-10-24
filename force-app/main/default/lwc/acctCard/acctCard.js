import { LightningElement, api } from 'lwc';

export default class AcctCard extends LightningElement {

    @api acctId;
    @api acctName;
    @api acctNum;
    @api annualRevenue;
    @api acctPhone;
    @api acctWebsite;
    
}