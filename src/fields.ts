import { Decimal } from 'decimal.js'
import {
  BaseFieldOptions,
  CharFieldOptions,
  PhoneFieldOptions,
  EmailFieldOptions,
  RegexFieldOptions,
  UUIDFieldOptions,
  BooleanFieldOptions,
  IntegerFieldOptions,
  FloatFieldOptions,
  DecimalFieldOptions,
  Regex,
  ErrorMessages,
  Validator,
} from './interfaces'
import { error } from './exception'
import * as validators from './validators'
import { typeOf, types } from './utils'

export class BaseField {
  defaultErrorMessages: ErrorMessages = { required: 'This field is required' }
  emptyValues = [undefined, null, '']
  defaultOptions = { required: true, errorMessages: {}, validators: [] }
  required: boolean
  errorMessages: ErrorMessages = {}
  validators: Array<Validator> = []
  includeEmptyObject: boolean

  /**
   * 字符串字段
   * @param options
   * options.required: 字段是否必填（默认true）
   * options.validators: 自定义数据验证对象数组
   * options.includeEmptyObject: required为true时，空数组和空对象是否处理（默认false）
   * options.errorMessages: required 数据不合法时抛出的error，如不填则抛出默认error
   */
  constructor(options: BaseFieldOptions) {
    const { required, errorMessages, validators, includeEmptyObject } = {
      ...this.defaultOptions,
      ...options,
    }
    this.includeEmptyObject = !!includeEmptyObject
    this.required = required
    this.validators = [...this.validators, ...validators]
    this.mergeErrorMessages(errorMessages || {})
  }

  mergeErrorMessages(errorMessages?: Object) {
    const _errorMessages = errorMessages || {}
    this.errorMessages = {
      ...this.defaultErrorMessages,
      ..._errorMessages,
    }
  }

  js(value: any) {
    return value
  }

