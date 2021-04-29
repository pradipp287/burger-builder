import React from 'react';
import burgerLogo from '../../assets/burger-logo.png';
import classes from './Logo.module.css';

const logo=(props)=>(
<div className={classes.Logo} style={{height : props.height}}>
    <img src={burgerLogo} alt="myLogo"></img>
</div>
)


export default logo;