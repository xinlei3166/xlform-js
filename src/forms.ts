import { error } from './exception'
import { FormData, FormFields } from './interfaces'

export class Form {
  data: FormData
  validFlag: any
  fields: FormFields
  private _errors: any
  private _cleanedData: any

  constructor(data: null | {}, fields: {}) {
    this.fields = fields
    this.data = data === null ? {} : data
    this._errors = null
    this.validFlag = null
    this._cleanedData = {}
  }

  get cleanedData() {
    if (this.validFlag === null) {
      throw error('获得数据前，必须执行方法: isValid')
    } else if (!this.validFlag) {
      throw error('数据校验失败')
    } else {
      return this._cleanedData
    }
  }

  get errors() {
    if (this._errors === null) {
      this.clean()
    }
    return this._errors
  }

  clean() {
    this.validFlag = false
    let cleanedData: FormData = {}
    this._errors = {}
    for (const [name, field] of Object.entries(this.fields)) {
      const value = this.data[name]
      try {
        cleanedData[name] = field.clean(value)
      } catch (e) {
        this._errors[name] = e.msg
      }
    }
    this.validFlag = true
    this._cleanedData = cleanedData
  }

  isValid() {
    return this.data && (Object.keys(this.errors).length === 0)
  }
}
