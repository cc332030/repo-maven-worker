
const repos = [

  'https://repo1.maven.org/maven2',

  'https://plugins.gradle.org/m2',

  'https://oss.sonatype.org/service/local/repositories/releases/content',

]

const urlPrefix = '://'

function getPath(url) {

  const url2 = url.substring(url.indexOf(urlPrefix) + urlPrefix.length)
  return url2.substring(url2.indexOf('/'))
}

export default {
  async fetch(request, env, ctx) {

    const path = getPath(request.url)

    let failResponse
    for (const repo of repos) {

      const newUrl = `${repo}${path}`
      console.debug('newUrl', newUrl)

      const headers = request.headers
      console.debug('headers', headers)

      const response = await fetch(newUrl, {
        method: request.method,
        redirect: 'follow',
        headers: headers,
      })
      console.debug('response', response)

      const ok = response.ok
      console.debug('ok', ok)
      if(ok) {
        return response
      }

      if (!failResponse) {
        failResponse = request
      }

    }

    return failResponse
  }
};
