import React, { FC, useState } from 'react'
import { Formik, Form, Field,  } from 'formik';
import * as Yup from 'yup';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Stack, InputGroup, InputLeftElement, Input, Button, useToast, FormControl, FormErrorMessage, FormLabel, Text, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import { FcGoogle } from 'react-icons/fc';


interface Props {
    email: string;
    password: string;
    passwordConfirmation?: string;
}

const AuthFormSchema: Yup.SchemaOf<Props> = Yup.object().shape({
    email: Yup.string()
        .email('メールアドレスが間違っています')
        .required('この項目は必須です。'),
    password: Yup.string()
        .min(6, '6文字以上を入れてください!')
        .required('この項目は必須です。'),
    passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'パスワードが同じではない')
});
type InputField = {name: string, placeholder: string, type: string, icon: JSX.Element, isInvalid: (errors: any, touched: any) => boolean, errors: (errors: any) => any}
const AuthForm: FC = () => {
    const toast = useToast()
    const router = useRouter()
    const [isSignup, setIsSignup] = useState<boolean>(false)
    const auth0: {name: 'LINE' | 'GOOGLE' | '', bg?: string, bgGradient?: string, color: string, icon?: JSX.Element}[] = [
        {name: 'LINE', bg: '#05B803', color: 'white'},
        {name: 'GOOGLE', bg:'white', color: 'black', icon: <FcGoogle />},
    ]
    const loginInputs: InputField[] = [
        {name: 'email', placeholder: 'メールアドレス',  type: 'email',  icon: <EmailIcon color="gray.300" fontSize="1.2em" ml="8px" mt="25px"/>, isInvalid: (errors, touched) => !!(errors.email && touched.email), errors: (errors: any) => errors.email},
        {name: 'password', placeholder: 'パスワード',  type: 'password',  icon: <LockIcon color="gray.300" fontSize="1.2em" ml="10px" mt="20px"/>, isInvalid: (errors, touched) => !!(errors.password && touched.password), errors: (errors: any) => errors.password},
    ] 
    const [inputFields, setInputFields] = useState<InputField[]>(loginInputs)
    const authToggle = () => {
        const newIsSignupState = !isSignup
        setIsSignup(newIsSignupState)
        const updatedInputFields: InputField[] = 
            newIsSignupState
                ? [
                    {name: 'email', placeholder: 'メールアドレス', type: 'email',  icon: <EmailIcon color="gray.300" fontSize="1.2em" ml="8px" mt="25px"/>, isInvalid: (errors, touched) => !!(errors.email && touched.email), errors: (errors: any) => errors.email},
                    {name: 'password', placeholder: 'パスワード', type: 'password',  icon: <LockIcon color="gray.300" fontSize="1.2em" ml="10px" mt="20px"/>, isInvalid: (errors, touched) => !!(errors.password && touched.password), errors: (errors: any) => errors.password},
                    {name: 'passwordConfirmation', placeholder: 'パスワード確認',　type: 'password',  icon: <LockIcon color="gray.300" fontSize="1.2em" ml="10px" mt="8px"/>, isInvalid: (errors, touched) => !!(errors.passwordConfirmation && touched.passwordConfirmation), errors: (errors: any) => errors.passwordConfirmation},
                ]
                : loginInputs
            setInputFields(updatedInputFields)
    }
    const submitHandler = async (value: Props) => {
        console.log(value);    
    //   const res = await updateSpecialHandler(value)
    //   await router.push('/')
    //   if (res.pk) {
    //       toast({
    //           title: `成功`,
    //           description: `${res.title}更新しました`,
    //           status: "success",
    //           duration: 2000,
    //           isClosable: true,
    //       })
    //   } else {
    //       toast({
    //           title: `エラー`,
    //           description: `エラー内容${JSON.stringify(res)}`,
    //           status: "error",
    //           duration: 2000,
    //           isClosable: true,
    //       })
    //   } 
  }
    return (
        <Box mt={5}>
            {auth0.map((a, i) => 
                <Button
                  key={i}
                  onClick={() => router.push(`/auth/termOfUse?${a.name}=true`)}
                  rounded="full" 
                  size="lg"
                  fontFamily={'heading'}
                  w={'full'}
                  bg={a.bg}
                  bgGradient={a.bgGradient}
                  mb={3}
                  leftIcon={a.icon}
                  color={a.color}
                  shadow="md"
                  _hover={{
                    boxShadow: 'xl',
                  }}>
                  {a.name}で{isSignup ? 'アカウント作成する' : 'ログインする'}
                </Button>
              )}
            <Flex w="full" justify="center" pb={5}>
                <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.500'}>
                    もしくは
                </Text>
            </Flex>
            <Stack spacing={4}>
                <Formik
                    initialValues={{email: '', password: '', passwordConfirmation: '' }}
                    validationSchema={AuthFormSchema}
                    onSubmit={(value) => submitHandler(value)}
                >
                  {({errors, touched, isSubmitting}) => (
                      <Form>
                        {inputFields.map((input: InputField, i) =>
                            <Field name={input.name} key={i}>
                                {({ field }: {field: {name: string, value: string}}) => (
                                    <FormControl isInvalid={input.isInvalid(errors, touched)} mb="5">
                                            <InputGroup>
                                                <InputLeftElement
                                                    pointerEvents="none"
                                                    >
                                                    {input.icon}
                                                </InputLeftElement>
                                                <Input 
                                                    {...field}
                                                    id={input.name}
                                                    rounded="full" 
                                                    size="lg" 
                                                    h={16}
                                                    type={input.type} 
                                                    placeholder={input.placeholder}
                                                    color={'gray.500'}
                                                    _placeholder={{
                                                        color: 'gray.300',
                                                    }}
                                                />
                                            </InputGroup>
                                        <FormErrorMessage>{input.errors(errors)}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                        )} 
                        <Button
                            isLoading={isSubmitting}
                            type="submit"
                            rounded="full" 
                            size="lg"
                            mb={5}
                            fontFamily={'heading'}
                            w={'full'}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            color={'white'}
                            _hover={{
                            bgGradient: 'linear(to-r, red.400,pink.400)',
                            boxShadow: 'xl',
                            }}>
                            {isSignup ? 'アカウント作成する' : 'ログインする'}
                        </Button>
                        <Button 
                            w={'full'}
                            rounded="full" 
                            size="lg" 
                            onClick={authToggle}
                            fontFamily={'heading'} 
                            bg={'gray.200'} 
                            _hover={{color: 'gray.800'}}
                            color={'gray.500'}>
                            {isSignup ? 'ログインする' : 'アカウント作成する'}
                        </Button>
                    </Form>
                  )}
              </Formik>
            </Stack>
        </Box>   
    )
}

export default AuthForm
