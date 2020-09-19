import { IntegerField } from '../src'
import { ExceptionError } from '../src/exception'

describe('IntegerField', () => {
  let field: IntegerField
  const errorMessages = {
    required: '此字段不能为空',
    invalid: '请输入一个正确的整数',
    minValue: '最小值为3',
    maxValue: '最大值为6'
  }
  beforeAll(async () => {
    field = new IntegerField({ minValue: 3, maxValue: 6, errorMessages })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('integer', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }

    try {
      field.clean(1)
    } catch (e) {
      expect(e.msg).toBe(errorMessages.minValue)
    }

    try {
      field.clean(7)
    } catch (e) {
      expect(e.msg).toBe(errorMessages.maxValue)
    }

    const integer = 6
    expect(field.clean(integer)).toBe(integer)
  })
})
