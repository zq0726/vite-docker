import Layout from '@/layout/index.vue'

export const systemRouter = [
  {
    path: '/system',
    name: 'system',
    component: Layout,
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/index.vue'),
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role/index.vue'),
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/system/department/index.vue'),
      },
    ],
  },
]
