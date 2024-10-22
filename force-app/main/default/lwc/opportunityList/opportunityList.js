import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';

export default class OpportunityList extends LightningElement {

     @api recordId;

     recordsToDisplay = false;
     displayedOpps = [];
     allOpps = [];
     results;
     status = 'All';
     totalRecords;
     totalAmount;

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
            this.allOpps = this.results.data;
            this.updateList();
        }
        if(this.results.error){
            this.recordsToDisplay = false;
            console.error('Error occured retrieving opp records');
        }
     }

     updateList(){
        this.displayedOpps = [];

        let currentRecord = {};

        if (this.status === 'All'){
            this.displayedOpps = this.allOpps;
        }
        else {
            for (let i=0; i < this.allOpps.length; i++){
                currentRecord = this.allOpps[i];
                if(this.status === 'Open'){
                    if(!currentRecord.IsClosed){
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if (this.status === 'Closed'){
                    if(currentRecord.IsClosed){
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if(this.status === 'ClosedWon'){
                    if(currentRecord.IsWon){
                        this.displayedOpps.push(currentRecord);
                    } 
                }
                else if(this.status === 'ClosedLost'){
                    if(!currentRecord.IsWon && currentRecord.IsClosed){
                        this.displayedOpps.push(currentRecord);
                    } 
                }
            }
        }
        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;

        this.totalRecords = this.displayedOpps.length;
        this.totalAmount = this.displayedOpps.reduce((prev,curr) => prev + (isNaN(curr.Amount) ? 0 : curr.Amount), 0);


     }

     handleChange(event) {
        this.status = event.detail.value;
        this.updateList();
     }
}