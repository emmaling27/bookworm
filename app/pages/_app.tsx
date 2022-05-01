import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "../src/index.css";
import { ConvexProvider } from "convex-dev/react";
import { convex } from "../src/common";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Button, Typography } from "@mui/material";

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
        <Typography paragraph>Logged in as {user!.name}</Typography>
        <Button
          variant="contained"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        {" "}
        <Button variant="contained" onClick={loginWithRedirect}>
          Log in
        </Button>
      </div>
    );
  }
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain="dev-pz-qwrna.us.auth0.com"
      clientId="9E9Zg1m8Pi4AleweJPRDrR4iTLK9xWOu"
      redirectUri={typeof window !== "undefined" && window.location.origin}
      cacheLocation="localstorage"
    >
      <ConvexProvider client={convex}>
        <LoginLogout />
        <Component {...pageProps} />
      </ConvexProvider>
    </Auth0Provider>
  );
}
