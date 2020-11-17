# 类型xlform

一个仿 django form 的表单验证库

## 安装
```js
npm install xlform
yarn add xlform
```

## 用法

```js

```

## Fields

### CharField

| 字段                    | 必填 | 类型    | 描述                                 |
| ----------------------- | ---- | ------- | ------------------------------------ |
| minLength               | 否   | number  | value最小长度                        |
| maxLength               | 否   | number  | value最大长度                        |
| strip                   | 否   | boolean | 是否删除value前后的空格（默认false） |
| errorMessages           | 否   | object  | 错误信息                             |
| errorMessages.required  | 否   | string  | value为空时的错误信息                |
| errorMessages.minLength | 否   | string  | value不符合最小长度时的错误信息      |
| errorMessages.maxLength | 否   | string  | value不符合最大长度时的错误信息      |

### PhoneField

| 字段                   | 必填 | 类型   | 描述                        |
| ---------------------- | ---- | ------ | --------------------------- |
| errorMessages          | 否   | object | 错误信息                    |
| errorMessages.required | 否   | string | value为空时的错误信息       |
| errorMessages.invalid  | 否   | string | value不为手机号时的错误信息 |

### EmailField

| 字段                   | 必填 | 类型   | 描述                      |
| ---------------------- | ---- | ------ | ------------------------- |
| errorMessages          | 否   | object | 错误信息                  |
| errorMessages.required | 否   | string | value为空时的错误信息     |
| errorMessages.invalid  | 否   | string | value不为邮箱时的错误信息 |

### RegexField

| 字段                   | 必填 | 类型   | 描述                      |
| ---------------------- | ---- | ------ | ------------------------- |
| regex                  | 是   | regex  | 正则表达式                |
| errorMessages          | 否   | object | 错误信息                  |
| errorMessages.required | 否   | string | value为空时的错误信息     |
| errorMessages.invalid  | 否   | string | value不符合正则的错误信息 |

### UUIDField

| 字段                   | 必填 | 类型   | 描述                    |
| ---------------------- | ---- | ------ | ----------------------- |
| errorMessages          | 否   | object | 错误信息                |
| errorMessages.required | 否   | string | value为空时的错误信息   |
| errorMessages.invalid  | 否   | string | value不为uuid的错误信息 |

### BooleanField

| 字段                   | 必填 | 类型   | 描述                      |
| ---------------------- | ---- | ------ | ------------------------- |
| errorMessages          | 否   | object | 错误信息                  |
| errorMessages.required | 否   | string | value为空时的错误信息     |
| errorMessages.invalid  | 否   | string | value不为布尔值的错误信息 |

### IntegerField

| 字段                   | 必填 | 类型   | 描述                        |
| ---------------------- | ---- | ------ | --------------------------- |
| minValue               | 否   | number | value最小值                 |
| maxValue               | 否   | number | value最大值                 |
| errorMessages          | 否   | object | 错误信息                    |
| errorMessages.required | 否   | string | value为空时的错误信息       |
| errorMessages.invalid  | 否   | string | value不为数字的错误信息     |
| errorMessages.minValue | 否   | string | value不符合最小值的错误信息 |
| errorMessages.maxValue | 否   | string | value不符合最大值的错误信息 |

### FloatField

| 字段                   | 必填 | 类型   | 描述                        |
| ---------------------- | ---- | ------ | --------------------------- |
| minValue               | 否   | number | value最小值                 |
| maxValue               | 否   | number | value最大值                 |
| errorMessages          | 否   | object | 错误信息                    |
| errorMessages.required | 否   | string | value为空时的错误信息       |
| errorMessages.invalid  | 否   | string | value不为浮点数的错误信息   |
| errorMessages.minValue | 否   | string | value不符合最小值的错误信息 |
| errorMessages.maxValue | 否   | string | value不符合最大值的错误信息 |

### DecimalField

| 字段                   | 必填 | 类型   | 描述                                                         |
| ---------------------- | ---- | ------ | ------------------------------------------------------------ |
| minValue               | 否   | number | value最小值                                                  |
| maxValue               | 否   | number | value最大值                                                  |
| maxDigits              | 否   | number | 数字允许的最大位数, 如果存在decimalPlaces, 此数字必须是大于decimalPlaces |
| decimalPlaces          | 否   | number | 小数位数                                                     |
| errorMessages          | 否   | object | 错误信息                                                     |
| errorMessages.required | 否   | string | value为空时的错误信息                                        |
| errorMessages.invalid  | 否   | string | value不为小数的错误信息                                      |
| errorMessages.decimal  | 否   | string | value不符合maxDigits和decimalPlaces条件时的错误信息          |
| errorMessages.minValue | 否   | string | value不符合最小值的错误信息                                  |
| errorMessages.maxValue | 否   | string | value不符合最大值的错误信息                                  |
