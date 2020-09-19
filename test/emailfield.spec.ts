import { EmailField } from '../src'
import { ExceptionError } from '../src/exception'

describe('EmailField', () => {
  let field: EmailField
  const errorMessages = {
    required: '邮箱不能为空',
    invalid: '请输入合法的邮箱',
  }
  beforeAll(async () => {
    field = new EmailField({ errorMessages })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('email', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }
    const phone = 'xxxxxx@qq.com'
    expect(field.clean(phone)).toBe(phone)
  })
})
