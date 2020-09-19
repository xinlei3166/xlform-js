import { BaseField } from '../src'
import { ExceptionError } from '../src/exception'

describe('BaseField', () => {
  test('required true', () => {
    const requiredMsg = '此字段不能为空'
    const field = new BaseField({
      required: true,
      errorMessages: { required: requiredMsg },
    })
    try {
      expect(() => field.clean(''))
    } catch (e) {
      expect(e.msg).toBe(requiredMsg)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
    expect(field.clean('hello')).toBe('hello')
  })

  test('required false', () => {
    const field = new BaseField({ required: false })
    expect(() => field.clean('')).not.toThrow(ExceptionError)
    expect(['', null, undefined]).toContain(field.clean(''))
  })
})
