import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    IconProps,
    Icon,
    InputGroup,
    InputLeftElement,
    Image,
    useColorModeValue,
  } from '@chakra-ui/react';
import Logo from '@components/icons/logo';
import AuthForm from './AuthForm'
  const avatars = [
    {
      name: 'ななみ',
      url: 'https://i.ibb.co/dJ2hxXj/Screen-Shot-2021-08-03-at-21-30-23.png',
    },
    {
      name: 'イサン',
      url: 'https://i.ibb.co/1J5nnR4/ihsan.webp',
    },
  ];
  export default function Index() {
    const bpVal =  useBreakpointValue({ base: 'md', md: 'lg' })
    const colorMode =  useColorModeValue('red.50', 'red.400')
    const LoginImage = "images/loginImage.jpeg";

    return (
      <Box position={'relative'}>
        <Container
          as={SimpleGrid}
          maxW={'7xl'}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 30 }}
          py={{ base: 10, sm: 20, lg: 32 }}>
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading>
                <Flex alignItems="flex-end">
                    <Text fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}>
                        イサンぺイ
                    </Text>
                    <Logo width="100px" height="100px" />
                </Flex>
                <Text color={'gray.500'}　fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '4xl' }}>
                    オンライン決済を簡単にする
                </Text>
            </Heading>
            <Stack direction={'row'} spacing={4} align={'center'} flexWrap="wrap">
            　　<Text fontSize={{ base: 'sm', sm: 'md' }}　w="full" mb="4" color={'gray.500'}>
            　　    今、イサンぺイを使っているクライアント達
            　　</Text>
              <AvatarGroup>
                {avatars.map((avatar) => (
                  <Avatar
                    key={avatar.name}
                    name={avatar.name}
                    src={avatar.url}
                    size={bpVal}
                    position={'relative'}
                    zIndex={2}
                    _before={{
                      content: '""',
                      width: 'full',
                      height: 'full',
                      rounded: 'full',
                      transform: 'scale(1.125)',
                      bgGradient: 'linear(to-bl, red.400,pink.400)',
                      position: 'absolute',
                      zIndex: -1,
                      top: 0,
                      left: 0,
                    }}
                  />
                ))}
              </AvatarGroup>
            </Stack>
          </Stack>
          <Stack
            bg={'gray.50'}
            rounded='3xl'
            px={10}
            py={10}
            spacing={{ base: 8 }}
            maxW={{ lg: '425px' }}>
            <Stack spacing={4}>
              <Heading
                color={'gray.800'}
                lineHeight={1.1}
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                
                <Text
                  as={'span'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text">
                  簡単な決済、ここから!
                </Text>
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                あなたのビジネス決済を簡単にしましょう！
              </Text>
            </Stack>
            <AuthForm />
          </Stack>
          <Blob
            w={'150%'}
            h={'150%'}
            position={'absolute'}
            top={'-20%'}
            left={0}
            zIndex={-1}
            color={colorMode}
          />
          <Box
            position={'relative'}
            height={'300px'}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}>
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={'100%'}
              src={LoginImage}
            />
          </Box>
        </Container>
        <Blur
          position={'absolute'}
          top={-10}
          left={-10}
          style={{ filter: 'blur(70px)' }}
        />
      </Box>
    );
  }
  
  export const Blur = (props: IconProps) => {
    return (
      <Icon
        width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
        zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
        height="560px"
        viewBox="0 0 528 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <circle cx="71" cy="61" r="111" fill="#F56565" />
        <circle cx="244" cy="106" r="139" fill="#ED64A6" />
        <circle cy="291" r="139" fill="#ED64A6" />
        <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
        <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
        <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
        <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
      </Icon>
    );
  };

  export const Blob = (props: IconProps) => {
    return (
      <Icon
        width={'100%'}
        viewBox="0 0 578 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
          fill="currentColor"
        />
      </Icon>
    );
  };
  