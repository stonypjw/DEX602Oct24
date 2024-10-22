import { LightningElement,api } from 'lwc';

export default class ChildComponent extends LightningElement {

    @api childName;
    @api familyName;
    @api showFamily;

    childSpeak;

    respondToParent(event) {
        this.childSpeak = event.detail.value;
        const myEvent =
              new CustomEvent('speak', { detail: 
                                            {
                                           message: this.childSpeak,
                                           name: this.childName }});
        this.dispatchEvent(myEvent);
    }

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