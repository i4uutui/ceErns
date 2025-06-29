const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定图片存储的文件夹
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    // 生成唯一的文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 图片上传接口
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未上传图片', code: 400 });
  }
  // 返回图片的路径
  const imagePath = `/public/uploads/${req.file.filename}`;
  res.json({ message: '图片上传成功', imagePath, code: 200 });
});

module.exports = router;