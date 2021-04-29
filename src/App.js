import React from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import { Route, Switch , withRouter , Redirect } from "react-router-dom";
import Checkout from "./containers/Checkout/Checkout";
import Orders from "./containers/Orders/Orders";
import Auth from './containers/Auth/Auth';
import Logout from "./containers/Auth/Logout/Logout";
import * as actions from './store/action/index';
import { connect } from 'react-redux';

class App extends React.Component {
  // Commented code added for testing of interceptor removal at removal of BurgerBuilder component which exported along with withErrorhandler aux component
  // state = {
  //   show: true
  // };

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({show : false});
    // }, 5000);
    this.props.onTryAuthSignup();
  }
  render() {
    let routes = (
      <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
    );
    
    if(this.props.isAuthenticated){
      routes = (
        <Switch>
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={Auth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>
      )
    }

    return (
      <div>
        <Layout>
          {/* {this.state.show ? <BurgerBuilder /> : null} */}
           {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated : state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAuthSignup : ()=> dispatch(actions.suthCheckState())
  };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
