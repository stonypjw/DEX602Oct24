import { LightningElement,api } from 'lwc';

export default class OpportunityRecordForm extends LightningElement {

    @api recordId; //autopopulated
    @api objectApiName = 'Opportunity';
    @api layoutType = 'Compact';
    @api formMode = 'readonly';

    handleCancel(){
        const cancelEvent = new CustomEvent('cancel');
        this.dispatchEvent(cancelEvent);
    }

    handleSave(){
        const saveEvent = new CustomEvent('save');
        this.dispatchEvent(saveEvent);
    }
}