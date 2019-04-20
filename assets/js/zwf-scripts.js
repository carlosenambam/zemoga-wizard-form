const $ = jQuery;
let step = 1; // Form step
let userId = 0; // From the database.

/**
 * Check if a string is formatted as a date (yyyy-dd-mm)
 * @param  {string}  dateString string to be checked
 * @return {Boolean}            true if dateString is
 * formatted as a date, otherwise false.
 */
function isValidDate(dateString) {
  const trimmedDate = dateString.trim();
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!trimmedDate.match(regEx)) return false;// Invalid format
  const d = new Date(trimmedDate);
  if (Number.isNaN(d.getTime())) return false;// Invalid date
  return d.toISOString().slice(0, 10) === trimmedDate;
}

/**
 * Check if a string only have digits.
 * @param  {string}  str String to be checked.
 * @return {Boolean}     true if the string only have digits, otherwise false.
 */
function isNumeric(str) {
  return /^\d+$/.test(str);
}

/**
 * Runs when the back button is clicked
 */
function onBack() {
  if (step === 1) {
    $('.zwf_container #back').addClass('hide');
    $('.zwf_container #next').html('Next');
    return;
  }

  $(`#step${step}`).addClass('hide');
  step -= 1;
  $(`#step${step}`).removeClass('hide');
}

/**
 * Show errors for every form field
 * @param {Object} messages An Object containing
 * the error messages for every field
 */
function showErrors(messages) {
  Object.keys(messages).forEach((field) => {
    $(`[data-field="${field}"] .field_error`).remove();
    $(`#${field}`).after(`<p class="field_error">${messages[field]}</p>`);
  });
}

/**
 * Move the form to the next step
 */
function nextStep() {
  if (step === 2) {
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
    $(`#step${step}`).addClass('hide');
    step += 1;
    $(`#step${step}`).removeClass('hide');
    $('.zwf_container .zwf_steps').html(`Step ${step} of 2`);
  }
}

/**
 * Validates one field of the form
 * @param {String} name Name of the field
 * @param {String} value Value of the field
 * @returns {String} the error message for the field.
 */
function validateField(name, value) {
  let message = '';

  if (!value) {
    message = 'This field is required';
  } else if ('zwf_phone_number' === name
    && !isNumeric(value)) {
    message = 'This has to be a number';
  } else if ('zwf_gender' == name 
    && ('M' != value && 'F' != value)) {
    message = 'Invalid gender';
  } else if ('zwf_birth_date' === name
  && !isValidDate(value)) {
    message = 'Invalid date';
  }

  return message;
}

/**
 * Get the form Data for the ajax call,
 * if the validations fails, then it returns an
 * object containing the error messages
 * @param {object} formFields jQuery object containing the form fields
 * @throws errorMessages when validations fail
 */
function getFormData(formFields) {
  const formData = {};

  const errorMessages = {};
  let errormessage;
  formFields.each((index, field) => {
    const name = $(field).attr('name');
    const value = $(field).val();
    formData[name] = value;
    $(`[data-field="${name}"] .field_error`).remove();
    errormessage = validateField(name, value);
    if (errormessage) {
      errorMessages[name] = errormessage;
    }
  });

  if (!$.isEmptyObject(errorMessages)) {
    throw errorMessages;
  }

  formData.step = step;
  if (userId) {
    formData.user_id = userId;
  }
  formData.action = 'process_data';
  formData.nonce = zwf_vars.nonce;

  return formData;
}

/**
 * Send form data to the server using AJAX
 * @param {object} formData Data to send to the server
 * @param {string} url url for the ajax call
 */
async function sendData(formData, url) {
  // Send form data to the server
  try {
    const response = await $.ajax({
      url,
      type: 'post',
      data: formData,
      dateType: 'json',
    });
    if ('error' === response.type) {
      const { messages } = response;

      showErrors(messages);
    } else if ('success' === response.type) {
      // The user ID from the database
      userId = response.user_id;
      nextStep();
    }

    return response;
  } catch (error) {
    console.log(error);
    alert('System Error');
    return false;
  }
}

/**
 * Runs when the next button is clicked
 */
function onNext() {
  // Validations.
  const formFields = $(`.zwf_container #step${step} [id^="zwf_"]`);

  let formData = {};

  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    showErrors(errorMessages);
    return;
  }
  sendData(formData, zwf_vars.ajax_url);
}

/**
 * This function is run when the DOM is ready
 */
function onready() {
  $('.zwf_container #zwf_birth_date').datepicker({
    dateFormat: 'yy-mm-dd',
  });

  // Back Button
  $('.zwf_container #back').click((e) => {
    e.preventDefault();
    onBack();
  });

  // Next Button
  $('.zwf_container #next').click((e) => {
    e.preventDefault();
    onNext();
  });
}

$(document).ready(onready);
