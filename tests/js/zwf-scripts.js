// Test Cases

// formData['zwf_first_name'] = 'Carlos';
// formData['zwf_last_name'] = 'Alvarez';
// formData['zwf_gender'] = 'M';
// formData['zwf_birth_date'] = '1991-09-20';
// formData['zwf_city'] = 'Medellin';
// formData['zwf_phone_number'] = '3145135';
// formData['zwf_address'] = 'Cra 30A #100';

$.fn.isAfter = sel => this.prevAll(sel).length !== 0;
$.fn.isBefore = sel => this.nextAll(sel).length !== 0;

///////////////////////////////////////////////////////////////

QUnit.module('isValidDate function');
let date;
QUnit.test('Date format is correct', (assert) => {
  date = '1992-09-20';
  assert.ok(isValidDate(date));
});

QUnit.test('Date with day in the middle (yyyy-dd-mm)', (assert) => {
  date = '1992-20-09';
  assert.notOk(isValidDate(date));
});

QUnit.test('Date is a set of random chars', (assert) => {
  date = 'asdasdasdasdasd';
  assert.notOk(isValidDate(date));
});

QUnit.test('Date with an extra char', (assert) => {
  date = '1991-0900-20';
  assert.notOk(isValidDate(date));
});

QUnit.test('Date with an extra hyphen', (assert) => {
  date = '1991-09--20';
  assert.notOk(isValidDate(date));
});

QUnit.test('Date with untrimmed spaces', (assert) => {
  date = '1991-09-20 ';
  assert.ok(isValidDate(date));
});

QUnit.test('Date with reverse order', (assert) => {
  date = '20-09-1991';
  assert.notOk(isValidDate(date));
});

///////////////////////////////////////////////////////////////

QUnit.module('onBack function');

QUnit.test('step = 1', (assert) => {
  onBack();
  assert.ok($('.zwf_container #back').hasClass('hide'));
  assert.notOk($(`#step${step}`).hasClass('hide'));
  assert.equal(step, 1);
  assert.equal($('.zwf_container #next').html(), 'Next');
});

QUnit.test('step = 2', (assert) => {
  let auxStep = step;
  step = 2;
  onBack();
  assert.equal(step, 1);
  assert.notOk($(`#step${step}`).hasClass('hide'));
  assert.ok($('#step2').hasClass('hide'));
  step = auxStep;
});

///////////////////////////////////////////////////////////////

QUnit.module('showErrors function', {
  afterEach: () => {
    $('.zwf_fields .field_error').remove();
  },
});

QUnit.test('all fields are invalid', (assert) => {
  const errorMessages = {
    zwf_birth_date: 'This field is required',
    zwf_first_name: 'This field is required',
    zwf_last_name: 'This field is required',
    zwf_gender: 'Invalid Gender',
    zwf_city: 'This field is required',
    zwf_phone_number: 'This field is required',
    zwf_address: 'This field is required',
  };
  showErrors(errorMessages);
  assert.equal($('#zwf_birth_date').next().attr('class'), 'field_error');
  assert.equal($('#zwf_birth_date').next().html(), 'This field is required');

  assert.equal($('#zwf_first_name').next().attr('class'), 'field_error');
  assert.equal($('#zwf_first_name').next().html(), 'This field is required');

  assert.equal($('#zwf_last_name').next().attr('class'), 'field_error');
  assert.equal($('#zwf_last_name').next().html(), 'This field is required');

  assert.equal($('#zwf_gender').next().attr('class'), 'field_error');
  assert.equal($('#zwf_gender').next().html(), 'Invalid Gender');

  assert.equal($('#zwf_city').next().attr('class'), 'field_error');
  assert.equal($('#zwf_city').next().html(), 'This field is required');

  assert.equal($('#zwf_phone_number').next().attr('class'), 'field_error');
  assert.equal($('#zwf_phone_number').next().html(), 'This field is required');

  assert.equal($('#zwf_address').next().attr('class'), 'field_error');
  assert.equal($('#zwf_address').next().html(), 'This field is required');
});

