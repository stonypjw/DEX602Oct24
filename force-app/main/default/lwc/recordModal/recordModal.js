import LightningModal from 'lightning/modal';
import { api } from 'lwc';

export default class RecordModal extends LightningModal {

    @api recordId;
    @api objectApiName;
    @api headerLabel;

    handleCancel(){
        this.close('modcancel');
    }

    handleSave(){
        this.close('modsave');
    }
}