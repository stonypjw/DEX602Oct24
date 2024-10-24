public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id,Name,AnnualRevenue, Website, Phone,AccountNumber
        FROM Account
        ORDER BY AnnualRevenue DESC NULLS LAST LIMIT 5 ];
    }
}