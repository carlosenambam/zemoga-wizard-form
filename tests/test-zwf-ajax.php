<?php
/**
 * Class SampleTest
 *
 * @package Zemoga_Wizard_Form
 */

/**
 * Sample test case.
 */
class TestZWFAJAX extends WP_UnitTestCase {

	/**
	 * Test the check_date method
	 *
	 * @return void
	 */
	public function test_check_date_method() {
		$valid_date = '2012-07-10';
		$this->assertTrue( ZWFAJAX::check_date( $valid_date ) );
		$invalid_date = 'asdasdasdsad';
		$this->assertFalse( ZWFAJAX::check_date( $invalid_date ) );
		$invalid_date = '20123-07-10';
		$this->assertFalse( ZWFAJAX::check_date( $invalid_date ) );
	}
}
