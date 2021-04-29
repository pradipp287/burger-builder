import * as actionType from "./actionTypes";
import axios from "../../axios-orders";


export const addIngredient = (name) => {
  return {
    type: actionType.ADD_INGREDIENT,
    ingredientName: name,
  };
};

export const removeIngredient = (name) => {
  return {
    type: actionType.REMOVE_INGREDIENT,
    ingredientName: name,
  };
};

export const setIngredients = (ingredients) => {
  return {
    type: actionType.SET_INGREDIENTS,
    ingredients: ingredients,
  };
};

export const fetchIngredientFailed = () => {
    return {
        type : actionType.FETCH_INGREDIENT_FAILED
    }
}

export const initIngredients = () => {
  return dispatch => {
      axios
      .get(
        "https://react-my-burger-a49ab-default-rtdb.firebaseio.com/ingredients.json"
      )
      .then((response) => {
       dispatch(setIngredients(response.data));
      })
      .catch((err) => {
        dispatch(fetchIngredientFailed())
      });

  }
};
