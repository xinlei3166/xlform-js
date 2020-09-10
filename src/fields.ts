import {BaseFieldOptions, CharFieldOptions, ErrorMessages, Validator} from './interfaces'
import {error} from './exception'
import * as validators from './validators'
import {typeOf, types} from './utils'

export class BaseField {
  defaultErrorMessages = { 'required': 'This field is required' } as ErrorMessages
  emptyValues = [undefined, null, '', [], {}]
  defaultOptions = {required: true, errorMessages: null, validators: []}
  defaultValidators = []
  required: boolean
  errorMessages: ErrorMessages = {}
  validators: Array<Validator> = []
  includeEmptyObject: boolean

  constructor(options: BaseFieldOptions) {
    const {required, errorMessages, validators, includeEmptyObject} = {...this.defaultOptions, ...options,}
    this.includeEmptyObject = !!includeEmptyObject
    this.required = required
    this.validators.concat(this.defaultValidators, validators)
    this.mergeErrorMessages(errorMessages || {})
  }

  mergeErrorMessages(errorMessages?: Object) {
    const _errorMessages = errorMessages || {}
    this.errorMessages = {...this.defaultErrorMessages, ..._errorMessages} as ErrorMessages
  }

  js(value: any) {
    return value
  }

  validate(value: any) {
    if (this.required) {
      switch (typeOf(value)) {
        case types['array']:
          if (value.length === 0) {
            throw error(this.errorMessages['required'])
          }
          break
        case types['object']:
          if (Object.values(value).length === 0) {
            throw error(this.errorMessages['required'])
          }
          break
        default:
          if (this.emptyValues.includes(value)) {
            throw error(this.errorMessages['required'])
          }
      }
    }
  }

  runValidators(value: any) {
    const errors = []
    for (let v of this.validators) {
      try {
        v.call(value)
      } catch (e) {
        errors.push(e.msg)
      }
    }
    if (errors.length > 0) {
      throw error(errors.join(', '))
    }
  }

  clean(value: any) {
    value = this.js(value)
    this.validate(value)
    this.runValidators(value)
    return value
  }
}

export class CharField extends BaseField {
  defaultErrorMessages = {'required': 'This field is required asdasdadasdasd'}
  maxLength: number | undefined
  minLength: number | undefined
  strip: boolean | undefined
  emptyValue: any

  constructor(options: CharFieldOptions) {
    super(options)
    super.mergeErrorMessages(options.errorMessages)
    const {maxLength, minLength, strip, emptyValue} = options
    this.maxLength = maxLength
    this.minLength = minLength
    this.strip = strip
    this.emptyValue = emptyValue
    if (minLength) {
      this.validators.push(new validators.MinLengthValidator(minLength))
    }
    if (maxLength) {
      this.validators.push(new validators.MaxLengthValidator(maxLength))
    }
  }

  js(value: any) {
    if (!this.emptyValues.includes(value)) {
      value = String(value)
      if (this.strip) {
        value = value.trim()
      }
    } else {
      return this.emptyValue
    }
    return value
  }
}
