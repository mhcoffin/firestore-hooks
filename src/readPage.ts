import {db, DocumentReference} from "./firebase";
import {wrapPromise} from "./wrapPromise";

export const readPage = <T>(path: string) => {
  const doc = docRef(path.split('/'))
  const pr = doc.get()
    .then((snap) => {
      return snap.data() as T
    })
  return wrapPromise(pr)
}

const cache = new Map()

export const readPageSlowly = <T>(path: string) => {
  if (cache.has(path)) {
    return cache.get(path)
  }
  console.log(`readPageSlowly(${path}) subscribing...`)
  const pr = new Promise(resolve => setTimeout(resolve, 3000))
    .then(() => docRef(path.split('/')))
    .then(doc => doc.get())
    .then(snap => snap.data() as T)
  const result = wrapPromise(pr)
  cache.set(path, result)
  return result
}

const docRef = (path: string[]): DocumentReference => {
  if (path.length === 0 || path.length % 2 !== 0) {
    throw new Error(`doc path must contain an even number of parts: ${path}`)
  }
  let ref = db.collection(path[0]).doc(path[1])
  for (let k = 2; k < path.length; k += 2) {
    ref = ref.collection(path[k]).doc(path[k + 1])
  }
  return ref
}
