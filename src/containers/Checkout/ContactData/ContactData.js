import React, { Component } from "react";
import Button from "./../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { connect } from "react-redux";
import * as actions from '../../../store/action/index';
import paymentAxios from 'axios';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched:false
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched:false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Zip Code",
        },
        value: "",
        validation: {
          required: true,
          minLength:5,
          maxLength:5
        },
        valid: false,
        touched:false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched:false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your e-mail",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched:false
      },
      deliverMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        validation: {},
        valid:true
      },
    },
    formIsValid:false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    //this.setState({ loading: true });  //06-03-2021 before redux
    const formData = {};
    for (const formelementIdentifier in this.state.orderForm) {
      formData[formelementIdentifier] = this.state.orderForm[formelementIdentifier].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      order: formData,
      userId : this.props.userId
    };
      
    paymentAxios.post('http://localhost:4000/orders',{
      amount: +this.props.price * 100, // amount in the smallest currency unit
      currency: "INR",
       receipt: "order_rcptid_Pradip_24",
    }).then(res => {
      //alert(JSON.stringify(res.data))
    const that = this;
      var options = {
        "key": "rzp_test_VojxnZSnxaplrV", // Enter the Key ID generated from the Dashboard
        "amount": `${+this.props.price * 100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Burger Corp",
        "description": "Test Transaction",
        "image": "/burger-logo.png",
        "order_id":res.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
            const responseData = {
              paymentId : response.razorpay_payment_id,
              order_id : response.razorpay_order_id,
              razorSignature : response.razorpay_signature
            };
            paymentAxios.post('http://localhost:4000/verifySignature',responseData)
                .then(response => {
                  if(response.data.success){
                    alert(`Amount Paid Successfully`);
                     const updatedOrder = {...order, ...responseData};
                    that.props.onOrderBurger(updatedOrder , that.props.token);
                  } else{
                    alert(`Error occured during payment`);
                  }
                })
        },
        "prefill": {
            "name": "Pradip Patil",
            "email": "pradip.patil@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
     // eslint-disable-next-line no-undef
  var rzp1 = new Razorpay(options);
  rzp1.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
   });
   rzp1.open();
    
  })
  // this.props.onOrderBurger(order , this.props.token);
    
    // axios                                  //06-03-2021 before redux
    //   .post("/orders.json  ", order)
    //   .then((response) => {
    //     this.setState({ loading: false });
    //     this.props.history.push("/");
    //   })
    //   .catch((err) => {
    //     this.setState({ loading: false });
    //   });
  };

    
 checkInputValidity(value , rules){
   let isValid = true;
   if(rules.required){
     isValid = value.trim() !=='' && isValid;
   }

   if(rules.minLength){
     isValid = value.length >= rules.minLength && isValid
   }

   if(rules.maxLength){
    isValid = value.length >= rules.maxLength && isValid
  }
   return isValid;
 }
   

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true; 
    updatedFormElement.valid = this.checkInputValidity(event.target.value, updatedFormElement.validation);
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    let formIsValid =true;
     for (const inputIdentifier in updatedOrderForm) {
       formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
     }

    this.setState({ orderForm: updatedOrderForm, formIsValid : formIsValid });
  };

  render() {
    const formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({ id: key, config: this.state.orderForm[key] });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched = {formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}

        <Button btnType="Success" disabled={!this.state.formIsValid}>PAY ₹{this.props.price}</Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    ings : state.burgerBuilder.ingredients,
    price : state.burgerBuilder.totalPrice,
    loading : state.order.loading,
    token : state.auth.token,
    userId : state.auth.userId
  }
}

const mapDispatchToProps = dispach => {
  return {
     onOrderBurger : (orderData, token) => dispach(actions.purchaseBurger(orderData, token))

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));
