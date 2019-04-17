<?php
/**
 * Plugin Name: Zemoga Wizard Form
 * Description: A Wizard form for Zemoga
 * Author: Carlos Alvarez
 * Version: 1.0.0
 *
 * @package ZWF
 */

if ( ! defined( 'ABSPATH' ) ) { // Prevents direct access to this file.
	exit;
}

define( 'ZMF_PATH', plugin_dir_path( __FILE__ ) );
define( 'ZMF_URL', plugin_dir_url( __FILE__ ) );
define( 'ZWF_VERSION', '1.0.0' );

/**
 * Plugin Main Class
 */
class ZWF {

	/**
	 * Plugin File Path
	 *
	 * @var string
	 */
	public $plugin_file = __FILE__;

	/**
	 * Register the activation hook
	 */
	public function __construct() {
		register_activation_hook( __FILE__, array( $this, 'zwf_activation' ) );
		if ( ! class_exists( 'ZWFAJAX' ) ) {
			require 'includes/class-zwf-ajax.php';
		}

		if ( ! class_exists( 'ZWFShortcode' ) ) {
			require 'includes/class-zwf-shortcode.php';
		}

		ZWFAJAX::init();
		ZWFShortcode::init();
	}


	/**
	 * The zemoga users table is created.
	 */
	public function zwf_activation() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'zemoga_users';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) !== $table_name ) {
			$charset_collate = $wpdb->get_charset_collate();

			$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			  id INT NOT NULL AUTO_INCREMENT,
			  first_name VARCHAR(45),
			  last_name VARCHAR(45),
			  birth_date DATE,
			  gender VARCHAR(45),
			  city VARCHAR(45),
			  phone_number VARCHAR(45),
			  address VARCHAR(45),
			  PRIMARY KEY (`id`));";

			require_once ABSPATH . 'wp-admin/includes/upgrade.php';
			dbDelta( $sql );
		}
	}
}

new ZWF();
