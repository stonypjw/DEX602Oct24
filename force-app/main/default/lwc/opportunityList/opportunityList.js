import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';

export default class OpportunityList extends LightningElement {

     @api recordId;

     recordsToDisplay = false;
     displayedOpps = [];
     results;
     status = 'All';

     @track comboOptions = [
        {value: 'All', label: 'All' },
        {value: 'Open', label: 'All Open' },
        {value: 'Closed', label: 'All Closed' },
        {value: 'ClosedWon', label: 'All Won' },
        {value: 'ClosedLost', label: 'All Lost' },
     ];
     
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