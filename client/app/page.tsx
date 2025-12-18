
import Link from "next/link";
import Button from "../components/ui/Button";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <main className="text-center px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Unlock Your Potential with{" "}
          <span className="text-indigo-600">SkillSync</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Your AI-powered micro-mentorship platform. Get instant feedback,
          connect with experts, and accelerate your growth.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/signup">
            <Button className="text-lg px-8 py-3">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button className="text-lg px-8 py-3">
              Learn More
            </Button>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              SkillSync provides you with the tools and mentorship to achieve
              your goals.
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                {/* Placeholder for an icon */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-medium">AI-Powered Feedback</h3>
              <p className="mt-2 text-base text-slate-600">
                Get instant, personalized feedback on your skills from our
                advanced AI.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                {/* Placeholder for an icon */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.977"
                  />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-medium">Expert Mentors</h3>
              <p className="mt-2 text-base text-slate-600">
                Connect with industry experts for one-on-one mentorship
                sessions.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                {/* Placeholder for an icon */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-medium">Track Your Growth</h3>
              <p className="mt-2 text-base text-slate-600">
                Monitor your progress with our comprehensive analytics and
                reporting tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Getting started with SkillSync is easy.
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold">1. Sign Up</h3>
              <p className="mt-2 text-base text-slate-600">
                Create your account in minutes.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">2. Find a Mentor</h3>
              <p className="mt-2 text-base text-slate-600">
                Browse our network of expert mentors.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">3. Book a Session</h3>
              <p className="mt-2 text-base text-slate-600">
                Schedule a session that fits your schedule.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">4. Start Learning</h3>
              <p className="mt-2 text-base text-slate-600">
                Connect with your mentor and start growing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">
              Loved by Learners Worldwide
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Don't just take our word for it. Here's what our users have to
              say.
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 lg:grid-cols-2">
            <div className="p-6 bg-slate-100 rounded-lg">
              <p className="text-lg text-slate-700">
                "SkillSync has been a game-changer for my career. The
                AI-powered feedback is incredibly insightful, and my mentor has
                been instrumental in my growth."
              </p>
              <div className="mt-4">
                <p className="font-bold">- Jane Doe</p>
                <p className="text-sm text-slate-600">Software Engineer</p>
              </div>
            </div>
            <div className="p-6 bg-slate-100 rounded-lg">
              <p className="text-lg text-slate-700">
                "I love how easy it is to find and connect with mentors. The
                platform is intuitive and has helped me land my dream job."
              </p>
              <div className="mt-4">
                <p className="font-bold">- John Smith</p>
                <p className="text-sm text-slate-600">UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
