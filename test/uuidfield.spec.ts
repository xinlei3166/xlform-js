import { UUIDField } from '../src'
import { ExceptionError } from '../src/exception'

describe('UUIDField', () => {
  let field: UUIDField
  const errorMessages = {
    required: '此字段不能为空',
    invalid: '请输入一个正确的uuid',
  }
  beforeAll(async () => {
    field = new UUIDField({ errorMessages })
  })

  test('required', () => {
    try {
      field.clean('')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.required)
    }
    expect(() => field.clean('')).toThrow(ExceptionError)
  })

  test('uuid', () => {
    try {
      field.clean('abc')
    } catch (e) {
      expect(e.msg).toBe(errorMessages.invalid)
    }

    const u = '4ae915cc-b833-46c3-9e57-961e0c3f2afb'
    expect(field.clean(u)).toBe(u)
  })
})
