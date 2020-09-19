import { DecimalField } from '../src'
import { ExceptionError } from '../src/exception'

describe('DecimalField', () => {
  let field: DecimalField
  const errorMessages = {
    required: '此字段不能为空',
    invalid: '请输入一个正确的小数',
    decimal: '请输入一个正数位为4位，小数位为2位的小数',
  }
  beforeAll(async () => {
    field = new DecimalField({
      maxDigits: 6,
      decimalPlaces: 2,
      errorMessages,
    })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('decimal', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }

    try {
      field.clean(1.111)
    } catch (e) {
      expect(e.msg).toBe(errorMessages.decimal)
    }

    try {
      field.clean(111111.11)
    } catch (e) {
      expect(e.msg).toBe(errorMessages.decimal)
    }

    const decimal = 11.11
    expect(field.clean(decimal)).toBe(decimal)
  })
})
