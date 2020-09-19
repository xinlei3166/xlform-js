export const types = {
  boolean: 'boolean',
  number: 'number',
  string: 'string',
  function: 'function',
  array: 'array',
  date: 'date',
  regExp: 'regExp',
  undefined: 'undefined',
  null: 'null',
  object: 'object',
}

export const typeOf = (obj: any) => {
  const toString = Object.prototype.toString
  const map: { [key: string]: string } = {
    '[object Boolean]': types['boolean'],
    '[object Number]': types['number'],
    '[object String]': types['string'],
    '[object Function]': types['function'],
    '[object Array]': types['array'],
    '[object Date]': types['date'],
    '[object RegExp]': types['regExp'],
    '[object Undefined]': types['undefined'],
    '[object Null]': types['null'],
    '[object Object]': types['object'],
  }
  return map[toString.call(obj)]
}
