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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});


// https://github.com/i4uutui/ceErns.git