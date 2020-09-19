import { BooleanField } from '../src'
import { ExceptionError } from '../src/exception'

describe('BooleanField', () => {
  let field: BooleanField
  const errorMessages = {
    required: '此字段不能为空',
    invalid: '请输入一个正确的布尔值',
  }
  beforeAll(async () => {
    field = new BooleanField({ errorMessages })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('boolean', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }

    const u = true
    expect(field.clean(u)).toBe(u)
  })
})
