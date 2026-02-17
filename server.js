require('dotenv').config();
const express = require('express')
const cors = require('cors')
const database = require('./config/database');
const i18n = require('./utils/i18nConfig');
const app = express()
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const infoRoutes = require('./routes/infoRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require("./routes/cartRoutes")
const userInfoRoutes = require("./routes/userInfoRoutes")
const orderRoutes = require("./routes/orderRoutes")
const path = require('path');

app.use(cors({
  origin: "https://www.shop.sndgroup.net",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/info', infoRoutes);
app.use('/categories',categoryRoutes)
app.use('/products',productRoutes)
app.use('/cart',cartRoutes)
app.use('/userInfo',userInfoRoutes)
app.use('/orders',orderRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/",(req,res)=>{
  res.send("Welcome to SND Store")
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

