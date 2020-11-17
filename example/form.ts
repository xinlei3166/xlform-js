import * as form from '../src'

const options = {
  a: new form.CharField({ maxLength: 4, minLength: 2}),
  b: new form.PhoneField({ errorMessages: {
      required: '手机号不能为空',
      invalid: '请输入正确的11为手机号',
    }}),
  c: new form.EmailField({  errorMessages: {
      required: '邮箱不能为空',
      invalid: '请输入正确的邮箱地址',
    }}),
  d: new form.RegexField({ regex: /[a-z]/}),
  e: new form.UUIDField(),
  f: new form.BooleanField(),
  g: new form.IntegerField({ minValue: 1, maxValue: 100, errorMessages: {
      required: 'g不能为空',
      invalid: '请输入正确的数字',
      minValue: '最小值为1',
      maxValue: '最大值为100'
    }}),
  h: new form.FloatField({ minValue: 1, maxValue: 100, errorMessages: {
      required: 'g不能为空',
      invalid: '请输入正确的数字',
      minValue: '最小值为1',
      maxValue: '最大值为100'
    }}),
  i: new form.DecimalField({ maxDigits: 3, decimalPlaces: 1, errorMessages: {
      required: 'i不能为空',
      invalid: '请输入正确的decimal类型值',
      decimal: '小数位为1，数字最大位数为3'
    }})
}

const data = {
  a: 'abc',
  b: '16666666666',
  c: 'abc@126.com',
  d: 'abc',
  e: '4ae915cc-b833-46c3-9e57-961e0c3f2afb',
  f: false,
  g: 100,
  h: 99.99,
  i: 12.3
}
const f = new form.Form(data, options)

if (f.isValid()) {
  console.log('cleanedData', f.cleanedData)
} else {
  console.log('errors', f.errors)
}
