import Layout from "../components/layout";
import {
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  useColorModeValue,
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Illustration } from "../components/assets/illustrations";
import { useRouter } from "next/dist/client/router";
import TitleLogo from "../components/icons/TitleLogo";
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/client'
import React from "react";


export default function Home() {
  const [session, loading] = useSession()

  const router = useRouter()
  return (
    <Layout>
      {/* <SimpleCard /> */}
      {!session ? (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign In</button>
        </>
        )
        : (  
        <>
          signed in as {JSON.stringify(session)} <br />
          <button onClick={() => signOut()}>Sign Out</button>
        </>
        )
      }
      
    </Layout>
  )
}


export function SimpleCard() {
  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>イサンPAY</Heading>
          <Heading fontSize={'4xl'}>LINEアカウントの認証</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
            <Text fontSize={'lg'} color={'gray.600'}>
              本サービスでは、認証時にユーザーに許可された場合のみ、LINEアカウントに登録されているメールアドレスを取得します。取得したメールアドレスは以下の目的以外で使用されることはありません。また、法令で定められた場合を除き、第三者への提供はいたしません。
            </Text>
          <Stack spacing={4} p="10" bg="gray.100">
            <ul>
              <li>ユーザーのユニークIDとして管理に利用</li>
              <li>本サービスからのお知らせやメールマガジンの配信に利用</li>
              <li>退会時、問い合わせ時などの連絡のために利用</li>
            </ul>
          </Stack>
          <Button w="full" my="2" bg="#05B803" color="white"> LINEログインで認証</Button>
          <Button w="full" > 戻る</Button>
        </Box>
      </Stack>
    </Flex>
  );
}