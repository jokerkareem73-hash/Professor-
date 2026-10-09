const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// ===== عدل هنا يا اسطى =====
const ADMIN_PHONE = "2XXXXXXXXXX"; // حط رقمك بعد +2 مثلا: 201234567890
const SHOP_LOCATION = "LOCATION"; // حط مكانك مثلا: الغردقة - الدهار
// ============================

app.use(express.json());
app.use(require('cors')());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if(!fs.existsSync('db.json')) fs.writeFileSync('db.json', '[]');
if(!fs.existsSync('orders.json')) fs.writeFileSync('orders.json', '[]');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req,file,cb)=> cb(null, Date.now()+path.extname(file.originalname))
});
const upload = multer({storage});

app.get('/api/parts', (req,res)=>{ res.json(JSON.parse(fs.readFileSync('db.json'))); });
app.post('/api/parts', upload.single('image'), (req,res)=>{
  let data = JSON.parse(fs.readFileSync('db.json'));
  let newPart = { id: Date.now(), name: req.body.name, price: req.body.price, image: '/uploads/' + req.file.filename };
  data.push(newPart); fs.writeFileSync('db.json', JSON.stringify(data)); res.json({ok:true});
});
app.delete('/api/parts/:id', (req,res)=>{
  let data = JSON.parse(fs.readFileSync('db.json')); data = data.filter(p=>p.id!= req.params.id);
  fs.writeFileSync('db.json', JSON.stringify(data)); res.json({ok:true});
});
app.get('/api/orders', (req,res)=>{ res.json(JSON.parse(fs.readFileSync('orders.json'))); });
app.post('/api/orders', (req,res)=>{
  let orders = JSON.parse(fs.readFileSync('orders.json'));
  let order = { id: Date.now(), customerName: req.body.customerName, customerPhone: req.body.customerPhone, address: req.body.address, items: req.body.items, total: req.body.total, date: new Date().toLocaleString('ar-EG'), status: 'جديد' };
  orders.unshift(order); fs.writeFileSync('orders.json', JSON.stringify(orders)); res.json({ok:true});
});
app.delete('/api/orders/:id', (req,res)=>{
  let orders = JSON.parse(fs.readFileSync('orders.json')); orders = orders.filter(o=>o.id!= req.params.id);
  fs.writeFileSync('orders.json', JSON.stringify(orders)); res.json({ok:true});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log('قطع غيار الاستاذ شغال'));
