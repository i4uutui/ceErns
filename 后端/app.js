const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger.js');

app.use(cors());
app.use(bodyParser.json());

// 配置 Swagger 文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 路由
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/subAdmin'));
app.use('/api', require('./routes/subUser')); // 用户管理
app.use('/api', require('./routes/subBasic')); // 基础资料
app.use('/api', require('./routes/subOrder')); // 订单管理
app.use('/api', require('./routes/subPurchase')); // 采购管理
app.use('/api', require('./routes/subProduct')); // bom表管理
app.use('/api', require('./routes/outSourcing')); // 委外管理
app.use('/api', require('./routes/subProduction')); // 生产管理
app.use('/api', require('./routes/subGetList')); // 获取其他列表相关的接口
app.use('/upload', require('./routes/upload'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`端口 ${PORT}`);
  console.log(`文档地址: http://localhost:${PORT}/api-docs`);
});


// https://github.com/i4uutui/ceErns.git