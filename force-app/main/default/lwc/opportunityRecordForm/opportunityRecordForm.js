import { LightningElement,api } from 'lwc';

export default class OpportunityRecordForm extends LightningElement {

    @api recordId; //autopopulated
    @api objectApiName = 'Opportunity';
    @api layoutType = 'Compact';
    @api formMode = 'readonly';
}