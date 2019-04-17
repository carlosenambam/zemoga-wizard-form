<?php
/**
 * Class TestZemogaWizardForm
 *
 * @package Zemoga_Wizard_Form
 */

/**
 * Tests for Zemoga Wizard Form
 */
class TestZemogaWizardForm extends WP_UnitTestCase {

	/**
	 * An instance of ZWF
	 *
	 * @var ZWF
	 */
	private $zwf;

	/**
	 * Remove the filter for temporary tables
	 *
	 * @return void
	 */
	public function setup() {
		parent::setup();
		$this->zwf = new ZWF();
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
	 * A single example test.
	 */
	public function test_register_activation_hook() {
		$this->assertTrue( has_action( 'activate_' . plugin_basename( $this->zwf->plugin_file ), array( $this->zwf, 'zwf_activation' ) ) ? true : false );
	}

	/**
	 * Test if ZWAJAX and ZWFShortcode are included
	 *
	 * @return void
	 */
	public function test_ZWFAJAX_and_ZWFShortcode_are_declared() {
		$this->assertTrue( class_exists( 'ZWFAJAX' ) );
		$this->assertTrue( class_exists( 'ZWFShortcode' ) );
	}

	/**
	 * Test if the hooks for ajax calls are added
	 */
	public function test_ajax_hooks_are_added() {
		$this->assertTrue( has_action( 'wp_ajax_process_data', array( 'ZWFAJAX', 'process_data' ) ) ? true : false );
		$this->assertTrue( has_action( 'wp_ajax_nopriv_process_data', array( 'ZWFAJAX', 'process_data' ) ) ? true : false );
	}

	/**
	 * Test if the shortcode is added
	 *
	 * @return void
	 */
	public function test_shortcode_is_added() {
		global $shortcode_tags;
		$this->assertArrayHasKey( 'zwf', $shortcode_tags );
		$this->assertSame( 'ZWFShortcode', $shortcode_tags['zwf'][0] );
		$this->assertSame( 'html_output', $shortcode_tags['zwf'][1] );
	}

	/**
	 * Test if the zemoga_users table is created in the database
	 *
	 * @return void
	 */
	public function test_zemoga_users_table_is_created_in_the_database() { // https://wordpress.stackexchange.com/questions/220275/wordpress-unit-testing-cannot-create-tables
		global $wpdb;

		$zwf = new ZWF();
		$zwf->zwf_activation();
		$table_name = $wpdb->prefix . 'zemoga_users';
		$this->assertSame( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ), $table_name );
	}
}
