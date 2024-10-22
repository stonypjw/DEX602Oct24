import { LightningElement,api } from 'lwc';

export default class ChildComponent extends LightningElement {

    @api childName;
    @api familyName;
    @api showFamily;

    constructor(){
        super();
        console.log('Child Component.... Constructor Event Fired');
    }

    connectedCallback(){
        console.log('Child Component.... ConnectedCallback Event Fired');
    }

    renderedCallback(){
        console.log('Child Component.... RenderedCallback Event Fired');
    }
}