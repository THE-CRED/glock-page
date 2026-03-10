import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../../src/server/routers/_app'
import { createContext } from '../../../src/server/trpc'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    console.error(`tRPC Error on '${path}':`, error)
  },
})
