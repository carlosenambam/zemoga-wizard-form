<?php
/**
 * Zemoga Wizard Form AJAX handler
 *
 * @package ZWF
 */

require 'class-zwf-user.php';

/**
 * Ajax handler
 */
class ZWFAJAX {

	/**
	 * Add the action hooks for every AJAX call
	 */
	public static function init() {
		add_action( 'wp_ajax_process_data', array( self::class, 'process_data' ) );
		add_action( 'wp_ajax_nopriv_process_data', array( self::class, 'process_data' ) );
	}

	/**
	 * Check if a string is formatted as a date (yyyy-mm-dd)
	 *
	 * @param  string $str string to be checked.
	 * @return boolean     true if $str is formatted as a date, otherwise false.
	 */
	public static function check_date( $str ) {
		if ( preg_match( '/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/', $str ) ) {
			try {
				new \DateTime( $str );
				return true;
			} catch ( \Exception $e ) {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Saves the data from the step one
	 *
	 * @throws Exception If $_POST['step'] is not defined.
	 */
	public static function process_data() {
		check_ajax_referer( 'zemoga_wizard_form', 'nonce', false );

		// Zemoga User Data.
		$user_data = array();

		// Validations.
		if ( ! isset( $_POST['step'] ) ) {
			throw new Exception( 'System Error: step param is missing', 1 );
		}

		$errors = array(
			'type'     => 'error',
			'messages' => array(),
		);

		$fields_to_check = array();

		$step = sanitize_text_field( wp_unslash( $_POST['step'] ) );

		if ( '1' === $step ) {
			$fields_to_check = array(
				'zwf_first_name',
				'zwf_last_name',
				'zwf_gender',
				'zwf_birth_date',
			);
		} elseif ( '2' === $step ) {
			$fields_to_check = array(
				'zwf_city',
				'zwf_phone_number',
				'zwf_address',
			);
		}

		foreach ( $fields_to_check as $field ) {
			if ( ! isset( $_POST[ $field ] ) ) {
				$errors['messages'][ $field ] = 'This field is required';
			} else {
				$field_value = trim( $_POST[ $field ] );

				$db_column = str_replace( 'zwf_', '', $field );

				$user_data[ $db_column ] = sanitize_text_field( wp_unslash( $field_value ) );
				switch ( $field ) {
					case 'zwf_gender':
						if ( 'M' !== $field_value && 'F' !== $field_value ) {
							$errors['messages'][ $field ] = 'Invalid gender';
						}
						break;

					case 'zwf_birth_date':
						if ( ! self::check_date( $field_value ) ) {
							$errors['messages'][ $field ] = 'Invalid date';
						}
						break;
					case 'zwf_phone_number':
						if ( ! ctype_digit( $field_value ) ) {
							$errors['messages'][ $field ] = 'This has to be numeric';
						}
						break;

					default:
						if ( ! $field_value ) {
							$errors['messages'][ $field ] = 'This field is required';
						}
						break;
				}
			}
		}

		if ( ! empty( $errors['messages'] ) ) {
			wp_send_json( $errors );
		}
		// if this variable is equals to 0, then a new User is created in the database.
		$user_id = 0;

		if ( isset( $_POST['user_id'] ) ) {
			if ( $_POST['user_id'] ) {
				$user_id = intval( $_POST['user_id'] );
			}
		}

		$zemoga_user = new ZWFUser( $user_id );
		$zemoga_user->set_data( $user_data );
		$zemoga_user->save();

		wp_send_json(
			array(
				'type'    => 'success',
				'user_id' => $zemoga_user->get( 'id' ),
			)
		);
	}
}
