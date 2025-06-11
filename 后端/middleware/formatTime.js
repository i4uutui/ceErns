// ceErns/后端/middleware/formatTime.js
const dayjs = require('dayjs');

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '';
};

// 格式化对象中的时间字段
const formatObjectTime = (obj) => {
  if (!obj) return obj;
  
  return {
    ...obj,
    created_at: formatTime(obj.created_at),
    updated_at: formatTime(obj.updated_at),
    // 如果有其他时间字段，也可以在这里添加
  };
};

// 格式化数组中的时间字段
const formatArrayTime = (arr) => {
  return arr.map(formatObjectTime);
};

module.exports = {
  formatObjectTime,
  formatArrayTime
};