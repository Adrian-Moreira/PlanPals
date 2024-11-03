import config from '../config'
import axios from 'axios'

const apiURI = config.api.URL

const queueState = {
  queue: [],
  running: new Set(),
  concurrency: 3,
}

const processQueue = async () => {
  if (queueState.running.size >= queueState.concurrency || queueState.queue.length === 0) {
    return
  }

  const { request, resolve, reject } = queueState.queue.shift()
  const requestId = Symbol('request')
  queueState.running.add(requestId)

  try {
    const response = await request()
    resolve(response)
  } catch (error) {
    reject(error)
  } finally {
    queueState.running.delete(requestId)
    processQueue()
  }
}

const enqueue = (request) =>
  new Promise((resolve, reject) => {
    queueState.queue.push({
      request,
      resolve,
      reject,
    })
    processQueue()
  })

const createRequest =
  (requestFn) =>
  (...args) =>
    enqueue(() => requestFn(...args))

const apiLib = {
  get: createRequest((endpoint, { params = {} } = {}) => axios.get(apiURI + endpoint, { params })),

  post: createRequest((endpoint, { params = {}, data = {} } = {}) =>
    axios.post(apiURI + endpoint, { ...data, params }),
  ),

  put: createRequest((endpoint, { params = {}, data = {} } = {}) => axios.put(apiURI + endpoint, { ...data, params })),

  patch: createRequest((endpoint, { params = {}, data = {} } = {}) =>
    axios.patch(apiURI + endpoint, { ...data, params }),
  ),

  delete: createRequest((endpoint, { params = {} } = {}) => axios.delete(apiURI + endpoint, { params })),

  setQueueConcurrency: (concurrency) => {
    queueState.concurrency = concurrency
    processQueue()
  },

  getQueueStatus: () => ({
    queueLength: queueState.queue.length,
    runningRequests: queueState.running.size,
    concurrency: queueState.concurrency,
  }),
}

export default apiLib
