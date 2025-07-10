import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="grid place-items-center">
      <span>Page not found.</span>
      <Link to="/">Go to Home</Link>
    </div>
  )
}
