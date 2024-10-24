import { LightningElement, api } from 'lwc';

export default class CaseCard extends LightningElement {

    @api caseId
    @api caseNumber
    @api caseSubject
    @api casePriority
    @api caseStatus

    viewRecord(){
        console.log('RecordID is: '+this.caseId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.caseId,
                actionName: 'view' 
            }
        });
    }
}