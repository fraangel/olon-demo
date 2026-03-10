public with sharing class NDAService {

    @AuraEnabled
    public static void generateAndSaveNDA(
        String leadId,
        String company,
        String contactName,
        String molecule
    ) {
        try {
            // 1. Prepara PageReference alla VF page con parametri
            PageReference pageRef = Page.NDADocumentPage;
            pageRef.getParameters().put('company',     company);
            pageRef.getParameters().put('contactName', contactName);
            pageRef.getParameters().put('molecule',    molecule);
            pageRef.getParameters().put('docDate',     Date.today().format());

            // 2. Genera il PDF (nei test getContent() non è supportato)
            Blob pdfBlob = Test.isRunningTest()
                ? Blob.valueOf('PDF_TEST_CONTENT')
                : pageRef.getContent();

            // 3. Nome file sicuro (rimuove caratteri non alfanumerici)
            String safeName = company.replaceAll('[^a-zA-Z0-9]', '_');
            String fileName = 'NDA_' + safeName + '_' + Date.today().format();

            // 4. Crea ContentVersion (il file PDF)
            ContentVersion cv = new ContentVersion(
                Title          = fileName,
                PathOnClient   = fileName + '.pdf',
                VersionData    = pdfBlob,
                IsMajorVersion = true
            );
            insert cv;

            // 5. Recupera ContentDocumentId generato automaticamente da Salesforce
            Id docId = [
                SELECT ContentDocumentId
                FROM ContentVersion
                WHERE Id = :cv.Id
                LIMIT 1
            ].ContentDocumentId;

            // 6. Collega il PDF al Lead tramite ContentDocumentLink
            insert new ContentDocumentLink(
                ContentDocumentId = docId,
                LinkedEntityId    = leadId,
                ShareType         = 'V',
                Visibility        = 'AllUsers'
            );

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
