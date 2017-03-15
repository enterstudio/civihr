<?php

use CRM_Hrjobcontract_Test_Fabricator_HRPayScale as PayScaleFabricator;

/**
 * Class CRM_HRSampleData_Cleaner_HRPayScaleTest
 *
 * @group headless
 */
class CRM_HRSampleData_Cleaner_HRPayScaleTest extends CRM_HRSampleData_BaseCSVProcessorTest {

  public function setUp() {
    $this->rows = [];
    $this->rows[] = $this->importHeadersFixture();
  }

  public function testProcess() {
    $payScale = PayScaleFabricator::fabricate();
    $testPayScale = $this->apiGet('HRPayScale', ['pay_scale' => $payScale['pay_scale']]);
    $this->assertEquals($payScale['pay_scale'], $testPayScale['pay_scale']);

    $this->rows[] = [
      $payScale['pay_scale'],
      'USD',
      '35000',
      'Year',
    ];

    $this->runProcessor('CRM_HRSampleData_Cleaner_HRPayScale', $this->rows);

    $payScale = $this->apiGet('HRPayScale', ['pay_scale' => $payScale['pay_scale']]);
    $this->assertEmpty($payScale);
  }

  private function importHeadersFixture() {
    return [
      'pay_scale',
      'currency',
      'amount',
      'periodicity',
    ];
  }

}
