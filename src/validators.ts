import * as uuid from 'uuid'
import { Decimal } from 'decimal.js'
import { Validator } from './interfaces'
import { error } from './exception'
import { phonePattern, emailPattern } from './patterns'
import { typeOf, types } from "./utils"

type Msg = string | undefined

export class BaseValidator implements Validator {
  msg = 'value any -> {}'
  limitValue: any

  constructor(limitValue: any, msg?: Msg) {
    this.limitValue = limitValue
    this.formatMsg(limitValue, msg)
  }

  formatMsg(limitValue: any, msg: Msg) {
    if (msg) {
      this.msg = msg
    } else {
      this.msg = this.msg.replace('{}', limitValue)
    }
  }

  call(value: any) {
    const cleaned = this.clean(value)
    if (this.compare(cleaned, this.limitValue)) {
      throw error(this.msg)
    }
  }

  compare(a: any, b: any) {
    return !Object.is(a, b)
  }

  clean(x: any) {
    return x
  }
}

export class MinLengthValidator extends BaseValidator {
  msg = 'minLength -> {}'

  constructor(limitValue: number, msg?: Msg) {
    super(limitValue, msg)
    this.formatMsg(limitValue, msg)
  }

  compare(a: number, b: number) {
    return a < b
  }

  clean(x: any) {
    return x.length
  }
}

export class MaxLengthValidator extends BaseValidator {
  msg = 'maxLength -> {}'

  constructor(limitValue: number, msg?: Msg) {
    super(limitValue, msg)
    this.formatMsg(limitValue, msg)
  }

  compare(a: number, b: number) {
    return a > b
  }

  clean(x: any) {
    return x.length
  }
}

export class MinValueValidator extends BaseValidator {
  msg = 'minValue -> {}'

  constructor(limitValue: number, msg?: Msg) {
    super(limitValue, msg)
    this.formatMsg(limitValue, msg)
  }

  compare(a: number, b: number) {
    return a < b
  }
}

export class MaxValueValidator extends BaseValidator {
  msg = 'maxValue -> {}'

  constructor(limitValue: number, msg?: Msg) {
    super(limitValue, msg)
    this.formatMsg(limitValue, msg)
  }

  compare(a: number, b: number) {
    return a > b
  }
}

export class FixedValidator implements Validator {
  msg = 'invalid value'

  constructor(msg?: Msg) {
    this.formatMsg(msg)
  }

  formatMsg(msg: Msg) {
    if (msg) {
      this.msg = msg
    }
  }

  compare(value: any) {
    return !value
  }

  call(value: any) {
    if (this.compare(value)) {
      throw error(this.msg)
    }
  }
}

export class PhoneValidator extends FixedValidator {
  msg = 'invalid phone'

  constructor(msg?: Msg) {
    super(msg)
    this.formatMsg(msg)
  }

  compare(value: any) {
    return !phonePattern.test(value)
  }
}

export class EmailValidator extends FixedValidator {
  msg = 'invalid email'

  constructor(msg?: Msg) {
    super(msg)
    this.formatMsg(msg)
  }

  compare(value: any) {
    return !emailPattern.test(value)
  }
}

export class RegexValidator extends FixedValidator {
  msg = 'no match valid data'
  private regex: RegExp

  constructor(regex: RegExp, msg?: Msg) {
    super(msg)
    this.regex = regex
    this.formatMsg(msg)
  }

  compare(value: any) {
    return !this.regex.test(value)
  }
}

export class UUIDValidator extends FixedValidator {
  msg = 'invalid uuid value'

  constructor(msg?: Msg) {
    super(msg)
    this.formatMsg(msg)
  }

  compare(value: any) {
    return !uuid.validate(value)
  }
}

export class BooleanValidator extends FixedValidator {
  msg = 'invalid boolean value'

  constructor(msg?: Msg) {
    super(msg)
    this.formatMsg(msg)
  }

  compare(value: any) {
    return typeOf(value) !== types.boolean
  }
}

export class DecimalValidator {
  msg = 'maxDigits -> {}, maxDecimalPlaces -> {}'
  maxDigits?: number
  decimalPlaces?: number

  constructor(maxDigits?: number, decimalPlaces?: number, msg?: Msg) {
    this.maxDigits = maxDigits
    this.decimalPlaces = decimalPlaces
    this.formatMsg(msg)
  }

  formatMsg(msg: Msg) {
    if (msg) {
      this.msg = msg
    } else {
      const l = `maxDigits -> ${this.maxDigits}`
      const r = `maxDecimalPlaces -> ${this.decimalPlaces}`
      this.msg = l + ', ' + r
    }
  }

  call(value: any) {
    value = new Decimal(value)
    if ((this.maxDigits === 0 || this.maxDigits) &&  value.sd(true) > this.maxDigits) {
      throw error(this.msg)
    }
    if ((this.decimalPlaces === 0 || this.decimalPlaces) &&  value.dp() > this.decimalPlaces) {
      throw error(this.msg)
    }
  }
}
