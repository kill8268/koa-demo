const routeList = [
  './mysqlTest.mjs',
  './mongoTest.mjs',
  './redisTest.mjs',
  './user.mjs',
]

export default async (app) => {
  await Promise.all(routeList.map(async (route) => {
    const router = (await import(route)).default
    app.use(router.routes()).use(router.allowedMethods())
  }))
}