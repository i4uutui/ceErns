import { getItem } from '@/assets/js/storage';
/**
 * 检查用户是否拥有指定权限
 * @param {string} permission 权限标识（如"user:add"）
 * @returns {boolean} 是否有权限
 */
export const hasPermission = (permission) => {
  const user = getItem('user');
  if(user.type == 1) return true; // 管理员拥有所有权限
  if (!user || !user.power || !permission) return false;
  return user.power.includes(permission);
};
/**
 * 数字转中文大写
 * @param {Number} num 要转换的数字
 * @returns {String} 中文大写字符串
 */
const numberToChinese = (num) => {
  if (isNaN(num) || num === null) return '';
  
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'];
  const decimalUnits = ['角', '分'];
  
  // 处理负数
  let negative = '';
  if (num < 0) {
    negative = '负';
    num = Math.abs(num);
  }
  
  // 处理整数和小数部分
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = '';
  
  // 处理整数部分
  if (integerPart > 0) {
    let intStr = integerPart.toString();
    let intLen = intStr.length;
    
    for (let i = 0; i < intLen; i++) {
      const digit = parseInt(intStr[i]);
      const unitIndex = intLen - 1 - i;
      
      if (digit !== 0) {
        result += digits[digit] + units[unitIndex];
      } else {
        // 处理零的情况，避免多个零连续出现
        if (result[result.length - 1] !== '零') {
          result += digits[digit];
        }
        // 处理单位为万或亿时，即使后面是零也要保留单位
        if (units[unitIndex] === '万' || units[unitIndex] === '亿') {
          result += units[unitIndex];
        }
      }
    }
    
    // 去除末尾的零
    result = result.replace(/零+$/, '');
  } else {
    result = '零';
  }
  
  // 添加"元"字
  result += '元';
  
  // 处理小数部分
  if (decimalPart > 0) {
    const jiao = Math.floor(decimalPart / 10);
    const fen = decimalPart % 10;
    
    if (jiao > 0) {
      result += digits[jiao] + decimalUnits[0];
    } else if (result[result.length - 1] !== '零') {
      result += '零';
    }
    
    if (fen > 0) {
      result += digits[fen] + decimalUnits[1];
    }
  } else {
    result += '整';
  }
  
  return negative + result;
};
function getRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 16;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }
  return result;
}
// 检查值是否为空
function isEmptyValue(value) {
  // 处理null和undefined
  if (value == null) return true;
  
  // 处理字符串
  if (typeof value === 'string' && value.trim() === '') return true;
  
  // 处理数字
  if (typeof value === 'number' && (isNaN(value) || value === 0)) return false;
  
  // 处理对象
  if (typeof value === 'object') {
    return Object.values(value).every(isEmptyValue);
  }
  
  // 其他类型视为有值
  return false;
}

export {
  numberToChinese,
  getRandomString,
  isEmptyValue
}