import React, { Component } from "react";
import Button from "./../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { connect } from "react-redux";
import * as actions from '../../../store/action/index';

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
   
    this.props.onOrderBurger(order , this.props.token);
    
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

        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
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
