export default function reducer(state, action) {
	switch (action.type) {
		// case 'initCategoriesList':
		//   return {
		//     ...state,
		//     categories: action.payload.categories
		//   }

		case 'initCoursesList':
			return {
				...state,
				courses: action.payload.courses,
				query: action.payload.query,
				mode: action.payload.mode,
			}

		case 'reloadCourses':
			return {
				...state,
				courses: action.payload.courses,
			}
		case 'initCoursesList2':
			return {
				...state,
				courses2: action.payload.courses2,
				query: action.payload.query
			}

		case 'update_query':
			return {
				...state,
				query: action.payload.query
			}

		case 'getCategory':
			return {
				...state,
				// courses: state.courses.map(course => course.id === action.payload.id ? { ...course, categoryId: action.payload.category } : course)
				categories: action.payload.categories,
				query: action.payload.query
			}

		case 'changeMode':
			return {
				...state,
				// courses: state.courses.map(course => course.id === action.payload.id ? { ...course, categoryId: action.payload.category } : course)
				mode: action.payload.mode,
				key: action.payload.key
			}
		case 'setAccount':
			return {
				...state,
				// courses: state.courses.map(course => course.id === action.payload.id ? { ...course, categoryId: action.payload.category } : course)
				account: action.payload.account,
				query: action.payload.query
			}
		case 'setPayment':
			return {
				...state,
				// courses: state.courses.map(course => course.id === action.payload.id ? { ...course, categoryId: action.payload.category } : course)
				payment: action.payload.payment,
				query: action.payload.query
			}

		case 'setTeacherCourse':
			return {
				...state,
				teacherCourse: action.payload.teacherCourse,
				query: action.payload.query
			}

		case 'getTeacher':
			return {
				...state,
				teacher: action.payload.teacher
			}

		case 'getFeedback':
			return {
				...state,
				feedback: action.payload.feedback
			}

		case 'getHotCourses':
			return {
				...state,
				hotCourses: action.payload.hotCourses
			}

		case 'getAccountInfo':
			return {
				...state,
				accountInfo: action.payload.accountInfo
			}
		case 'initLocalFile':
			return {
				...state,
				localFiles: []
			}
		case 'addLocalFile':
			return {
				...state,
				localFiles: [...state.localFiles, action.payload]
			}
		case 'clearLocalFiles':
			return {
				...state,
				localFiles: []
			}
		//   case 'add_item':
		//     return {
		//       ...state,
		//       items: [...state.items, action.payload]
		//     }

		//   case 'update_query':
		//     return {
		//       ...state,
		//       query: action.payload.query
		//     }

		//   case 'finish_task':
		//     return {
		//       ...state,
		//       items: state.items.map(item => item.id === action.payload.id ? { ...item, complete: true } : item)
		//     }

		default:
			return state;
	}
}