QUnit.test('some fields are invalid', (assert) => {
  const errorMessages = {
    zwf_birth_date: 'This field is required',
    zwf_gender: 'Invalid Gender',
  };
  showErrors(errorMessages);
  assert.equal($('#zwf_birth_date').next().attr('class'), 'field_error');
  assert.equal($('#zwf_birth_date').next().html(), 'This field is required');

  assert.notEqual($('#zwf_first_name').next().attr('class'), 'field_error');

  assert.notEqual($('#zwf_last_name').next().attr('class'), 'field_error');

  assert.notEqual($('#zwf_address').next().attr('class'), 'field_error');

  assert.notEqual($('#zwf_phone_number').next().attr('class'), 'field_error');

  assert.notEqual($('#zwf_city').next().attr('class'), 'field_error');

  assert.equal($('#zwf_gender').next().attr('class'), 'field_error');
  assert.equal($('#zwf_gender').next().html(), 'Invalid Gender');
});

QUnit.test('All fields are valid', (assert) => {
  const errorMessages = {};
  showErrors(errorMessages);
  assert.notEqual($('#zwf_first_name').next().attr('class'), 'field_error');
  assert.notEqual($('#zwf_last_name').next().attr('class'), 'field_error');
  assert.notEqual($('#zwf_birth_date').next().attr('class'), 'field_error');
  assert.notEqual($('#zwf_gender').next().attr('class'), 'field_error');
  assert.notEqual($('#zwf_city').next().attr('class'), 'field_error');
  assert.notEqual($('#zwf_phone_number').next().attr('class'), 'field_error');
  assert.notEqual($('#zwf_address').next().attr('class'), 'field_error');
});

///////////////////////////////////////////////////////////////

QUnit.module('nextStep function', {
  after: () => {
    Swal.close();
    $('.zwf_container #back').addClass('hide');
    $('.zwf_container #next').html('Next');
    $('#step1').removeClass('hide');
    step = 1;
    $('#step2').addClass('hide');
    $('.zwf_container .zwf_steps').html('Step 1 of 2');
  },
});

QUnit.test('step = 2', (assert) => {
  let auxStep = step;
  step = 2;
  nextStep();
  assert.ok(Swal.isVisible());
  assert.notOk($('#step1').hasClass('hide'));
  assert.ok($('#step2').hasClass('hide'));
  assert.equal($('.zwf_container input').val(), '');
  assert.equal(step, 1);
  assert.equal(userId, 0);
  assert.equal($('.zwf_container .zwf_steps').html(), 'Step 1 of 2');
  assert.equal($('.zwf_container #next').html(), 'Next');
  assert.ok($('.zwf_container #back').hasClass('hide'));
});

QUnit.test('step != 2', (assert) => {
  step = 1;
  nextStep();
  assert.notOk($('.zwf_container #back').hasClass('hide'));
  assert.equal($('.zwf_container #next').html(), 'Sign Up');
  assert.ok($('#step1').hasClass('hide'));
  assert.equal(step, 2);
  assert.notOk($(`#step2`).hasClass('hide'));
  assert.equal($('.zwf_container .zwf_steps').html(), 'Step 2 of 2');
});

///////////////////////////////////////////////////////////////

QUnit.module('validateField function');

QUnit.test('invalid zwf_phone_number', (assert) => {
  let value = '';
  const name = 'zwf_phone_number';
  assert.equal(validateField(name, value), 'This field is required');
  value = '_'
  assert.equal(validateField(name, value), 'This has to be a number');
});

QUnit.test('invalid zwf_gender', (assert) => {
  let value = '';
  const name = 'zwf_gender';
  assert.equal(validateField(name, value), 'This field is required');
  value = 'S'
  assert.equal(validateField(name, value), 'Invalid gender');
});

QUnit.test('invalid zwf_birth_date', (assert) => {
  let value = '';
  const name = 'zwf_birth_date';
  assert.equal(validateField(name, value), 'This field is required');
  value = '1991-20-009';
  assert.equal(validateField(name, value), 'Invalid date');
});

QUnit.test('Valid zwf_phone_number', (assert) => {
  let value = '123123';
  const name = 'zwf_phone_number';
  assert.equal(validateField(name, value), '');
});

QUnit.test('Valid zwf_gender', (assert) => {
  let value = 'F';
  const name = 'zwf_gender';
  assert.equal(validateField(name, value), '');
  value = 'M';
  assert.equal(validateField(name, value), '');
});

QUnit.test('Valid zwf_birth_date', (assert) => {
  let value = '1991-09-20';
  const name = 'zwf_birth_date';
  assert.equal(validateField(name, value), '');
});

