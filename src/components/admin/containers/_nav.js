
const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/admin/dashboard',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['User Manager']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'User',
    to: '/admin/user',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Data Manager']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Category',
    to: '/admin/category',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Course',
    to: '/admin/course',
  },
]

export default _nav
