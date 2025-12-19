import { Toast } from '@base-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import type { LoaderFunction, RouteObject } from 'react-router'
import { createBrowserRouter, RouterProvider } from 'react-router'
import CarbonClose from '~icons/carbon/close'
import { I18nProvider } from './i18n'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

function HydrateFallback() {
  return null
}

export const routes = Object.entries(
  import.meta.glob<{
    default: ComponentType
    loader?: LoaderFunction
    handle?: unknown
    HydrateFallback?: ComponentType
    ErrorBoundary?: ComponentType
  }>('./**/*.tsx', { base: './pages' }),
).map<RouteObject>(([path, request]) => {
  // `./concerts.$id.tsx` -> `concerts.$id`
  const filePath = path.slice(2, -4)

  const index = filePath.endsWith('_index')

  // https://reactrouter.com/how-to/file-route-conventions#file-route-conventions
  const normalizedPath = filePath
    // Index Route: `_index.tsx` -> `/`
    .replaceAll('_index', '')
    // Catch-all Route: `$.tsx` -> `*`
    .replaceAll(/\$$/g, '*')
    // Optional Segments: `($lang).$id.tsx` -> `:lang?/:id`, `item.(edit).tsx` -> `item/edit?`
    .replaceAll(/\(([^).]+)\)/g, '$1?')
    // Dynamic Segments: `item.$id.tsx` -> `item/:id`
    .replaceAll('$', ':')
    // Nested Route: `concerts.trending.tsx` -> `concerts/trending`
    .replaceAll('.', '/')

  return {
    index: index,
    path: normalizedPath,
    HydrateFallback,
    lazy: async () => {
      const route = await request()

      return {
        loader: route.loader,
        handle: route.handle,
        Component: route.default,
        // FIXME: HydrateFallback is not working in lazy routes
        HydrateFallback: route.HydrateFallback ?? null,
        ErrorBoundary: route.ErrorBoundary ?? null,
      }
    },
  }
})

export const router = createBrowserRouter(routes, { basename: '' })

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="relative z-[calc(1000-var(--toast-index))] rounded-lg bg-surface-secondary p-4"
    >
      <Toast.Title className="m-0" />
      <Toast.Description className="m-0" />

      <Toast.Close className="absolute end-2 top-2 flex-center bg-transparent p-1">
        <CarbonClose width={16} height={16} />
      </Toast.Close>
    </Toast.Root>
  ))
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Toast.Provider>
          <RouterProvider router={router} />

          <Toast.Portal>
            <Toast.Viewport className="fixed top-auto right-4 bottom-4">
              <ToastList />
            </Toast.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
