import Layout from "../components/layout";
import {
  Flex,
  Heading,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react';
import { Illustration } from "../components/assets/illustrations";
import { useRouter } from "next/dist/client/router";
import TitleLogo from "../components/icons/TitleLogo";


export default function Home() {
  const router = useRouter()
  return (
    <Layout>
      <Stack 
          textAlign={'center'}
          align={'center'}    
          py={{ base: 5, md: 7 }}
          spacing={{ base: 8, md: 10 }}
      >  
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
            <Flex align="center">
              <TitleLogo width="300px" height="100px" />管理{' '}
              <Text as={'span'} color={'orange.400'}>
                サイト
              </Text>
            </Flex>
        </Heading>
        <Text color={'gray.500'} maxW={'3xl'}>
          特集記事、連載記事、読者管などなどを簡単に管理できます
        </Text>
        <Stack spacing={6} direction={'row'}>
          <Button
            rounded={'full'}
            px={6}
            colorScheme={'orange'}
            bg={'orange.400'}
            onClick={() => router.push('specials')}
            _hover={{ bg: 'orange.500' }}>
              特集記事管理画面に移動
          </Button>
        </Stack>
      </Stack>
      <Flex w={'full'}>
        <Illustration
          height={{ sm: '20rem', lg: '24rem', }}
          mt={{ base: 5, sm: 7 }}
        />
      </Flex>
    </Layout>
  )
}

