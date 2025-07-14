// ceErns/后端/middleware/formatTime.js
const dayjs = require('dayjs');

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '';
};

// 格式化对象中的时间字段
const formatObjectTime = (obj) => {
  if (!obj) return obj;
  const timeStr = [ 'rece_time', 'delivery_time', 'updated_at', 'created_at' ]
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if(timeStr.includes(key)){
      result[key] = formatTime(value);
    }else{
      result[key] = value;
    }
  }
  
  return result;
};


// 格式化数组中的时间字段
const formatArrayTime = (arr) => {
  return arr.map(formatObjectTime);
};

module.exports = {
  formatObjectTime,
  formatArrayTime
};