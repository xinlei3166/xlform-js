import { BaseField } from '../src'
import { ExceptionError, error } from '../src/exception'

describe('BaseField', () => {
  test('required true', () => {
    const field =  new BaseField({required: true, errorMessages: { required: '11'}})
    expect(() => field.clean('')).toThrow(ExceptionError)
    expect(() => field.clean('')).toThrow(error('11'))
    expect(field.clean('hello')).toBe('hello')
  })

  test('required false', () => {
    const field =  new BaseField({required: false, errorMessages: { required: '11'}})
    expect(() => field.clean('')).not.toThrow(ExceptionError)
    expect(['', null, undefined]).toContain(field.clean(''))
  })
})
