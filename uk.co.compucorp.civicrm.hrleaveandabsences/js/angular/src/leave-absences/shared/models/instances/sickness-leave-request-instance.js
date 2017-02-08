define([
  'leave-absences/shared/modules/models-instances',
  'leave-absences/shared/models/instances/leave-request-instance',
], function (modelInstances) {
  'use strict';

  modelInstances.factory('SicknessRequestInstance', [
    'LeaveRequestAPI',
    'LeaveRequestInstance',
    function (LeaveRequestAPI, LeaveRequestInstance) {
      return LeaveRequestInstance.extend({

        /**
         * Create a new sickness request
         *
         * @return {Promise} Resolved with {Object} Created Leave request with
         *  newly created id for this instance
         */
        create: function () {
          return LeaveRequestAPI.create(this.toAPI(), 'sick')
            .then(function (result) {
              this.id = result.id;
            }.bind(this));
        },

        /**
         * Validate sickness request instance attributes.
         *
         * @return {Promise} empty array if no error found otherwise an object
         *  with is_error set and array of errors
         */
        isValid: function () {
          return LeaveRequestAPI.isValid(this.toAPI(), 'sick');
        },

        /**
         * Update a sickness request
         *
         * @return {Promise} Resolved with {Object} Updated sickness request
         */
        update: function () {
          return LeaveRequestAPI.update(this.toAPI(), 'sick');
        }
      });
    }
  ]);
});