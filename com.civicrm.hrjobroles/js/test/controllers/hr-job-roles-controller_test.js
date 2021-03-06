define([
    'common/angular',
    'common/lodash',
    'common/moment',
    'mocks/data/job-roles',
    'common/angularMocks',
    'job-roles/app'
], function (angular, _, moment, Mock) {
    'use strict';

    describe('HRJobRolesController', function () {
        var $controller, $filter, $q, $rootScope, DateValidation, HRJobRolesService, ctrl, scope, settingsData;
        var contactId = '123';

        beforeEach(module('hrjobroles'));
        beforeEach(inject(function ($httpBackend, _$controller_, _$filter_, _$q_, _$rootScope_, _DateValidation_, _HRJobRolesService_) {
            $controller = _$controller_;
            $filter = _$filter_;
            $q = _$q_;
            $rootScope = _$rootScope_;

            DateValidation = _DateValidation_;
            HRJobRolesService = _HRJobRolesService_;

            // Ignores any request for templates
            $httpBackend.expectGET(/\/views\//).respond(200);

            // Mock data from CiviCRM settings
            DateValidation.dateFormats.push('DD/MM/YYYY');
        }));

        describe('getOptionValues', function() {
          beforeEach(function () {
            spyOn(HRJobRolesService, 'getOptionValues').and.returnValue($q.resolve({
               "count":5,
               "values":[
                  {
                     "id":"845",
                     "option_group_id":"111",
                     "label":"Senior Manager",
                     "value":"Senior Manager",
                     "name":"Senior_Manager",
                     "is_default":"0",
                     "weight":"1",
                     "is_optgroup":"0",
                     "is_reserved":"0",
                     "is_active":"1"
                  },
                  {
                     "id":"846",
                     "option_group_id":"111",
                     "label":"Junior Manager",
                     "value":"Junior Manager",
                     "name":"Junior_Manager",
                     "is_default":"0",
                     "weight":"2",
                     "is_optgroup":"0",
                     "is_reserved":"0",
                     "is_active":"1"
                  },
                  {
                     "id":"879",
                     "option_group_id":"124",
                     "label":"Other",
                     "value":"Other",
                     "name":"Other",
                     "filter":"0",
                     "is_default":"0",
                     "weight":"3",
                     "is_optgroup":"0",
                     "is_reserved":"0",
                     "is_active":"1"
                  },
                  {
                     "id":"1045",
                     "option_group_id":"124",
                     "label":"Test A",
                     "value":"1",
                     "name":"Test A",
                     "filter":"0",
                     "is_default":"0",
                     "weight":"2",
                     "is_optgroup":"0",
                     "is_reserved":"0",
                     "is_active":"1"
                  },
                  {
                     "id":"1046",
                     "option_group_id":"124",
                     "label":"Test B",
                     "value":"2",
                     "name":"Test B",
                     "filter":"0",
                     "is_default":"0",
                     "weight":"1",
                     "description":"Test B",
                     "is_optgroup":"0",
                     "is_reserved":"0",
                     "is_active":"1"
                  }
               ],
               "optionGroupData":{
                  "cost_centres":"124"
               }
            }));
            initController();
            $rootScope.$digest();
          });

          it('builds the "CostCentreList" array of objects containing the "weight" property', function(){
            expect(ctrl.CostCentreList.length).toBe(3);
            expect(ctrl.CostCentreList[0].weight).not.toBeNull();
            expect(ctrl.CostCentreList[1].weight).not.toBeNull();
            expect(ctrl.CostCentreList[2].weight).not.toBeNull();
          });
        });

        describe('Basic tests', function () {
            beforeEach(function () {
                spyOn(HRJobRolesService, 'getContracts').and.callThrough();

                initController();
            });

            describe('on init', function () {
                it('fetches the Job Contract of the contact', function () {
                    expect(HRJobRolesService.getContracts).toHaveBeenCalledWith(contactId);
                });
            });

            describe('Validate role', function(){
                var form_data;

                beforeEach(function(){
                    ctrl.contractsData = angular.copy(Mock.contracts_data);
                    form_data = angular.copy(Mock.form_data);
                    form_data.contract.$viewValue = '1';
                    form_data.title.$viewValue = 'test';
                });

                it('should not pass validation', function(){
                    expect(ctrl.validateRole(form_data)).not.toBe(true);
                });

                it('should pass validation dd/mm/yyyy', function(){
                    form_data.start_date.$viewValue = '31/12/2016';

                    expect(ctrl.validateRole(form_data)).toBe(true);
                });

                it('should pass validation new Date()', function(){
                    form_data.start_date.$viewValue = new Date();

                    expect(ctrl.validateRole(form_data)).toBe(true);
                });

                it('should pass validation new Date()', function(){
                    form_data.start_date.$viewValue = '2016-05-05';

                    expect(ctrl.validateRole(form_data)).toBe(true);
                });

                describe('when job role start date is lower than contract start date', function () {
                    beforeEach(function () {
                        form_data.start_date.$viewValue = '2016-05-04';
                        form_data.end_date.$viewValue = '2017-05-05';
                    });

                    it('throws a validation error', function () {
                        expect(ctrl.validateRole(form_data)).not.toBe(true);
                    });
                });

                describe('when job role start date is lower than contract start date and doesn\'t inform end_date', function () {
                    beforeEach(function () {
                        form_data.start_date.$viewValue = '2016-01-01';
                        form_data.contract.$viewValue = '2';
                    });

                    it('throws a validation error', function () {
                        expect(ctrl.validateRole(form_data)).not.toBe(true);
                    });
                });

                describe('when job role end date is higher than contract end date', function () {
                    beforeEach(function () {
                        form_data.start_date.$viewValue = '2016-06-04';
                        form_data.end_date.$viewValue = '2017-05-06';
                    });

                    it('throws a validation error', function () {
                        expect(ctrl.validateRole(form_data)).not.toBe(true);
                    });
                });

                describe('when job role start date and job role end date is higher than contract end date', function () {
                    beforeEach(function () {
                        form_data.start_date.$viewValue = '2016-05-06';
                        form_data.end_date.$viewValue = '2017-05-06';
                    });

                    it('throws a validation error', function () {
                        expect(ctrl.validateRole(form_data)).not.toBe(true);
                    });
                });
            });

            describe('Fetching Dates from contract', function () {
                beforeEach(function () {
                    ctrl.contractsData = angular.copy(Mock.contracts_data);
                });

                describe('Checking if dates entered in job role are th same as those in contracts', function () {

                    it('should check if entered dates are custom', function () {
                        expect(ctrl.checkIfDatesAreCustom('2005-01-01', null)).toBe(true);
                    });

                    it('should omit a time information', function () {
                        expect(ctrl.checkIfDatesAreCustom(Mock.contracts_data[0].start_date + ' 00:00:00', Mock.contracts_data[0].end_date)).toBe(false);
                    });

                    it('should successfully compare dates to contract without end date', function(){
                        expect(ctrl.checkIfDatesAreCustom(Mock.contracts_data[2].start_date, null)).toBe(false);
                    });

                    it('should successfully compare date object', function(){
                        expect(ctrl.checkIfDatesAreCustom(new Date(2016, 0, 1), new Date(2016, 0, 31))).toBe(false);
                    });

                    it('should return false only if both dates match the same contract', function () {
                        expect(ctrl.checkIfDatesAreCustom(Mock.contracts_data[0].start_date, Mock.contracts_data[0].end_date)).toBe(false);
                        expect(ctrl.checkIfDatesAreCustom(Mock.contracts_data[1].start_date, Mock.contracts_data[0].end_date)).toBe(true);
                    });
                });

                describe('New Job Role', function () {
                    beforeEach(function () {
                        ctrl.edit_data['new_role_id'] = angular.copy(Mock.new_role);
                    });

                    it('should set dates', function () {
                        ctrl.edit_data['new_role_id'].job_contract_id = 0;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject(Mock.contracts_data[0].start_date));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toEqual(convertToDateObject(Mock.contracts_data[0].end_date));
                    });

                    it('should not modify if dates were edited manually', function () {
                        ctrl.edit_data['new_role_id'].newStartDate = '2005-01-01';
                        ctrl.edit_data['new_role_id'].job_contract_id = 1;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject('2005-01-01'));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toBe(null);
                    });

                    it('should set only start date if contract has no end date', function () {
                        ctrl.edit_data['new_role_id'].job_contract_id = 2;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject(Mock.contracts_data[2].start_date));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toBe(null);
                    });

                    it('should change dates whenever contract change', function () {
                        ctrl.edit_data['new_role_id'].job_contract_id = 0;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject(Mock.contracts_data[0].start_date));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toEqual(convertToDateObject(Mock.contracts_data[0].end_date));

                        // change contract
                        ctrl.edit_data['new_role_id'].job_contract_id = 1;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject(Mock.contracts_data[1].start_date));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toEqual(convertToDateObject(Mock.contracts_data[1].end_date));

                        // change contract
                        ctrl.edit_data['new_role_id'].job_contract_id = 2;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject(Mock.contracts_data[2].start_date));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toBe(null);

                        // change contract
                        ctrl.edit_data['new_role_id'].job_contract_id = 0;
                        ctrl.onContractSelected();
                        expect(ctrl.edit_data['new_role_id'].newStartDate).toEqual(convertToDateObject(Mock.contracts_data[0].start_date));
                        expect(ctrl.edit_data['new_role_id'].newEndDate).toEqual(convertToDateObject(Mock.contracts_data[0].end_date));
                    });

                    it('form should be validated', function () {
                        ctrl.edit_data['new_role_id'].job_contract_id = 2;
                        ctrl.onContractSelected();

                    });
                });

                describe('Existing Job Role', function () {
                    beforeEach(function () {
                        ctrl.edit_data = angular.copy(Mock.roles_data);
                        ctrl.contractsData = angular.copy(Mock.contracts_data);
                    });

                    it('should set dates', function(){
                        ctrl.edit_data[0].start_date = null;
                        ctrl.edit_data[0].end_date = null;
                        ctrl.edit_data[0].job_contract_id = 0;
                        ctrl.onContractEdited(0, 0);

                        expect(ctrl.edit_data[0].start_date).toEqual(convertToDateObject(Mock.contracts_data[0].start_date));
                        expect(ctrl.edit_data[0].end_date).toEqual(convertToDateObject(Mock.contracts_data[0].end_date));
                    });

                    it('should not modify if dates were edited manually', function(){
                        ctrl.edit_data[2].start_date = '2005-01-01';
                        ctrl.edit_data[2].job_contract_id = 1;
                        ctrl.onContractEdited(1, 2);

                        expect(ctrl.edit_data[2].start_date).toEqual(convertToDateObject('2005-01-01'));
                        expect(ctrl.edit_data[2].end_date).toEqual(convertToDateObject(Mock.contracts_data[3].end_date));
                    });

                    it('should set only start date if contract has no end date', function(){
                        ctrl.edit_data[2].start_date = Mock.contracts_data[1].start_date;
                        ctrl.edit_data[2].end_date = Mock.contracts_data[1].end_date;

                        ctrl.edit_data[2].job_contract_id = 2;
                        ctrl.onContractEdited(2, 2);
                        expect(ctrl.edit_data[2].start_date).toEqual(convertToDateObject(Mock.contracts_data[2].start_date));
                        expect(ctrl.edit_data[2].end_date).toBe(null);
                    });

                    it('should change dates whenever contract change', function(){
                        ctrl.edit_data[2].start_date = Mock.contracts_data[1].start_date;
                        ctrl.edit_data[2].end_date = Mock.contracts_data[1].end_date;

                        ctrl.edit_data[2].job_contract_id = 0;
                        ctrl.onContractEdited(0, 2);
                        expect(ctrl.edit_data[2].start_date).toEqual(convertToDateObject(Mock.contracts_data[0].start_date));
                        expect(ctrl.edit_data[2].end_date).toEqual(convertToDateObject(Mock.contracts_data[0].end_date));

                        // change contract
                        ctrl.edit_data[2].job_contract_id = 1;
                        ctrl.onContractEdited(1, 2);
                        expect(ctrl.edit_data[2].start_date).toEqual(convertToDateObject(Mock.contracts_data[1].start_date));
                        expect(ctrl.edit_data[2].end_date).toEqual(convertToDateObject(Mock.contracts_data[1].end_date));

                        // change contract
                        ctrl.edit_data[2].job_contract_id = 2;
                        ctrl.onContractEdited(2, 2);
                        expect(ctrl.edit_data[2].start_date).toEqual(convertToDateObject(Mock.contracts_data[2].start_date));
                        expect(ctrl.edit_data[2].end_date).toBe(null);

                        // change contract
                        ctrl.edit_data[2].job_contract_id = 0;
                        ctrl.onContractEdited(0, 2);
                        expect(ctrl.edit_data[2].start_date).toEqual(convertToDateObject(Mock.contracts_data[0].start_date));
                        expect(ctrl.edit_data[2].end_date).toEqual(convertToDateObject(Mock.contracts_data[0].end_date));
                    });


                });

                describe('When call onAfterSave', function() {
                  beforeEach(function () {
                    ctrl.edit_data = angular.copy(Mock.roles_data);
                  });

                  it('should remove the funders entries which are without funder_id', function() {
                    ctrl.onAfterSave(3, 'funders');
                    expect(ctrl.edit_data[3]['funders'].length).toBe(3);
                  });

                  it('should remove the cost_centers entries which are without cost_centre_id', function() {
                    ctrl.onAfterSave(3, 'cost_centers');
                    expect(ctrl.edit_data[3]['cost_centers'].length).toBe(2);
                  });
                });

                describe('When call onCancel passing', function() {
                  beforeEach(function () {
                    ctrl.edit_data = angular.copy(Mock.roles_data);
                  });

                  describe('funders', function() {
                    beforeEach(function() {
                      ctrl.onCancel(3, 'funders');
                    });

                    it('should remove the funders entries which are without funder_id', function() {
                      expect(ctrl.edit_data[3]['funders'].length).toBe(3);
                    });
                  });

                  describe('cost_centers', function() {
                    beforeEach(function() {
                      ctrl.onCancel(3, 'cost_centers');
                    });

                    it('should remove the cost_centers entries which are without cost_centre_id', function() {
                      expect(ctrl.edit_data[3]['cost_centers'].length).toBe(2);
                    });
                  });

                  describe('both', function() {
                    beforeEach(function() {
                      ctrl.onCancel(3, 'both');
                    });

                    it('should remove the funders and cost_centers entries which are without id', function() {
                      expect(ctrl.edit_data[3]['cost_centers'].length).toBe(2);
                      expect(ctrl.edit_data[3]['funders'].length).toBe(3);
                    });
                  });
                });

                describe('Updating old revision dates', function(){

                });
            });

        });

        // Tests that needs to have control over the state prior
        // to the controller initialization
        describe('Initial state dependent tests', function () {
            var getContractsSpy, getAllJobRolesSpy, contracts, jobRoles;

            beforeEach(function () {
              contracts = _.toArray(angular.copy(Mock.contracts_data));
              jobRoles = _.toArray(angular.copy(Mock.roles_data));
            });

            beforeEach(function () {
              spyOn(HRJobRolesService, 'getContracts').and.callFake(function () {
                return fakeContractResponse(contracts);
              });
              spyOn(HRJobRolesService, 'getAllJobRoles').and.callFake(function () {
                return fakeJobRolesResponse(jobRoles);
              });
            });

            describe('Fetching Job Roles from contract', function () {
                describe('when the user does not have a contract', function () {
                    beforeEach(function () {
                      contracts = [];

                      initController();
                      $rootScope.$digest();
                    });

                    it('does not try to fetch any job role', function () {
                        expect(HRJobRolesService.getAllJobRoles).not.toHaveBeenCalled();
                    });
                });

                describe('when the user does have a contract', function () {
                    beforeEach(function () {
                      initController();
                      $rootScope.$digest();
                    });

                    it('fetches the job roles', function () {
                        expect(HRJobRolesService.getAllJobRoles).toHaveBeenCalledWith(contracts.map(function (contract) {
                            return contract.id;
                        }));
                    });

                    it('it separates past and present job roles', function () {
                      expect(ctrl.present_job_roles.length).toBe(2);
                      expect(ctrl.past_job_roles.length).toBe(2);
                    });
                });
            });

            describe('funders data', function () {
              var funderContactIds;

              beforeEach(function () {
                jobRoles = _.toArray(angular.copy(Mock.roles_data_from_api));

                spyOn(HRJobRolesService, 'getContactList').and.callThrough();
                initController();
                $rootScope.$digest();

                funderContactIds = extractFundersContactIds();
              });

              it('fetches the contact for each job role funder', function () {
                expect(HRJobRolesService.getContactList).toHaveBeenCalledWith(null, funderContactIds);
              });

              /**
               * Method that mimics how the controller extracts the ids
               *
               * @return {Array}
               */
              function extractFundersContactIds() {
                return _(ctrl.present_job_roles.concat(ctrl.past_job_roles))
                  .map(function (jobRole) {
                    return jobRole.funder;
                  })
                  .thru(function (funderIds) {
                    return funderIds.join('').split('|');
                  })
                  .compact()
                  .uniq()
                  .value();
              }
            });

            /**
             * Fakes the response that HRJobRolesService.getContracts() would get
             *
             * @param {Array} contracts
             * @return {Promise} resolves to the response
             */
            function fakeContractResponse(contracts) {
                var deferred = $q.defer();
                deferred.resolve({ count: contracts.length, values: contracts });

                return deferred.promise;
            }

            /**
             * Fakes the response that HRJobRolesService.getAllJobRoles() would get
             *
             * @param {Array} jobRoles
             * @return {Promise} resolves to the response
             */
            function fakeJobRolesResponse(jobRoles) {
                var deferred = $q.defer();
                deferred.resolve({ count: jobRoles.length, values: jobRoles });

                return deferred.promise;
            }
        });

        describe('When call updateRole passing a job contract with end date equals todays date', function() {
          beforeEach(function () {
            var todaysDate = moment().format('YYYY-MM-DD');

            spyOn(HRJobRolesService, 'getAllJobRoles').and.returnValue($q.resolve({
              values: [{
                title:"Test",
                id:"19",
                job_contract_id:"22",
                end_date:todaysDate,
                start_date:"2016-04-01 00:00:00",
              }],
            }));

            spyOn(HRJobRolesService, 'getContracts').and.returnValue($q.resolve({
              count:1,
              values: [{
                contact_id:"158",
                deleted:"0",
                id:"22",
                is_current:"1",
                period_end_date:"2016-08-31",
                period_start_date:"2916-04-01",
                revisions:[],
                title:"Test",
              }],
            }));

            initController();
            ctrl.edit_data = angular.copy(Mock.roles_data);
            $rootScope.$digest();
            ctrl.updateRole(1);
          });

          it('the present_job_roles.length should be 1', function() {
            expect(ctrl.present_job_roles.length).toBe(1);
          });
        });

        /**
         *
         *
         */
        function convertToDateObject(dateString) {
            return $filter('formatDate')(dateString, Date);
        }

        /**
         * Initializes the controller
         *
         * Sets the contact id on the fake parent ctrl
         */
        function initController() {
            scope = $rootScope.$new();
            settingsData = {
              "contactId": contactId
            };

            ctrl = $controller('HRJobRolesController', { $scope: scope, format: 'DD/MM/YYYY', settings: settingsData });
        }
    });
});
