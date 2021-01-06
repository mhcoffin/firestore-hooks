import {db, DocumentReference} from "./firebase";
import {wrapPromise} from "./wrapPromise";

// TODO: build a better cache
type Reader<T> = { read: () => T }
const pageCache = new Map<string, Reader<any>>()

type PageSubscription = {
  unsubscribe: () => void,
  count: number,

}

const subscriptionCache = new Map<string, PageSubscription>()

export const addSubscription = <T>(path: string) => {
  const c = subscriptionCache.get(path)
  if (c) {
    c.count++
  } else {
    const unsub = docRef(path.split('/'))
      .onSnapshot(snap => {
        if (!snap.exists) {
          throw new Error(`page does not exist`)
        }
        return snap.data() as T
      })
    const record = {
      unsubscribe: unsub,
      count: 1
    }
    subscriptionCache.set(path, record)
  }
}

// Returns a promise of page contents.
// TODO: add a type guard
export const page = <T>(path: string): Promise<T> => {
  return new Promise(resolve => setTimeout(resolve, 2500))
    .then(() => docRef(path.split('/')))
    .then(doc => doc.get())
    .then(snap => snap.data() as T)
}

export const pageReader = <T>(path: string): Reader<T> => {
  const cachedResult = pageCache.get(path)
  if (cachedResult !== undefined) return cachedResult

  console.log(`readPageSlowly(${path}) subscribing...`)
  const pr = page<T>(path)
  const result = wrapPromise(pr)
  pageCache.set(path, result)
  return result
}

// Parse a string of the form "collection/doc/..." and return a doc reference
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
