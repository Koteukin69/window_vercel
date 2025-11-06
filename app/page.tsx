import { Suspense } from 'react';
import Main from "./pages/main";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  )
}
