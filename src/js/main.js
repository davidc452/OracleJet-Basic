/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Example of Require.js boostrap javascript
 */

requirejs.config({
    // Path mappings for the logical module names
    paths:
    //injector:mainReleasePaths
    {
      'knockout': 'libs/knockout/knockout-3.4.2',
      'jquery': 'libs/jquery/jquery-3.3.1.min',
      'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
      'promise' : 'libs/es6-promise/es6-promise',
      'hammerjs': 'libs/hammer/hammer-2.0.8',
      'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
      'ojs': 'libs/oj/v5.0.0/debug',
      'ojL10n': 'libs/oj/v5.0.0/ojL10n',
      'ojtranslations': 'libs/oj/v5.0.0/resources',
      'mockjax': 'rest/jquery.mockjax',
      'MockRESTServer' : 'rest/MockRESTServer',
      'customElements': 'libs/webcomponents/custom-elements.min'
    }
    //endinjector
    ,
    //Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        },
        'mockjax': {
            deps: ['jquery']
        },
        'MockRESTServer': {
            deps: ['mockjax']
        }
    },

    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
        ojL10n: {
            merge: {
                //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
            }
        }
    }
});


/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore',
    'knockout',
    'jquery',
    'app',
    'footer',
    'MockRESTServer',
    'ojs/ojmodel',
    'ojs/ojknockout',
    'ojs/ojknockout-model',
    'ojs/ojdialog',
    'ojs/ojinputtext',
    'ojs/ojinputnumber',
    'ojs/ojbutton',
    'ojs/ojtable',
    'ojs/ojcollectiontabledatasource'],
        function(oj, ko, $, app, footer, MockRESTServer) // this callback gets executed when all required modules are loaded
        {

            var fvm = new footer.footerVM();

            $(document).ready(function() {
                    $.getJSON("js/departments.json",
                            function (data) {
                    new MockRESTServer(data, {id:"DepartmentId",
                        url:/^http:\/\/mockrest\/stable\/rest\/Departments(\?limit=([\d]*))?$/i,
                        idUrl:/^http:\/\/mockrest\/stable\/rest\/Departments\/([\d]+)$/i});

                var vm = new app.deptVM();
                ko.applyBindings(fvm, document.getElementById('footerContent'));

                vm.fetch(function(collection, response, options) {
                    var deptData = collection;

                    // This will create a ko.observable() for each element in the deptData response
                    // and assign the resulting array to the Departments ko observeableArray.
                    vm.Departments = oj.KnockoutUtils.map(deptData, null, true);

                    //perform a Knockout applyBindings() call binding this viewModel with the curent DOM
                    ko.applyBindings(vm, document.getElementById('mainContent'));

                    //Show the content div after the REST call is completed.
                    $('#mainContent').show();
                });
                });
            });
        }
);
