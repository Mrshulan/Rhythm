// 添加命名空间参数
Array.prototype.pushNameSpace = function (...arg) {
  arg = arg.map(item => {
    if(/object/i.test(typeof item)) {
      if(item.nameSpace) {
        return {
          nameSpace: item.nameSpace,
          data: item.data
        }
      } else {
        return{
          nameSpace: 'default',
          data: item
        }
      }
    } else {
      return {
        nameSpace: 'default',
        data: item
      }
    }
  })

  this.push(...arg)
}

// 查询命名空间参数
Array.prototype.findNameSpace = function (nameSpace = 'default', subScript) {
  const data = this.filter(item => {
    return new RegExp(nameSpace, 'i').test(item.nameSpace)
  }).map(item => item.data)

  if(/boplean/i.test(typeof subScript)) {
    return data
  } else {
    if(subScript === undefined) {
      subScript = data.length - 1
    }

    return data[subScript]
  }
}


export default Array


