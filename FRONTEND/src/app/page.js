"use client";
import withAuth from "@/authservice/auth/withauth";
import Welcome from "@/pages/welcome";

const Home = () => {
  withAuth();

  return (
    <>
      <Welcome />
    </>
  );
};

export default withAuth(Home);
