import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../shared/components/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-primary to-secondary rounded-lg mb-8">
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to Sandbox</h1>
            <p className="mb-5">
              Your development playground for building amazing applications with modern technologies.
            </p>
            <Button className="btn-primary">Get Started</Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-primary text-primary-content rounded-full w-16">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <h3 className="card-title">Fast Development</h3>
              <p>Build and iterate quickly with our modern tech stack.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-secondary text-secondary-content rounded-full w-16">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
              <h3 className="card-title">High Performance</h3>
              <p>Optimized for speed and efficiency.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-accent text-accent-content rounded-full w-16">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
              <h3 className="card-title">Beautiful UI</h3>
              <p>Stunning interfaces with DaisyUI components.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-8 bg-base-200 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="mb-8 text-lg">Join thousands of developers building amazing apps.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary btn-lg">Start Building</Button>
            <Button className="btn-outline btn-lg">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
