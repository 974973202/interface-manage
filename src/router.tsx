import { lazy, Suspense, LazyExoticComponent } from 'react';
import {
  BrowserRouter,
  Routes,
  useRoutes,
  LayoutRouteProps,
  PathRouteProps,
  IndexRouteProps,
  RouteObject,
} from 'react-router-dom';
import App from './App';

type RouteType = {
  path?: string;
  component: LazyExoticComponent<any>;
  children?: RouteType[];
  caseSensitive?: boolean; // 路径大小写敏感属性，默认是不敏感
  index?: boolean;
};

const routes: Array<RouteType> = [
  {
    path: '/',
    component: lazy(() => import('./App')),
    children: [
      {
        index: true,
        component: lazy(() => import('./page/interface')),
      },
      {
        path: '/module',
        component: lazy(() => import('./page/module')),
      },
      {
        path: '/version',
        component: lazy(() => import('./page/version')),
      },
      {
        path: '/rule',
        component: lazy(() => import('./page/rule')),
      },
    ],
  },
];

const syncRouter = (routes: RouteType[]): RouteObject[] => {
  const routers: RouteObject[] = [];
  routes.forEach(route => {
    routers.push({
      path: route.path ?? '',
      index: route.index ?? false,
      caseSensitive: route.caseSensitive ?? false,
      element: (
        <Suspense fallback={<div>loading...</div>}>
          <route.component />
        </Suspense>
      ),
      children: route.children && syncRouter(route.children),
    });
  });
  return routers;
};

export default () => useRoutes(syncRouter(routes));
