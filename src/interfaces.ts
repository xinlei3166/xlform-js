export interface ErrorMessages {
  [key: string]: string
}

export interface BaseFieldOptions {
  required?: boolean,
  includeEmptyObject?: boolean,
  errorMessages?: Object,
  validators?: Array<Validator>
}

export interface CharFieldOptions extends BaseFieldOptions {
  maxLength?: number
  minLength?: number
  strip?: boolean
  emptyValue?: any
}

export interface Validator {
  call(value: any): void,
  compare(a: any, b: any): boolean,
  clean(value: any): any
}
