import { LightningElement, api } from 'lwc';

export default class OppCard extends LightningElement {
    @api name;
    @api stage;
    @api amount;
    @api closeDate;
}