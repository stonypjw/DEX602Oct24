import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';

export default class HelloWorld extends LightningElement {
    @api firstName = 'World';

    constructor(){
        super();
        loadStyle(this, GenWattStyle)
            .then(() => {console.log('Style sheet loaded')})
            .catch((error) => {console.log('Error loading style sheet')});
    }
}