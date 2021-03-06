import React, {Suspense, useEffect, useState} from 'react';
import './App.css';
import {auth, User} from "./firebase";
import {pageReader} from "./readPage";

function App() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    auth.onAuthStateChanged((u: User | null) => {
      setUser(u)
    })
  })
  if (user === null) return <div>Signing in...</div>
  return <WithUser user={user}/>
}

const WithUser = ({user}: { user: User }) => {
  const reader = pageReader(`Users/${user.uid}`)
  return (
    <div className="App">
      <Suspense fallback={<div>loading...</div>}>
        <Consumer reader={reader}/>
        <Consumer2 uid={user.uid}/>
      </Suspense>
    </div>
  )
}

const usePage = (path: string) => {
  subscribeTo(path)
  return pageReader(path).read()
}

const Consumer2 = ({uid}: { uid: string }) => {
  const value = usePage(`Users/${uid}`)
  return (
    <div>
      {JSON.stringify(value)}
    </div>
  )
}

const useReader = (reader: any) => {
  return reader.read()
}

const Consumer = ({reader}: any) => {
  const value = useReader(reader)
  return (
    <div>
      {JSON.stringify(value)}
    </div>
  )
}

export default App;
