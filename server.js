const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// session
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000 }
}));
app.use(flash());

// exposes user & flash to views
app.use((req,res,next)=>{
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

// rutas
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");

app.use("/", productsRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);

// arranque
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
