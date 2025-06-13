const foowwLocalStorage = {
  // expiret 1000 = 1秒
  set: function(key, value, expire) {
    let obj = {
      data: value,
    };
    if(expire) {
      obj.expire = expire;
      obj.time = Date.now();
    }
    //localStorage 设置的值不能为对象,转为json字符串
    localStorage.setItem(key, JSON.stringify(obj));
  },  
  get: function(key) {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
  }
}

export function getItem(key){
  var str = foowwLocalStorage.get(key);
  return str
}
export function setItem(key, value, date){
  var obj = foowwLocalStorage.set(key, value, date);
  return JSON.stringify(obj)
}