///////////////////////////////////////////////////////////////

QUnit.module('getFormData function', {
  after: () => {
    $('.zwf_container #step1 [id^="zwf_"]').each((index, field) => {
      $(field).val('');
    });
  },
});

QUnit.test('All fields are incorrect, step = 1', (assert) => {
  const formFields = $('.zwf_container #step1 [id^="zwf_"]');
  let formData;
  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    formData = errorMessages;
  }
  assert.equal(typeof formData, 'object');
  assert.equal(formData.zwf_first_name, 'This field is required');
  assert.equal(formData.zwf_last_name, 'This field is required');
  assert.equal(formData.zwf_birth_date, 'This field is required');
});

QUnit.test('Some fields are incorrect, step = 1', (assert) => {
  const formFields = $('.zwf_container #step1 [id^="zwf_"]');
  formFields.get(0).value = 'Carlos';
  formFields.get(3).value = '1991-09-20';
  let formData;
  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    formData = errorMessages;
  }
  assert.equal(typeof formData, 'object');
  assert.equal(typeof formData.zwf_first_name, 'undefined');
  assert.equal(formData.zwf_last_name, 'This field is required');
  assert.equal(typeof formData.zwf_birth_date, 'undefined');
});

QUnit.test('All fields are correct, step = 1', (assert) => {
  const formFields = $('.zwf_container #step1 [id^="zwf_"]');

  formFields.get(0).value = 'Carlos'; // First Name
  formFields.get(1).value = 'Alvarez'; // Last Name
  formFields.get(2).value = 'M'; // Gender
  formFields.get(3).value = '1991-09-20'; // Birth Date

  let formData;
  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    formData = errorMessages;
  }
  assert.equal(typeof formData, 'object');
  assert.equal(typeof formData.userId, 'undefined');
  assert.equal(formData.zwf_first_name, 'Carlos');
  assert.equal(formData.zwf_last_name, 'Alvarez');
  assert.equal(formData.zwf_gender, 'M');
  assert.equal(formData.zwf_birth_date, '1991-09-20');
  assert.equal(formData.step, 1);
  assert.equal(formData.action, 'process_data');
  assert.equal(formData.nonce, zwf_vars.nonce);
});

QUnit.test('All fields are incorrect, step = 2', (assert) => {
  const formFields = $('.zwf_container #step2 [id^="zwf_"]');
  let formData;
  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    formData = errorMessages;
  }
  assert.equal(typeof formData, 'object');
  assert.equal(formData.zwf_address, 'This field is required');
  assert.equal(formData.zwf_city, 'This field is required');
  assert.equal(formData.zwf_phone_number, 'This field is required');
});

QUnit.test('Some fields are incorrect, step = 2', (assert) => {
  const formFields = $('.zwf_container #step2 [id^="zwf_"]');
  formFields.get(0).value = 'Medellin';
  formFields.get(1).value = '1123123';
  let formData;
  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    formData = errorMessages;
  }
  assert.equal(typeof formData, 'object');
  assert.equal(formData.zwf_address, 'This field is required');
  assert.equal(typeof formData.zwf_city, 'undefined');
  assert.equal(typeof formData.zwf_phone_number, 'undefined');
});

QUnit.test('All fields are correct, step = 2', (assert) => {
  const formFields = $('.zwf_container #step2 [id^="zwf_"]');
  const auxUserId = userId;
  const auxStep = step;
  step = 2;
  userId = 1;

  formFields.get(0).value = 'Medellin'; // City
  formFields.get(1).value = '12312323'; // Phone Number
  formFields.get(2).value = 'Cra 7'; // Address

  let formData;
  try {
    formData = getFormData(formFields);
  } catch (errorMessages) {
    formData = errorMessages;
  }
  assert.equal(typeof formData, 'object');
  assert.equal(formData.user_id, 1);
  assert.equal(formData.zwf_city, 'Medellin');
  assert.equal(formData.zwf_phone_number, '12312323');
  assert.equal(formData.zwf_address, 'Cra 7');
  assert.equal(formData.step, 2);
  assert.equal(formData.action, 'process_data');
  assert.equal(formData.nonce, zwf_vars.nonce);
  userId = auxUserId;
  step = auxStep;
});