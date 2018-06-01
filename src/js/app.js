/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel', 'MockRESTServer'],
        function (oj, ko) {


            function viewModel() {
                var self = this;
                self.serviceURL = 'http://ec2-18-191-84-xxx.us-east-2.compute.amazonaws.com:3000/departments';
                self.Departments = ko.observableArray([]);
                self.DeptCol = ko.observable();
                self.datasource = ko.observable();
                self.somethingChecked = ko.observable(false);
                self.currentDeptName = ko.observable('default');
                self.workingId = ko.observable('');

                self.fetch = function (successCallBack) {
  // populate the collection by calling fetch()
                    self.DeptCol().fetch({
                        success: successCallBack,
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log('Error in fetch: ' + textStatus);
                        }
                    });
                };

                //getURL function to support customURL.

                function getUrl(operation, collection, options) {
                           var retObj = {};
                           retObj['type'] = getVerb(operation);
                           if (operation === "delete" || operation === "update") {
                               retObj['url'] = self.serviceURL + "/" + collection.id;
                               retObj['data'] = JSON.stringify({"DepartmentId":collection.id,
                               "DepartmentName":collection.attributes.DepartmentName});
                            } else if (operation === "create"){
                                  retObj['url'] = self.serviceURL;
                                  retObj['data'] = JSON.stringify({"DepartmentId":collection.id,
                                  "DepartmentName":collection.attributes.DepartmentName});
                            }
                            else {
                                   retObj['url'] = self.serviceURL;
                            }
                            retObj['headers'] = {};
                            //retObj['headers']['testopt'] = 'value';
                            return retObj;
                      };

                  function getVerb(verb) {
                                 if (verb === "read") {
                                     return "GET";
                                 }
                                 if (verb === "update") {
                                     return "PUT";
                                 }
                                 if (verb === "delete") {
                                     return "DELETE";
                                 }
                                 if (verb === "create") {
                                     return "POST"
                                 }
                  };

                self.parseDept = function(response) {
                      return {DepartmentId: response['DepartmentId'],
                          DepartmentName: response['DepartmentName']};
                };

                self.parseSaveDept = function (response) {
                     return {DepartmentId: response['DepartmentId'],
                         DepartmentName: response['DepartmentName']
                         };
                   };

                self.findDeptIds = function() {
                    var selectedIdsArray = [];
                    $("input:checkbox").each(function() {
                        var cb = $(this);
                        if (cb.is(":checked")) {
                            selectedIdsArray.push(cb.attr("id"));
                        }
                    });
                    return selectedIdsArray;
                }

                // Deletion handlers/helpers
                self.enableDelete = function() {
                    if (!$('input[type=checkbox]:checked').length) {
                        self.somethingChecked(false);
                    } else {
                        self.somethingChecked(true);
                    }
                    return true;
                }

                self.deleteDepartment = function(data, event) {
                    var deptIds = [];
                    deptIds = self.findDeptIds();
                    var collection = data.DeptCol();
                    deptIds.forEach(function(value, index, arr) {
                        //var model = collection.get(parseInt(value));
                        var model = collection.get(value);
                        if (model) {
                            //collection.remove(model);
                            model.destroy();
                        }
                    });
                    self.enableDelete();
                    $('#demoTable').ojTable('refresh');
                }

                // Update handlers/helpers
                self.showChangeNameDialog = function(deptId, data, event) {
                    var currName = data.DepartmentName;
                    self.workingId(deptId);
                    self.currentDeptName(currName);
                    document.getElementById("editDialog").open();
                }

                self.cancelDialog = function() {
                  document.getElementById("editDialog").close();
                  return true;
                }

                self.updateDeptName = function(formData, event) {
                    var currentId = self.workingId();
                    var myCollection = self.DeptCol();
                    var myModel = myCollection.get(currentId);
                    var newName = self.currentDeptName();
                    if (newName != myModel.get('DepartmentName') && newName != '') {
                        myModel.save({'DepartmentName': newName}, {
                            success: function(myModel, response, options) {
                              document.getElementById("editDialog").close();
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                alert("Update failed with: " + textStatus);
                                document.getElementById("editDialog").close();
                            }
                        });
                    } else {
                        alert('Department Name is not different or the new name is not valid');
                        document.getElementById("editDialog").close();
                    }
                };

                // Create handler
                self.addDepartment = function (formElement, event) {
                    var id = $("#newDepartId").val();
                    var recordAttrs = {DepartmentId: id,
                                       DepartmentName: $("#newDepartName").val()
                                      }
                    self.DeptCol().create(recordAttrs, {
                        'contentType': 'application/json',
                        success: function (response) {
                            console.log('Success in Create');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log('Error in Create: ' + textStatus);
                        }
                    });
                };

                // think of this as a single record in the DB, or a single row in your table
                var Department = oj.Model.extend({
                    //urlRoot: self.serviceURL,
                    customURL: getUrl,
                    parse: self.parseDept,
                    parseSave: self.parseSaveDept,
                    idAttribute: 'DepartmentId'
                });

                var myDept = new Department();

                // this defines our collection and what models it will hold
                var DeptCollection = oj.Collection.extend({
                    //url: self.serviceURL + "?limit=50",
                    //url: self.serviceURL,
                    customURL: getUrl,
                    model: myDept,
                    comparator: "DepartmentId"
                });

                self.DeptCol(new DeptCollection());
                self.datasource(new oj.CollectionTableDataSource(self.DeptCol()));
            }
            return {'deptVM': viewModel};
        }
);
