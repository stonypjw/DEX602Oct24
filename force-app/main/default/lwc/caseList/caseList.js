import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class CaseList extends LightningElement {

    data;
    error;
    displayedCases = [];
    @api selectedId;

    @wire(getRelatedListRecords, {
        parentRecordId: '$selectedId',
        relatedListId: 'Cases',
        fields: ['Case.CaseNumber','Case.Id','Case.Subject','Case.Status','Case.Priority']
      })
      listInfo({ error, data }) {
        if (data) {
          this.displayedCases = data.records;
          console.log('Cases Recieved');
          console.log(this.displayedCases);
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.displayedCases = undefined;
        }
}
}