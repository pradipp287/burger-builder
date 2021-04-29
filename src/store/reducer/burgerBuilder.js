import * as actionTypes from "../action/actionTypes";
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  totalPrice: 40,
  error: null,
  building : false
};
const INGREDIENT_PRICES = {
  salad: 20,
  cheese: 15,
  meat: 70,
  bacon: 30,
};

const addIngredient = (state , action ) => {
  const updatedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
  const updatedIngredients = updateObject(state.ingredients , updatedIngredient);
  const updatedState = {
    ingredients : updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building : true
  }
  return updateObject(state , updatedState);
};

const removeIngredient = (state , action ) => {
  const updatedIng = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
      const updatedIngs = updateObject(state.ingredients , updatedIng);
      const updatedSt = {
        ingredients : updatedIngs,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        building : true
      }
      return updateObject(state , updatedSt);
}

const setIngredients = (state , action ) => {
  return updateObject(state , {
    ingredients: {
      salad : action.ingredients.salad,
      cheese : action.ingredients.cheese,
      meat :action.ingredients.meat,
      bacon : action.ingredients.bacon,
    } ,
    totalPrice : 40,
    error: false,
    building :false
  })
}

const fetchIngredientFailed = ( state , action ) => {
  return updateObject(state ,  {error: true });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state , action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state , action);
    case actionTypes.FETCH_INGREDIENT_FAILED: return fetchIngredientFailed(state , action);
    default:
      return state;
  }
};

export default reducer;