  validate(value: any) {
    if (!this.required) {
      return
    }
    switch (typeOf(value)) {
      case types['array']:
        if (value.length === 0 && this.includeEmptyObject) {
          throw error(this.errorMessages.required!)
        }
        break
      case types['object']:
        if (Object.values(value).length === 0 && this.includeEmptyObject) {
          throw error(this.errorMessages.required!)
        }
        break
      default:
        if (this.emptyValues.includes(value)) {
          // required未传或为空，则使用默认值
          throw error(this.errorMessages.required!)
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
  maxLength?: number
  minLength?: number
  strip?: boolean
  emptyValue: any

  /**
   * 字符串字段
   * @param options
   * options.emptyValue: 如果不填，赋予的默认值
   * options.minLength: 字符串最小长度
   * options.maxLength: 字符串最大长度
   * options.strip: 是否删除字符串前后的空格（默认false）
   * options.errorMessages: required、minLength、maxLength 数据不合法时抛出的error，如不填则抛出默认error
   */
  constructor(options: CharFieldOptions) {
    super(options)
    const { minLength, maxLength, strip, emptyValue } = options
    this.minLength = minLength
    this.maxLength = maxLength
    this.strip = strip
    this.emptyValue = emptyValue
    if (minLength) {
      this.validators.push(
        // minLength未传或者为空，则使用默认值
        new validators.MinLengthValidator(
          minLength,
          this.errorMessages.minLength
        )
      )
    }
    if (maxLength) {
      this.validators.push(
        // maxLength未传或者为空，则使用默认值
        new validators.MaxLengthValidator(
          maxLength,
          this.errorMessages.maxLength
        )
      )
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

export class PhoneField extends CharField {
  constructor(options?: PhoneFieldOptions) {
    super(options || {})
    this.validators.push(
      new validators.PhoneValidator(this.errorMessages.invalid)
    )
  }
}

export class EmailField extends CharField {
  constructor(options?: EmailFieldOptions) {
    super(options || {})
    this.validators.push(
      new validators.EmailValidator(this.errorMessages.invalid)
    )
  }
}

export class RegexField extends CharField {
  _regex: RegExp | undefined

  constructor(options: RegexFieldOptions) {
    super(options || {})
    this._setRegex(options.regex)
  }

  get regex() {
    return this._regex
  }

  _setRegex(regex: Regex) {
    if (!(regex instanceof RegExp)) {
      regex = new RegExp(regex)
    }
    this._regex = regex
    this.validators.push(
      new validators.RegexValidator(regex, this.errorMessages.invalid)
    )
  }
}

export class UUIDField extends CharField {
  constructor(options?: UUIDFieldOptions) {
    super(options || {})
    this.validators.push(
      new validators.UUIDValidator(this.errorMessages.invalid)
    )
  }
}

export class BooleanField extends BaseField {
  constructor(options?: UUIDFieldOptions) {
    super(options || {})
    this.validators.push(
      new validators.BooleanValidator(this.errorMessages.invalid)
    )
  }
}

export class IntegerField extends BaseField {
  defaultErrorMessages = { 'invalid': 'Enter a whole number' }
  minValue?: number
  maxValue?: number
  reDecimal = /\.0*\s*$/

  /**
   * 整数字段
   * @param options
   * options.minValue: 最小数值
   * options.maxValue: 最大数值
   * options.errorMessages: invalid、minValue、maxValue 数据不合法时抛出的error，如不填则抛出默认error
   */
  constructor(options?: IntegerFieldOptions) {
    super(options || {})
    this.minValue = options && options.minValue
    this.maxValue = options && options.maxValue
    if (this.minValue) {
      this.validators.push(
        new validators.MinValueValidator(this.minValue, this.errorMessages.minValue)
      )
    }
    if (this.maxValue) {
      this.validators.push(
        new validators.MaxValueValidator(this.maxValue, this.errorMessages.maxValue)
      )
    }
  }

  js(value: any) {
    if (this.emptyValues.includes(value)) {
      return
    }
    if (!Number.isInteger(value)) {
      throw error(this.errorMessages.invalid || this.defaultErrorMessages.invalid)
    }
    return value
  }
}

export class FloatField extends IntegerField {
  js(value: any) {
    if (this.emptyValues.includes(value)) {
      return
    }
    if (typeOf(value) !== types.number) {
      throw error(this.errorMessages.invalid || this.defaultErrorMessages.invalid)
    }
    return value
  }
}

export class DecimalField extends IntegerField {
  defaultErrorMessages = { 'invalid': 'Enter a Decimal value' }
  maxDigits?: number
  decimalPlaces?: number

  /**
   * Decimal字段
   * @param options
   * options.minValue: 最小数值
   * options.maxValue: 最大数值
   * options.maxDigits: 数字允许的最大位数, 如果存在decimalPlaces, 此数字必须是大于decimalPlaces
   * options.maxDigits: 数字允许的最大位数, 如果存在decimalPlaces, 此数字必须是大于decimalPlaces
   * options.decimalPlaces: 小数位数
   * options.errorMessages: invalid、minValue、maxValue、decimal 数据不合法时抛出的error，如不填则抛出默认error
   * eg: 例如，要存储的数字最大长度为3位，而带有两个小数位，可以使用：maxDigits=3, decimalPlaces=2
   */
  constructor(options?: DecimalFieldOptions) {
    super(options || {})
    this.maxDigits = options && options.maxDigits
    this.decimalPlaces = options && options.decimalPlaces
    this.validators.push(new validators.DecimalValidator(this.maxDigits, this.decimalPlaces, this.errorMessages.decimal))
  }

  js(value: any) {
    if (this.emptyValues.includes(value)) {
      return
    }
    try {
      new Decimal(value)
    } catch (e) {
      throw error(this.errorMessages.invalid || this.defaultErrorMessages.invalid)
    }
    return value
  }
}
