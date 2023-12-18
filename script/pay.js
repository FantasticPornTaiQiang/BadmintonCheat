const payTypeEl = document.querySelector(`input[type="radio"][name="select_pay_type"][value="-2"]`);
payTypeEl.setAttribute('checked', true);

document.getElementById('command').submit();