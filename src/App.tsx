import { Route, Routes, Link } from 'react-router-dom'
import { LayoutGroup, MotionConfig } from 'motion/react'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <LayoutGroup>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo-dashboard" element={<Dashboard />} />
          <Route
            path="*"
            element={
              <main className="not-found">
                <p className="tiny-label">A little off the beaten path</p>
                <h1>
                  Nothing growing here.
                  <br />
                  <em>Yet.</em>
                </h1>
                <Link className="button button-dark" to="/">
                  Back to the workshop ↗
                </Link>
              </main>
            }
          />
        </Routes>
      </LayoutGroup>
    </MotionConfig>
  )
}
