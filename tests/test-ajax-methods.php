<?php
/**
 * Class TestZemogaAJAX
 *
 * @group ajax
 * @runTestsInSeparateProcesses
 */
class TestZemogaAJAX extends WP_Ajax_UnitTestCase {

	/**
	 * Remove the filter for temporary tables
	 *
	 * @return void
	 */
	public function setup() {
		parent::setup();
		remove_filter( 'query', array( $this, '_create_temporary_tables' ) );
		remove_filter( 'query', array( $this, '_drop_temporary_tables' ) );
	}

	/**
	 * Delete the zemoga_users table from test database
	 *
	 * @return void
	 */
	public function tearDown() {
		parent::tearDown();

		global $wpdb;
		$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}zemoga_users");
	}

	/**
	 * Test the process data method from ZWFAJAX when the data is valid when step = 1
	 *
	 * @return void
	 */
	public function test_process_data_from_ZWFAJAX_when_valid_data_step1() {
		$_POST['step']           = '1';
		$_POST['zwf_first_name'] = 'Carlos';
		$_POST['zwf_last_name']  = 'Alvarez';
		$_POST['zwf_gender']     = 'M';
		$_POST['zwf_birth_date'] = '1991-09-20';
		$_POST['nonce']          = wp_create_nonce( 'zemoga_wizard_form' );

		$zf = new ZWF();
		$zf->zwf_activation();
		try {
			wp_set_current_user( 1 );
			$this->_handleAjax( 'process_data' );
		} catch ( WPAjaxDieContinueException $e ) {}
		$this->assertTrue( isset( $this->_last_response ) );
		$response = json_decode( $this->_last_response );
		$this->assertTrue( isset( $response->type ) );
		$this->assertTrue( isset( $response->user_id ) );
		$this->assertSame( 'success', $response->type );
		$this->assertRegExp( '/^[1-9]+$/', $response->user_id );
	}

	/**
	 * Test the process data method from ZWFAJAX when the data is valid when step = 2
	 *
	 * @return void
	 */
	public function test_process_data_from_ZWFAJAX_when_valid_data_step2() {

		$zf = new ZWF();
		$zf->zwf_activation();

		$z_user = new ZWFUser();

		$user_data = array(
			'zwf_first_name' => 'Carlos',
			'zwf_last_name'  => 'Alvarez',
			'zwf_gender'     => 'M',
			'zwf_birth_date' => '1991-09-20',
		);

		$z_user->save();
		$user_id = $z_user->get( 'id' );

		$_POST['step']             = '2';
		$_POST['zwf_city']         = 'Medellin';
		$_POST['zwf_phone_number'] = '8392910';
		$_POST['zwf_address']      = 'M';
		$_POST['user_id']          = $user_id;
		$_POST['nonce']            = wp_create_nonce( 'zemoga_wizard_form' );

		try {
			wp_set_current_user( 1 );
			$this->_handleAjax( 'process_data' );
		} catch ( WPAjaxDieContinueException $e ) {}
		$this->assertTrue( isset( $this->_last_response ) );
		$response = json_decode( $this->_last_response );
		$this->assertTrue( isset( $response->type ) );
		$this->assertTrue( isset( $response->user_id ) );
		$this->assertSame( 'success', $response->type );
		$this->assertRegExp( '/^[1-9]+$/', $response->user_id );
		$this->assertSame( $response->user_id, $user_id );
	}

}
