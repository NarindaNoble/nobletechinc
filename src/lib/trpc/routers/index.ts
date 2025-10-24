import { router } from '../server'
import { aliRouter } from './ali'

export const appRouter = router({
  ali: aliRouter,
})

export type AppRouter = typeof appRouter
