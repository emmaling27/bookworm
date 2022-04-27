import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "../src/index.css";
import { ConvexProvider } from "convex-dev/react";
import { convex } from "../src/common";

export function LoginLogout() {
  let { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();
  if (isLoading) {
    return <button className="btn btn-primary">Loading...</button>;
  }
  if (isAuthenticated) {
    return (
      <div>
        {/* We know that Auth0 provides the user's name, but another provider
        might not. */}
        <p>Logged in as {user!.name}</p>
        <button
          className="btn btn-primary"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </button>
      </div>
    );
  } else {
    return (
      <button className="btn btn-primary" onClick={loginWithRedirect}>
        Log in
      </button>
    );
  }
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  console.log("myapp");
  return (
    <Auth0Provider
      domain="dev-pz-qwrna.us.auth0.com"
      clientId="9E9Zg1m8Pi4AleweJPRDrR4iTLK9xWOu"
      redirectUri="http://localhost:3000" // TODO: fix this - should be window.location.origin but that wasn't working for some reason
      cacheLocation="localstorage"
    >
      <ConvexProvider client={convex}>
        {/* <LoginLogout /> */}
        <Component {...pageProps} />
      </ConvexProvider>
    </Auth0Provider>
  );
}
