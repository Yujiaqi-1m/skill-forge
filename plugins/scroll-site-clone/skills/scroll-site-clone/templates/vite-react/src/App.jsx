import { useEffect } from 'react'
import { initLenis } from './lib/lenis'
// Import ported section components here as they are built, in the
// original page's order — e.g.:
//   import HeroStage from './components/HeroStage'
//   import KeywordWall from './components/KeywordWall'

export default function App() {
  useEffect(() => {
    // Global smooth scroll — parameters come from the dump (see lib/lenis.js).
    const dispose = initLenis()
    return dispose
  }, [])

  return (
    <>
      {/* Ported sections mount here, replacing this placeholder.
          Each is a thin shell over the original DOM structure:
          see the skill's cookbook §3 for the component contract. */}
      <main className="placeholder">
        <p>
          No sections ported yet. Dump the original into .forensics/ and
          start with the blueprint table (skill Step 3).
        </p>
      </main>
    </>
  )
}
