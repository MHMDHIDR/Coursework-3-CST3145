const API_URL = 'https://afterschoolbookingsystem-env.eba-mczp9a9e.eu-west-2.elasticbeanstalk.com/images'
let cacheName = 'after-school-app-cache'
let cacheFiles = ['index.html', 'public/after-school-app-32.png', 'public/after-school-app-512.png',
`${API_URL}/math.png`,
`${API_URL}/art.png`,
`${API_URL}/science.png`,
`${API_URL}/english.png`,
`${API_URL}/history.png`,
`${API_URL}/music.png`,
`${API_URL}/dance.png`,
`${API_URL}/basketball.png`,
`${API_URL}/programming.png`,
`${API_URL}/physics.png`,
`${API_URL}/biology.png`,
`${API_URL}/chemistry.png`,
`${API_URL}/soccer.png`,
`${API_URL}/yoga.png`,
`${API_URL}/cooking.png`,
`${API_URL}/french.png`,
`${API_URL}/spanish.png`,
`${API_URL}/swimming.png`,
`${API_URL}/robotics.png`,
`${API_URL}/astronomy.png`]

self.addEventListener('install', function (e) {
  console.log('[Service Worker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[Service Worker] Caching files')
      return cache.addAll(cacheFiles)
    })
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cachedFile) {
      //if the file is in the cache, retrieve it from there
      if (cachedFile) {
        console.log(
          '[Service Worker] Resource fetched from the cache for: ' + e.request.url
        )
        return cachedFile
      } 
      // else {
      //   //if the file is not in the cache, download the file
      //   return fetch(e.request).then(function (response) {
      //     return caches.open(cacheName).then(function (cache) {
      //       //add the new file to the cache
      //       cache.put(e.request, response.clone())
      //       console.log(
      //         '[Service Worker] Resource fetched and saved in the cache for: ' +
      //           e.request.url
      //       )
      //       return response
      //     })
      //   })
      // }
    })
  )
})
