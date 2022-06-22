import { createStore } from 'vuex'
import axios from "axios"

// Create a new store instance.
var carts = localStorage.getItem('carts')
var user = localStorage.getItem("user")

const store = createStore({
  state () {
    return {
      user:user ? JSON.parse(user): null,
      productDetail:{},
      categoryId:[],
      carts:carts ? JSON.parse(carts): [],
      product: null,
      products:[],
    }
  },
  getters : {
     CartItemCount(state) {
      return state.carts.length; 
     },
     CartItemTotal(state) {
       let total = 0;
       state.carts.forEach(item => {
         total += item.product.price * item.quantity
       });
       return total
     }
  },
  actions: {
    async getProducts({commit}) {
      await axios
        .get("https://localhost:44309/api/Product/getAll")
        .then((res) => {
          commit('SET_PRODUCTS',res.data)
          console.log(res.data);
       
        });
   
   },
    async getProductsDetail({commit},id) {
          await axios
            .get(`https://localhost:44309/api/Product/GetById/${id}`)
            .then((res) => {
              commit('SET_PRODUCT_DETAIL',res.data)
              console.log(res.data);
              window.scrollTo(0, 0);
            });
       
       },
          getUser({commit},fullName) {
        commit('USER',fullName)
       },
       async getCategoryId({commit},id) {
      await axios
        .get(
          `https://localhost:44309/api/Product/GetProductByCategory/${id}`
        )
        .then((res) => {
        commit('SET_CATEGORYID',res.data.items)
          console.log(res.data.items);
        });
       },
       addProductToCart({commit},{
         product,quantity
       }){
         commit('ADD_TO_CART',{product,quantity})
         alert('Add To Cart Success')
       },
       removeProductinCart({commit},id){
         commit('REMOVE_PRODUCT_IN_CART',id)
       },
  },
  mutations: {
      SET_PRODUCTS(state,products) {
      state.products = products
      },
      USER(state,fullName){
        state.user = fullName
      },
      SET_PRODUCT_DETAIL(state,item){
        state.productDetail = item
      },
      SET_CATEGORYID(state,item){
        state.categoryId = item
      },
      ADD_TO_CART(state,{product,quantity}){

        let ProductInCart = state.carts.find(item =>{
          return item.product.id === product.id;
        });
        if(ProductInCart){
          ProductInCart.quantity +=quantity;
          localStorage.setItem("carts", JSON.stringify(state.carts))
          return;
        }
         state.carts.push({product,quantity})
         console.log({product,quantity})
         localStorage.setItem("carts", JSON.stringify(state.carts))
         console.log(carts)
      },
      REMOVE_PRODUCT_IN_CART(state,id) { 
         const index =  state.carts.indexOf(id)   
          state.carts.splice(index,1)
          localStorage.setItem("carts", JSON.stringify(state.carts))
        
      }
  },

})

export default store