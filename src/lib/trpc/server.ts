import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma/client'

type CreateContextOptions = {
  session: Session | null
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  }
}

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req } = opts
  const session = null // Will be populated by Clerk middleware

  return createInnerTRPCContext({
    session,
  })
}

const t = initTRPC.context<typeof createTRPCContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

// Import and export the app router
import { appRouter } from './routers'
export { appRouter }
export type AppRouter = typeof appRouter
