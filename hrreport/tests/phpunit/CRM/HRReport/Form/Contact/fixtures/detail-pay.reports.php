<?php
// Return a list of report test cases
return array(
  //testCase with hrjob_pay filters
  array(
    'CRM_HRReport_Form_Contact_HRDetail',
    array(
      'fields' => array(
        'sort_name',
        'email',
        'hrjob_position',
        'hrjob_pay_grade',
        'hrjob_pay_amount',
        'hrjob_pay_unit',
        'hrjob_pay_currency',
        'hrjob_pay_annualized_est',
      ),
      'filters' => array(
        'hrjob_pay_grade_op' => 'in',
        'hrjob_pay_grade_value' => 'unpaid,paid',
        'hrjob_pay_amount_op' => 'gt',
        'hrjob_pay_amount_value' => 35,
        'hrjob_pay_unit_op' => 'notin',
        'hrjob_pay_unit_value' => 'Week',
      ),
    ),
    'fixtures/dataset-detail.sql',
    'fixtures/detail-pay.csv',
  )
);
