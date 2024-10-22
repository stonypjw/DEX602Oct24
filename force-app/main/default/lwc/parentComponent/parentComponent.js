import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    constructor(){
        super();
        console.log('Parent Component.... Constructor Event Fired');
    }

    connectedCallback(){
        console.log('Parent Component.... ConnectedCallback Event Fired');
    }

    renderedCallback(){
        console.log('Parent Component.... RenderedCallback Event Fired');
    }
}