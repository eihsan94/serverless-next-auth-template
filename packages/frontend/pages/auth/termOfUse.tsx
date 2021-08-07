import { Flex, useColorModeValue, Stack, Heading, Box, Button, Text } from '@chakra-ui/react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { FcGoogle } from 'react-icons/fc';
import { GetServerSideProps } from "next";
import { redirectHome } from "@utils/ssrAuth";

interface Props {
}

const TermOfUse = () => {
  const router = useRouter()
  const loginType: 'LINE' | 'GOOGLE' = Object.keys(router.query)[0] as 'LINE' | 'GOOGLE'

  const termOfUses = {
      LINE: {bg: '#05B803', color: 'white', icon: <></>,  clickHandler: () => signIn('line')},
      GOOGLE: {bg:'white', color: 'black', icon: <FcGoogle />,  clickHandler: () => signIn('google')},
  }
  const currentProvider = termOfUses[loginType]
    return (
        <Flex
          align={'center'}
          h={'100vh'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}>
          <Stack spacing={8} mx={'auto'} maxW={'2xl'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={{base:'3xl', md:'4xl'}}>イサンPAY</Heading>
              <Heading fontSize={{base:'3xl', md:'4xl'}}>{loginType} アカウントの認証</Heading>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}>
                <Text fontSize={'lg'} color={'gray.600'}>
                  本サービスでは、認証時にユーザーに許可された場合のみ、{loginType}アカウントに登録されているメールアドレスを取得します。取得したメールアドレスは以下の目的以外で使用されることはありません。また、法令で定められた場合を除き、第三者への提供はいたしません。
                </Text>
              <Stack spacing={4} p="10" bg="gray.100">
                <ul>
                  <li>ユーザーのユニークIDとして管理に利用</li>
                  <li>本サービスからのお知らせやメールマガジンの配信に利用</li>
                  <li>退会時、問い合わせ時などの連絡のために利用</li>
                </ul>
              </Stack>
              {currentProvider &&
                <Button 
                  w="full" 
                  my="2" 
                  bg={currentProvider.bg}
                  leftIcon={currentProvider.icon}
                  borderColor={currentProvider.color}
                  color={currentProvider.color}
                  onClick={currentProvider.clickHandler}
                  shadow="md"
                  _hover={{
                    boxShadow: 'xl',
                  }}
                  rounded="full"
                >
                  {loginType} で認証
                </Button>
              }
              <Button
                w="full" 
                rounded="full"
                bg={'gray.200'} 
                _hover={{color: 'gray.800'}}
                color={'gray.500'}
                onClick={() => router.back()}
              > Back</Button>
            </Box>
          </Stack>
        </Flex>
    )
}

export default TermOfUse

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  return redirectHome(context)
};