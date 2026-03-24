import {usePuterStore} from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const loadPuterScript = () => {
  if (!document.querySelector('script[src*="puter.com"]')) {
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    document.head.appendChild(script);
    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('Puter.js load failed'));
    });
  }
  return Promise.resolve();
};

export const meta = () => ([
  { title: 'Resumind | Auth' },
  { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
  const { init, isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();

  useEffect(() => {
    loadPuterScript().then(() => {
      // Wait a bit for window.puter to initialize
      setTimeout(init, 500);
    }).catch((err) => {
      console.error('Puter.js failed to load:', err);
    });
  }, [init]);

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next || '/');
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth
