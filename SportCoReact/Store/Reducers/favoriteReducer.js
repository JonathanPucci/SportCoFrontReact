// Store/Reducers/favoriteReducer.js

const initialState = { favoriteSports: [] }

function toggleFavorite(state = initialState, action) {
    let nextState;
    console.log(action);
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const favoriteSportIndex = state.favoriteSports.findIndex(item => item.id === action.value.id)
            if (favoriteSportIndex !== -1) {
                // Le Sport est déjà dans les favoris, on le supprime de la liste
                nextState = {
                    ...state,
                    favoriteSports: state.favoriteSports.filter((item, index) => index !== favoriteSportIndex)
                }
            }
            else {
                // Le Sport n'est pas dans les Sports favoris, on l'ajoute à la liste
                nextState = {
                    ...state,
                    favoriteSports: [...state.favoriteSports, action.value]
                }
            }
            return nextState || state
        default:
            return state
    }
}

export default toggleFavorite