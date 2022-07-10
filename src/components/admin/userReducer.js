export default function reducer(state, action) {
    switch (action.type) {
        case 'init':
            return {
                query: action.payload.query,
                items: action.payload.items
            }

        case 'add_item':
            return {
                ...state,
                items: [...state.items, action.payload]
            }

        case 'update_query':
            return {
                ...state,
                query: action.payload.query
            }
        default:
            return state;
    }
}