import { FormControl, FormGroup } from '@angular/forms';

export class CustomValidators {

  static email(control: FormControl): ValidationResult {
    /* tslint:disable:max-line-length */
    const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    /* tslint:enable:max-line-length */
    return !EMAIL_REGEXP.test(control.value) ? {invalidEmail: true} : null;
  }

  static confirmPassword(group: FormGroup): ValidationResult {
    const password: FormControl = <FormControl> group.controls['password'];
    const confirmPassword: FormControl = <FormControl> group.controls['confirmPassword'];

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({mismatchPasswords: true});
    }

    return null;
  }

  static password(control: FormControl): ValidationResult {
    return control.value.length < 6 ? {invalidPassword: true} : null;
  }

  static phone(control: FormControl): ValidationResult {
    return !/^\d{10}$/.test(control.value) ? {invalidPhone: true} : null;
  }
}

interface ValidationResult {
  [key: string]: boolean;
}
