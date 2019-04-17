<?php
/**
 * This file contains the Zemoga User Class
 *
 * @package ZWF
 */

/**
 * Zemoga User Class
 */
class ZWFUser {

	/**
	 * Zemoga user data
	 *
	 * @var array
	 */
	private $zwf_user_data = array(
		'id'           => 0,
		'first_name'   => null,
		'last_name'    => null,
		'gender'       => null,
		'birth_date'   => null,
		'city'         => null,
		'phone_number' => null,
		'address'      => null,
	);

	/**
	 * Zemoga users table name
	 *
	 * @var string
	 */
	private $users_table = '';

	/**
	 * Initializes the user data.
	 *
	 * @param integer $zw_user_id Zemoga User ID.
	 * @throws Exception If an User with id = $zw_user_id is not found.
	 */
	public function __construct( $zw_user_id = 0 ) {
		global $wpdb;
		$this->users_table = $wpdb->prefix . 'zemoga_users';
		if ( $zw_user_id ) {
			$user_row = $wpdb->get_row(
				'SELECT * FROM ' . $this->users_table . ' WHERE id = ' . $zw_user_id
			);

			if ( $user_row ) {
				$this->zwf_user_data['id']           = $zw_user_id;
				$this->zwf_user_data['first_name']   = $user_row->first_name;
				$this->zwf_user_data['last_name']    = $user_row->last_name;
				$this->zwf_user_data['gender']       = $user_row->gender;
				$this->zwf_user_data['birth_date']   = $user_row->birth_date;
				$this->zwf_user_data['city']         = $user_row->city;
				$this->zwf_user_data['phone_number'] = $user_row->phone_number;
				$this->zwf_user_data['address']      = $user_row->address;
			} else {
				throw new Exception( 'Invalid Zemoga user', 1 );
			}
		} else {
			$this->zwf_user_data['id'] = 0;
		}
	}

	/**
	 * Set data to the Zemoga user
	 *
	 * @param array $data Array containing the user data.
	 */
	public function set_data( $data ) {
		if ( isset( $data['first_name'] ) ) {
			$this->zwf_user_data['first_name'] = strval( $data['first_name'] );
		}

		if ( isset( $data['last_name'] ) ) {
			$this->zwf_user_data['last_name'] = strval( $data['last_name'] );
		}

		if ( isset( $data['gender'] ) ) {
			$this->zwf_user_data['gender'] = strval( $data['gender'] );
		}

		if ( isset( $data['birth_date'] ) ) {
			$this->zwf_user_data['birth_date'] = strval( $data['birth_date'] );
		}

		if ( isset( $data['city'] ) ) {
			$this->zwf_user_data['city'] = strval( $data['city'] );
		}

		if ( isset( $data['phone_number'] ) ) {
			$this->zwf_user_data['phone_number'] = strval( $data['phone_number'] );
		}

		if ( isset( $data['address'] ) ) {
			$this->zwf_user_data['address'] = strval( $data['address'] );
		}
	}

	/**
	 * Save the user in the database.
	 */
	public function save() {
		global $wpdb;
		if ( $this->zwf_user_data['id'] ) {

			$wpdb->update(
				$this->users_table,
				$this->zwf_user_data,
				array(
					'id' => $this->zwf_user_data['id'],
				)
			);

		} else {
			$wpdb->insert( $this->users_table, $this->zwf_user_data );
			$this->zwf_user_data['id'] = $wpdb->insert_id;
		}
	}

	/**
	 * Get an Zemoga user attribute given an attribute name,
	 * if the attribute name is empty, all user data is returned.
	 * If the attribute name doesn't correspond to a user attribute
	 * then this method returns false
	 *
	 * @param  string $attr_name Attribute name.
	 * @return mixed            Value of the attribute.
	 */
	public function get( $attr_name = '' ) {
		if ( $attr_name ) {
			if ( ! isset( $this->zwf_user_data[ $attr_name ] ) ) {
				return false;
			}
			return $this->zwf_user_data[ $attr_name ];
		} else {
			return $this->zwf_user_data;
		}
	}
}
