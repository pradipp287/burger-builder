import React from "react";
import classes from "./Order.module.css";

const order = (props) => {
    const ingredients = [];

    for (const key in props.ingredients) {
        ingredients.push({name : key , amount : props.ingredients[key]});
     };

     let ingredientoutput = ingredients.map(ig => {
         return <span
          style= {{
              textTransform : 'capitalize',
              display:'inline-block',
              margin:'0 8px',
              padding:'5px',
              border : '1px solid #eee'
          }}
         key={ig.name}>{ig.name} ({ig.amount})</span>
     })
  return (
    <div className={classes.Order}>
      <p>Ingredients : {ingredientoutput}</p>
      <p>
        Price: <strong>₹ {Number.parseFloat(props.price).toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default order;
