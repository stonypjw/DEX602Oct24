import { LightningElement,api } from 'lwc';

export default class HelloWorldDisplay extends LightningElement {
    @api displayName = 'World';
}