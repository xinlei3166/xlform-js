import { PhoneField } from '../src'
import { ExceptionError } from '../src/exception'

describe('PhoneField', () => {
  let field: PhoneField
  const errorMessages = {
    required: '手机号不能为空',
    invalid: '请输入合法的11为手机号',
  }
  beforeAll(async () => {
    field = new PhoneField({ errorMessages })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('phone', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }
    const phone = '16666666666'
    expect(field.clean(phone)).toBe(phone)
  })
})
