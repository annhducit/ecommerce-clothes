
import './App.css';
import './components/navbar/Navbar.jsx'
import { Navbar } from './components/navbar/Navbar.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Whatever } from './components/page/Whatever.jsx'
import { Shop } from './components/page/Shop.jsx'
// import { Features } from './components/page/Features.jsx'
import { ShopCategory } from './components/page/ShopCategory.jsx'
import men_banner from './components/assets/men_banner.png';
import women_banner from './components/assets/women_banner.png';
import kid_banner from './components/assets/kid_banner.png';


import { Product } from './components/page/Product.jsx'
import { Cart } from './components/page/Cart.jsx';
import { LoginSingup } from './components/page/LoginSingup.jsx';
import { RegisterSingin } from './components/page/RegisterSingin.jsx';
import { Support } from './components/page/Support.jsx';
import Payment from './components/payment/Payment.jsx';
import OrderSuccess from './components/payment/OrderSuccess.jsx';


function App() {

  return (
    <div >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/Whatever" element={<Whatever />} />
          <Route path="/shop" element={<Shop />} />
          {/* <Route path="/features" element={<Features />} /> */}
          <Route path="/Men" element={<ShopCategory banner={men_banner} description='Men' />} />
          <Route path="/Women" element={<ShopCategory banner={women_banner} description='Women' />} />
          <Route path="/Kid" element={<ShopCategory banner={kid_banner} description='Kid' />} />


          <Route path="/product" element={<Product />} >
            <Route path=":productId" element={<Product />} />
          </Route>

          <Route path="/cart" element={<Cart />} />
          <Route path="/Support" element={<Support />} />

          <Route path="/loginSingup" element={<LoginSingup />} />
          <Route path="/registerSingin" element={<RegisterSingin />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orderSuccess" element={<OrderSuccess />} />


        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
