import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';

export default class OppCard extends NavigationMixin(LightningElement) {
    @api name;
    @api stage;
    @api amount;
    @api closeDate;
    @api oppId;

    viewRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view' 
            }
        });
    }

    editOpp(){
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            headerLabel: 'Edit Opportunity'
        })
        .then((result) => {
            console.log(result);
        });
    }
}