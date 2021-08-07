import Layout from "../components/layout";
import React, { useEffect } from "react";
import { useSession } from "next-auth/client";
import UserCard from "@components/Card/UserCard";
import { useRouter } from "next/dist/client/router";


export default function Home() {
  const router = useRouter()
  const [session] = useSession()
  useEffect(() => {
    session 
      ? router.push('/')
      : router.push('/auth')
  }, [session, router])
  return (
    <Layout>
      {session && <UserCard name={session.user!.name!} email={session.user!.email!} image={session.user!.image!}/>}
    </Layout>
  )
}


