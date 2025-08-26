import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
  component: About,
});

function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero bg-base-200 py-12 rounded-lg mb-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">About Sandbox</h1>
            <p className="text-xl mb-8">
              A modern development platform built with cutting-edge technologies to help developers 
              create amazing applications faster and more efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Team Member 1 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-primary text-primary-content rounded-full w-24">
                  <span className="text-3xl">👨‍💻</span>
                </div>
              </div>
              <h3 className="card-title">Developer</h3>
              <p className="text-base-content/70">Full-stack developer passionate about modern web technologies.</p>
              <div className="card-actions">
                <div className="badge badge-primary">React</div>
                <div className="badge badge-secondary">TypeScript</div>
                <div className="badge badge-accent">Node.js</div>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-secondary text-secondary-content rounded-full w-24">
                  <span className="text-3xl">🎨</span>
                </div>
              </div>
              <h3 className="card-title">Designer</h3>
              <p className="text-base-content/70">UI/UX designer focused on creating beautiful and intuitive interfaces.</p>
              <div className="card-actions">
                <div className="badge badge-primary">Figma</div>
                <div className="badge badge-secondary">Tailwind</div>
                <div className="badge badge-accent">DaisyUI</div>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-accent text-accent-content rounded-full w-24">
                  <span className="text-3xl">🚀</span>
                </div>
              </div>
              <h3 className="card-title">Architect</h3>
              <p className="text-base-content/70">System architect specializing in scalable and maintainable solutions.</p>
              <div className="card-actions">
                <div className="badge badge-primary">AWS</div>
                <div className="badge badge-secondary">Docker</div>
                <div className="badge badge-accent">Kubernetes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 bg-base-200 rounded-lg">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="stat-title">Projects Built</div>
            <div className="stat-value text-primary">100+</div>
            <div className="stat-desc">↗︎ 20% more than last month</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="stat-title">Happy Developers</div>
            <div className="stat-value text-secondary">500+</div>
            <div className="stat-desc">↗︎ 15% more than last month</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="stat-title">Performance</div>
            <div className="stat-value">99.9%</div>
            <div className="stat-desc">↗︎ 5% more than last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
