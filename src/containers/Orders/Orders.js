import React, { Component } from "react";
import Order from "../../components/Order/Order";
import axios from "./../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/action/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

class Orders extends Component {
  // state = {     // before redux
  //   orders: [],
  //   loading: true,
  // };

  componentDidMount() {
    //before redux 24-03-21
    // axios.get("/orders.json")
    // .then((res) => {
    //   const fetchedOrder = [];
    //   for (const key in res.data) {
    //       fetchedOrder.push({...res.data[key] , key : key});
    //   }
    //   this.setState({loading : false , orders : fetchedOrder});
    // }).catch(err => {
    //     this.setState({loading:false});
    // });
    this.props.onFetchOrders(this.props.token, this.props.userId); //with redux
  }

  render() {
    let orders = <Spinner />;
    if (!this.props.loading) {
      orders = this.props.orders.map((order) => {
        return (
          <Order
            key={order.key}
            ingredients={order.ingredients}
            price={order.price}
          />
        );
      });
    }
    return <div>{orders}</div>;
  }
}

export const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token : state.auth.token,
    userId : state.auth.userId
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token,userId) => dispatch(actions.fetchOrders(token,userId)),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders, axios));
