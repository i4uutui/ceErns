// 自动构建嵌套结构
const formatQuotation = (item, fieldMap) => {
  const result = { ...item }; // 复制原始数据
  
  Object.entries(fieldMap).forEach(([tableName, fields]) => {
    result[tableName] = {};
    fields.forEach(field => {
      const sourceField = tableName === 'customer' 
        ? `customer_${field}` 
        : field; // 根据SQL别名调整
      if (item[sourceField] !== undefined) {
        result[tableName][field] = item[sourceField];
        delete result[sourceField]; // 从根级别删除原字段
      }
    });
  });
  
  return result;
};

module.exports = {
  formatQuotation
}