define([
    'common/angularMocks',
    'common/models/option-group',
    'common/mocks/services/api/option-group-mock'
], function () {
    'use strict';

    describe('OptionGroup', function () {
        var $provide, $rootScope, OptionGroup, optionGroupAPI, optionGroups;

        beforeEach(function () {
            module('common.models', 'common.mocks', function (_$provide_) {
                $provide = _$provide_;
            });
            // Override api.optionGroup with the mocked version
            inject(['api.optionGroup.mock', function (_optionGroupAPIMock_) {
                $provide.value('api.optionGroup', _optionGroupAPIMock_);
            }]);
        });

        beforeEach(inject([
            '$rootScope', 'OptionGroup', 'api.optionGroup',
            function (_$rootScope_, _OptionGroup_, _optionGroupAPI_) {
                $rootScope = _$rootScope_;

                OptionGroup = _OptionGroup_;
                optionGroupAPI = _optionGroupAPI_;

                optionGroupAPI.spyOnMethods();
                optionGroups = optionGroupAPI.mockedOptionValues();
            }
        ]));

        it('has the expected api', function () {
            expect(Object.keys(OptionGroup)).toEqual(['valuesOf']);
        });

        describe('valuesOf()', function () {
            beforeEach(function () {
                OptionGroup.valuesOf('hrjc_department');
            });

            it('calls the correct API method', function () {
                expect(optionGroupAPI.valuesOf).toHaveBeenCalled();
            });
        });
    });
});
