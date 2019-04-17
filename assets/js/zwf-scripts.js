jQuery(document).ready(function($) {
  var step = 1;
  var userId = 0; // From the database.
  $('.zwf_container #zwf_birth_date').datepicker( {
    dateFormat: 'yy-mm-dd',
  });

  /**
   * Check if a string only have digits.
   * @param  {string}  str String to be checked.
   * @return {Boolean}     true if the string only have digits, otherwise false.
   */
  function isNumeric(str) {
    return /^\d+$/.test(str);
  }

  /**
   * Check if a string is formatted as a date (yyyy-dd-mm)
   * @param  {string}  dateString string to be checked
   * @return {Boolean}            true if dateString is
   * formatted as a date, otherwise false.
   */
  function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;// Invalid format
    var d = new Date(dateString);
    if ( Number.isNaN(d.getTime()) ) return false;// Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  }

  /**
   * Show errors for every form field
   * @param {Object} messages An Object containing
   * the error messages for every field
   */
  function showErrors( messages ) {
    Object.keys(messages).forEach( function(field) {
      $('[data-field="' + field + '"] .field_error').remove();
      $('#'+field )
          .after('<p class="field_error">' + messages[field] + '</p>');
    });
  }

  /**
   * Move the form to the next step
   */
  function nextStep() {
    if ( step == 2 ) {
      Swal.fire({
        title: 'Thank you for registering to Zemoga!',
        text: 'Your account has been created successfully!',
        type: 'success',
        showConfirmButton: false,
      });
      $('#step1').removeClass('hide');
      $('#step2').addClass('hide');
      $('.zwf_container input').val('');
      step = 1;
      userId = 0;
      $('.zwf_container .zwf_steps').html('Step 1 of 2');
      $('.zwf_container #next').html('Next');
      $('.zwf_container #back').addClass('hide');
    } else {
      $('.zwf_container #back').removeClass('hide');
      $('.zwf_container #next').html('Sign Up');
      $('#step' + step).addClass('hide');
      step++;
      $('#step' + step).removeClass('hide');
      $('.zwf_container .zwf_steps').html('Step ' + step + ' of 2');
    }
  }

  // Back Button
  $('.zwf_container #back').click(function(e) {
    e.preventDefault();
    if ( step == 1 ) {
      return;
    }

    $('#step' + step).addClass('hide');
    step--;
    $('#step' + step).removeClass('hide');

    if ( step == 1) {
      $(this).addClass('hide');
      $('.zwf_container #next').html('Next');
    }
  });

  // Next Button
  $('.zwf_container #next').click(function(e) {
    e.preventDefault();

    var formData = {};

    // Validations.
    var formFields = $('.zwf_container #step' + step + ' [id^="zwf_"]');

    var errorMessages = {};

    formFields.each( function() {
      var name = $(this).attr('name');
      var value = $(this).val();

      formData[name] = value;

      $('[data-field="' + name + '"] .field_error').remove();
      if ( ! value ) {
        errorMessages[name] = 'This field is required';
      } else if ( 'zwf_phone_number' == name &&
        !isNumeric(value) ) {
        errorMessages[name] = 'This has to be a number';
      } else if ( 'zwf_gender' == name &&
        ( 'M' != value && 'F' != value ) ) {
        errorMessages[name] = 'Invalid gender';
      } else if ( 'zwf_birth_date' == name &&
        !isValidDate(value) ) {
        errorMessages[name] = 'Invalid date';
      }
    });

    showErrors(errorMessages);

    // Check if there are errors
    if ( $('.zwf_container .field_error').length > 0 ) {
      return;
    }

    // Test Cases

    //formData['zwf_first_name'] = 'Carlos';
    //formData['zwf_last_name'] = 'Alvarez';
    //formData['zwf_gender'] = 'M';
    //formData['zwf_birth_date'] = '1991-09-20';
    //formData['zwf_city'] = 'Medellin';
    //formData['zwf_phone_number'] = '3145135';
    //formData['zwf_address'] = 'Cra 30A #100';

    formData['step'] = step;
    if ( userId ) {
      formData['user_id'] = userId;
    }
    formData['action'] = 'process_data';
    formData['nonce'] = zwf_vars.nonce;

    // Send form data to the server
    $.ajax({
      url: zwf_vars.ajax_url,
      type: 'post',
      data: formData,
      dateType: 'json',
      success: function(response) {
        if ( 'error' == response.type ) {
          var messages = response.messages;

          showErrors(messages);
        } else if ( 'success' == response.type ) {
          // The user ID from the database
          userId = response.user_id;
          nextStep();
        }
      },
      error: function(e, r) {
        console.log(r);
        alert('System Error');
      },
    });
  });
});
