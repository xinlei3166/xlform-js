import { CharField } from '../src'
import { ExceptionError } from '../src/exception'

describe('CharField', () => {
  let field: CharField
  const errorMessages = {
    required: '此字段不能为空',
    minLength: '最小长度为3',
    maxLength: '最大长度为5'
  }
  beforeAll(async () => {
    field = new CharField({
      required: true,
      minLength: 3,
      maxLength: 5,
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
    expect(field.clean('hello')).toBe('hello')
  })

  test('minLength', () => {
    try {
      field.clean('he')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.minLength)
    }
  })

  test('maxLength', () => {
    try {
      field.clean('hello world')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.maxLength)
    }
  })
})
