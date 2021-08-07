import Layout from "../components/layout";
import React, {  } from "react";
import { useSession } from "next-auth/client";
import UserCard from "@components/Card/UserCard";
import { redirectAuth } from "@utils/ssrAuth";
import { GetServerSideProps } from "next";


export default function Home() {
  const [session] = useSession()
  return (
    <Layout>
      {session && <UserCard name={session.user!.name!} email={session.user!.email!} image={session.user!.image!}/>}
    </Layout>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  return redirectAuth(context)
};