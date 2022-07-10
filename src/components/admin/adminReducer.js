export default function reducer(state, action) {
    switch (action.type) {
        case 'initCategory':
            return {
                ...state,
                query: action.payload.query,
                categories: action.payload.items
            }

        case 'initCourse':
            return {
                ...state,
                query: action.payload.query,
                courses: action.payload.items
            }
        case 'initUser':
            return {
                ...state,
                query: action.payload.query,
                users: action.payload.items
            }
        default:
            return state;
    }
}