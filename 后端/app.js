const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

// 路由
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/subAdmin'));
app.use('/api', require('./routes/subUser')); // 用户管理
app.use('/api', require('./routes/subBasic')); // 基础资料
app.use('/api', require('./routes/subOrder')); // 订单管理
app.use('/api', require('./routes/subPurchase')); // 采购管理
app.use('/api', require('./routes/subGetList')); // 获取其他列表相关的接口
app.use('/upload', require('./routes/upload'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});


// https://github.com/i4uutui/ceErns.git