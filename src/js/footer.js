/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout'],
        function(oj, ko)
        {
            /* 
             * This is an example of how global functionality can be placed in a separate 
             * module from the main application javascript.
             * 
             * The Knockout applyBindings for this viewmodel is implemented in main.js
             */

            function FooterViewModel() {
                var self = this;

                var aboutOracle = 'http://www.oracle.com/us/corporate/index.html#menu-about';
                var contactUs = 'http://www.oracle.com/us/corporate/contact/index.html';
                var legalNotices = 'http://www.oracle.com/us/legal/index.html';
                var termsOfUse = 'http://www.oracle.com/us/legal/terms/index.html';
                var privacyRights = 'http://www.oracle.com/us/legal/privacy/index.html';

                self.ojVersion = ko.observable('v' + oj.version);

                self.footerLinks = ko.observableArray([
                    new FooterNavModel('About Oracle', 'aboutOracle', aboutOracle),
                    new FooterNavModel('Contact Us', 'contactUs', contactUs),
                    new FooterNavModel('Legal Notices', 'legalNotices', legalNotices),
                    new FooterNavModel('Terms Of Use', 'termsOfUse', termsOfUse),
                    new FooterNavModel('Your Privacy Rights', 'yourPrivacyRights', privacyRights)
                ]);

            }

            function FooterNavModel(name, id, linkTarget) {

                this.name = name;
                this.linkId = id;
                this.linkTarget = linkTarget;

            }

            return {'footerVM': FooterViewModel};
        });
