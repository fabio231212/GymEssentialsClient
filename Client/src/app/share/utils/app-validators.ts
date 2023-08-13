import {
  UntypedFormGroup,
  UntypedFormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

export function creditCardValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  // Eliminar espacios en blanco y guiones del número de tarjeta
  const sanitizedValue = value.replace(/[\s-]/g, '');

  // Comprobar si el número de tarjeta contiene solo dígitos y tiene una longitud válida
  if (
    !/^\d+$/.test(sanitizedValue) ||
    sanitizedValue.length < 13 ||
    sanitizedValue.length > 19
  ) {
    return { invalidCreditCard: true };
  }

  // Aplicar el algoritmo de Luhn para validar el número de tarjeta
  let sum = 0;
  let alternate = false;
  for (let i = sanitizedValue.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedValue.charAt(i), 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) {
    return { invalidCreditCard: true };
  }

  return null; // El número de tarjeta es válido
}

export function matchingPasswords(
  passwordKey: string,
  passwordConfirmationKey: string
) {
  return (group: UntypedFormGroup) => {
    let password = group.controls[passwordKey];
    let passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({ mismatchedPasswords: true });
    }
  };
}
