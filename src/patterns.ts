// 11位手机号码
export const phonePattern = /^1[3456789]\d{9}$/

// 邮箱
export const emailPattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/

// 匹配标准带http[s]前缀的url字符串
export const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/
