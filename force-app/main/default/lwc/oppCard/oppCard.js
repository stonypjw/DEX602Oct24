import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OppCard extends NavigationMixin(LightningElement) {
    @api name;
    @api stage;
    @api amount;
    @api closeDate;
    @api oppId;

    viewRecord(){
        console.log('RecordID is: '+this.oppId);
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
            if(result==='modsave'){
                const successToast = new ShowToastEvent({
                    title: 'Opportunity Has Been Updated Successfully',
                    message: 'Your record has been updated',
                    variant: 'success',
                    mode: 'dissmissible'
                });
                this.dispatchEvent(successToast);
                const saveEvent = new CustomEvent('modsaved');
                this.dispatchEvent(saveEvent);
            }
        });
    }
}