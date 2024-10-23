import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { subscribe, unsubscribe } from 'lightning/empApi';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPP_CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';

export default class OpportunityList extends NavigationMixin(LightningElement) {

     @api recordId;

     recordsToDisplay = false;
     displayedOpps = [];
     allOpps = [];
     oppCopy = [];
     results;
     status = 'All';
     totalRecords;
     totalAmount;
     channelName = '/topic/Opportunities';
     subscription = {};
     displayModeValue = 'Card';
     tableMode = false;
     draftValues = [];

     displayOptions = [
        {value: 'Card', label: 'Card' },
        {value: 'Table', label: 'Table' }
     ];

     tableCols = [
        {label: 'Opportunity Name', fieldName: 'oppLink',  sortable: true, type: 'url', 
            typeAttributes: {
                label: {fieldName: 'Name' },
                target: '_blank'}
            },
        {label: 'Amount', fieldName: OPP_AMOUNT_FIELD.fieldApiName, editable: true, type: 'currency'},
        {label: 'Stage', fieldName: OPP_STAGE_FIELD.fieldApiName, type: 'text'},
        {label: 'Close Date', fieldName: OPP_CLOSEDATE_FIELD.fieldApiName, editable: true, type: 'date'},
        {label: 'Edit', type: 'button-icon', 
            typeAttributes:{
                iconName: 'utility:edit',
                name: 'openModal',
                title: 'Edit Record',
                variant: 'border-filled'
            }}
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
    
            this.allOpps = this.results.data.map(opp => {
                let currentOpp = { ...opp };
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: currentOpp.Id,
                        actionName: 'view'
                    }
                })
                .then(url => {
                    currentOpp.oppLink = url;
                });
                return this.allOpps;
            });

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

     handleTableSave(event){
        this.draftValues = event.detail.draftValues;
        console.log('Draft Values: '+this.draftValues);
        const inputItems = this.draftValues.slice().map(draft => {
            var fields = Object.assign({}, draft);
            return { fields };
     });

        console.log('Input Items: '+JSON.stringify(inputItems));

        const promises = inputItems.map(recordInput => updateRecord(recordInput));
    
        Promise.all(promises)
           .then (result => {
             this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All records have been updated',
                    variant: 'success'
                })
             );
           })
           .catch( error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Failure',
                    message: 'There were problems updating records',
                    variant: 'error'
                })
             );
           })
           .finally(() => {
            this.draftValues = [];
           });
        }

        handleRowAction(event){
            const actionName = event.detail.action.name;
            const row = event.detail.row;

            switch (actionName){
                case 'openModal':
                    RecordModal.open({
                        size: 'small',
                        recordId: row.Id,
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
                    break;
            }
        }
    }
