import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="content-section page-pad">
      <div className="not-found">
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page you opened is not part of the current school portal routes.</p>
        <Link className="primary-button" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
