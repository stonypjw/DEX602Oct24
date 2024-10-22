import { LightningElement, api, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';

export default class OpportunityList extends LightningElement {

     @api recordId;

     recordsToDisplay = false;
     displayedOpps = [];
     results;

     @wire(getOpportunities, { accountId: '$recordId'})
     wiredOpps(oppRecords){
        this.results = oppRecords;

        if(this.results.data){
            this.displayedOpps = this.results.data;
            this.recordsToDisplay = true;
        }
        if(this.results.error){
            this.recordsToDisplay = false;
            console.error('Error occured retrieving opp records');
        }
     }
}