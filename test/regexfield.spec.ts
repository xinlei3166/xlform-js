import { RegexField } from '../src'
import { ExceptionError } from '../src/exception'

describe('RegexField', () => {
  let field: RegexField
  const errorMessages = {
    required: '此字段不能为空',
    invalid: '请输入正则匹配的内容',
  }
  beforeAll(async () => {
    field = new RegexField({ regex: /\d{2,6}/, errorMessages })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('regex', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }

    try {
      field.clean('1')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }

    const number = '123456'
    expect(field.clean(number)).toBe(number)
  })
})
