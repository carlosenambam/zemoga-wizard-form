<?php
/**
 * Zemoga Wizard Form Shortcode
 *
 * @package ZWF
 */

/**
 * ZWF Shortcode
 */
class ZWFShortcode {

	/**
	 * Add the shortcode and enqueue the scripts and styles
	 */
	public static function init() {
		add_shortcode( 'zwf', array( self::class, 'html_output' ) );
	}

	/**
	 * Shortcode Output
	 *
	 * @return string HTML code for the shortcode.
	 */
	public static function html_output() {
		// This is enqueued only when the shortcode is showing.
		wp_enqueue_script( 'jquery-ui-datepicker' );
		wp_enqueue_script( 'sweetalert', 'https://cdn.jsdelivr.net/npm/sweetalert2@8', array(), ZWF_VERSION, true );
		wp_enqueue_script( 'zwf-scripts', ZMF_URL . 'assets/js/zwf-scripts.js', array( 'jquery', 'jquery-ui-datepicker' ), ZWF_VERSION, true );

		wp_localize_script(
			'zwf-scripts',
			'zwf_vars',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'zemoga_wizard_form' ),
			)
		);

		wp_enqueue_style( 'jquery-ui-styles', ZMF_URL . 'assets/css/jquery-ui.min.css', array(), ZWF_VERSION );
		wp_enqueue_style( 'zwf-styles', ZMF_URL . 'assets/css/zwf-styles.css', array( 'jquery-ui-styles' ), ZWF_VERSION );
		ob_start(); // Start the buffer.
		?>
		<div class="zwf_container">
			<p class="zwf_steps">Step 1 of 2</p>
			<div class="zwf_fields">
				<div id="step1">
					<div class="zwf_field_group">
						<div class="zwf_field" data-field="zwf_first_name">
							<label for="zwf_first_name">First name</label>
							<input type="text" name="zwf_first_name" id="zwf_first_name" required>
						</div>
						<div class="zwf_field" data-field="zwf_last_name">
							<label for="zwf_last_name">Last name</label>
							<input type="text" name="zwf_last_name" id="zwf_last_name" required>
						</div>
					</div>
					<div class="zwf_field" data-field="zwf_gender">
						<label for="zwf_gender">Gender</label>
						<select name="zwf_gender" id="zwf_gender">
							<option value="M">Male</option>
							<option value="F">Female</option>
						</select>
					</div>
					<div class="zwf_field" data-field="zwf_birth_date">
						<label for="zwf_birth_date">Birth date</label>
						<input type="text" name="zwf_birth_date" id="zwf_birth_date">
					</div>
				</div>

				<div class="hide" id="step2">
					<div class="zwf_field" data-field="zwf_city">
						<label for="zwf_city">City</label>
						<input type="text" name="zwf_city" id="zwf_city">
					</div>
					<div class="zwf_field" data-field="zwf_phone_number">
						<label for="zwf_phone_number">Phone Number</label>
						<input type="tel" name="zwf_phone_number" id="zwf_phone_number">
					</div>
					<div class="zwf_field" data-field="zwf_address">
						<label for="zwf_address">Address</label>
						<input type="text" name="zwf_address" id="zwf_address">
					</div>
				</div>

			</div>
			<div class="zwf_buttons">
				<button class="hide" id="back">Back</button>
				<button id="next">Next</button>
			</div>
		</div>
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		return $html;
	}
}
