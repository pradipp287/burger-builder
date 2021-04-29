import * as actionType from "./actionTypes";
import axios from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionType.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData,
  };
};

export const purchaseBurgerFail = (error) => {
  return {
    type: actionType.PURCHASE_BURGER_FAIL,
    error: error,
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionType.PURCHASE_BURGER_START,
  };
};

export const purchaseBurger = (orderData, token) => {
  return (dispatch) => {
    dispatch(purchaseBurgerStart());
    axios
      .post(`/orders.json?auth=${token}`, orderData)
      .then((response) => {
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      })
      .catch((err) => {
        dispatch(purchaseBurgerFail(err));
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionType.PURCHASE_INIT,
  };
};

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionType.FETCH_ORDER_SUCCESS,
    orders: orders,
  };
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionType.FETCH_ORDER_FAIL,
    error: error,
  };
};

export const fetchOrderStart = () => {
  return {
    type: actionType.FETCH_ORDER_START,
  };
};

export const fetchOrders = (token , userId) => {
  return dispatch => {   // (dispatch,getState) we can have access to state here through getState fn
     dispatch(fetchOrderStart())
    axios.get(`/orders.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`)
    .then((res) => {
      const fetchedOrder = [];
      for (const key in res.data) {
          fetchedOrder.push({...res.data[key] , key : key});
      }
      dispatch(fetchOrdersSuccess(fetchedOrder));
    }).catch(err => {
        dispatch(fetchOrdersFail(err));
    });

  }
};
