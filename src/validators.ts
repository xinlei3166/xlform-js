import { Validator } from './interfaces'
import { error } from './exception'

type msg = string | undefined

export class BaseValidator implements Validator {
  msg = 'value any -> {}'
  limitValue: any

  constructor(limitValue: any, msg?: msg) {
    this.limitValue = limitValue
    this.formatMsg(limitValue, msg)
  }

  formatMsg(limitValue: any, msg: msg) {
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

  constructor(limitValue: number, msg?: msg) {
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

  constructor(limitValue: number, msg?: msg) {
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

