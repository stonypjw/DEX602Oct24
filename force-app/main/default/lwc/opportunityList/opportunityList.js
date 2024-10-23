import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { subscribe, unsubscribe } from 'lightning/empApi';

export default class OpportunityList extends LightningElement {

     @api recordId;

     recordsToDisplay = false;
     displayedOpps = [];
     allOpps = [];
     results;
     status = 'All';
     totalRecords;
     totalAmount;
     channelName = '/topic/Opportunities';
     subscription = {};
     displayModeValue = 'Card';
     tableMode = false;

     displayOptions = [
        {value: 'Card', label: 'Card' },
        {value: 'Table', label: 'Table' }
     ];

     @track comboOptions = [
        {value: 'All', label: 'All' },
        {value: 'Open', label: 'All Open' },
        {value: 'Closed', label: 'All Closed' }
       // {value: 'ClosedWon', label: 'All Won' },
       // {value: 'ClosedLost', label: 'All Lost' },
     ];

     @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: STAGE_FIELD})
     wiredPicklist({ data, error }) {
        if (data) {
            for (let item of data.values) {
                this.comboOptions.push({value: item.value, label: item.label});
            }
            this.comboOptions = this.comboOptions.slice();
        }
        if (error) {
            console.error('Error occured retrieving picklist values....');
        }
     }

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

     connectedCallback(){
        this.handleSubscribe();
     }

     disconnectedCallback(){
        this.handleUnsubscribe();
     }

     handleSubscribe(){
        const messageCallback = response => {
            if(response.data.event.type === 'deleted'){
                if(this.allOpps.find(elem => {return elem.Id === response.data.sobject.Id})){
                    this.refreshList();
                }
            }
            else{
                if(response.data.sobject.AccountId === this.recordId){
                this.refreshList();
                }
            }
        }
        subscribe(this.channelName, -1, messageCallback)
             .then(response => { this.subscription = response});
     }

     handleUnsubscribe(){
        unsubscribe(this.subscription, response => { console.log('Opp List unsubscribed from Push Topic...')});
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
              /*  else if(this.status === 'ClosedWon'){
                    if(currentRecord.IsWon){
                        this.displayedOpps.push(currentRecord);
                    } 
                } 
                else if(this.status === 'ClosedLost'){
                    if(!currentRecord.IsWon && currentRecord.IsClosed){
                        this.displayedOpps.push(currentRecord);
                    } 
                }*/
               else if (this.status === currentRecord.StageName){
                this.displayedOpps.push(currentRecord);
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

     refreshList(){
        refreshApex(this.results);
     }

     handleDisplayChange(event){
        this.tableMode = !this.tableMode;
        this.displayModeValue = event.detail.value;
     }
}