import React, { Component } from 'react';
import Aux from '../Auxilary/Auxilary';
import classes from './Layout.module.css';
import ToolBar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux'

class Layout extends Component {

    state = {
        showSideDrawer : false
    }
   SideDrawerClosedHandler=() =>{
 this.setState({showSideDrawer:false});
   }
   drawerToggleClickedHandler = ()=>{
       this.setState((prevState,porps)=>{
           return {showSideDrawer: !prevState.showSideDrawer}
       })
   }

    render() {
        return (
            <Aux>
                <ToolBar isAuth = {this.props.isAuthenticated}  drawerToggleClicked ={this.drawerToggleClickedHandler}/>
                <SideDrawer isAuth = {this.props.isAuthenticated} open={this.state.showSideDrawer}  closed={this.SideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }

}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);
