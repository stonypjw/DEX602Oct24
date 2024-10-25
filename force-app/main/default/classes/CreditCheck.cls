public with sharing class CreditCheck {

    @AuraEnabled(continuation=true)
    public static Object creditCheckAPI(String accountId){

        String url = 'https://steve-wasula-splx201-dev-ed.my.salesforce-sites.com/creditcheck';

        Continuation con = new Continuation(60);
        con.ContinuationMethod = 'processReponse';
        con.state = 'Hello';

        Account acct = [SELECT ID, Name, Owner.Email, Owner.Name 
                        FROM Account
                        WHERE ID = :accountId
                        LIMIT 1];

        url += '?name=' + EncodingUtil.urlEncode(acct.Name, 'UTF-8')
            + '&email=' + acct.Owner.Email  
            + '&requestor=' + EncodingUtil.urlEncode(acct.Owner.Name, 'UTF-8');

       System.Debug('Final Endpoint: '+url);

       HttpRequest req = new HttpRequest();
            req.setEndpoint(url);
            req.setMethod('GET');

            con.addHttpRequest(req);

            return con;
    }

    @AuraEnabled 
    public static Object processResponse(List<String> labels, Object state){
        HttpResponse response = Continuation.getResponse(labels[0]);
        return response.getBody();
    }
}