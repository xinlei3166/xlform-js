export interface ErrorMessages {
  required?: string,
  minLength?: string,
  maxLength?: string,
  minValue?: string,
  maxValue?: string,
  decimal?: string,
  invalid?: string,
}

export interface BaseFieldOptions {
  required?: boolean
  includeEmptyObject?: boolean
  errorMessages?: ErrorMessages
  validators?: Array<Validator>
}

export interface CharFieldOptions extends BaseFieldOptions {
  maxLength?: number
  minLength?: number
  strip?: boolean
  emptyValue?: any
}

export interface PhoneFieldOptions extends CharFieldOptions {}

export interface EmailFieldOptions extends CharFieldOptions {}

export type Regex = string | RegExp

export interface RegexFieldOptions extends CharFieldOptions {
  regex: Regex
}

export interface UUIDFieldOptions extends CharFieldOptions {}

export interface BooleanFieldOptions extends BaseFieldOptions {}

export interface IntegerFieldOptions extends BaseFieldOptions {
  minValue?: number,
  maxValue?: number
}

export interface FloatFieldOptions extends IntegerFieldOptions {}

export interface DecimalFieldOptions extends IntegerFieldOptions {
  maxDigits?: number
  decimalPlaces?: number
}

export interface Validator {
  call(value: any): void

  compare?(a: any, b: any): boolean

  clean?(value: any): any
}
