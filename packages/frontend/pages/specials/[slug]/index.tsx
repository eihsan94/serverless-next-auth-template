import React, { FC, useRef, useState } from 'react';
import { BreadCrumbItemProps } from '../../../components/layout';
import MagazineEditPage from '../../../components/layout/magazine-page';
import { Special } from '@libTypes/special';
import { GetServerSideProps } from 'next';
import { getSpecialHandler, updateSpecialHandler } from '../../../queries/specials';
import { 
  useBoolean,
  useToast,
  Box,
  Stack,
  Flex,
  Spinner,
  FormControl,
  FormLabel,
  Switch,
  Input,
  FormErrorMessage,
  Image,
  Textarea
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/dist/client/router';
import { PlaceholderImage } from '../../../components/assets/PlaceholderImage';
import MainButton from '../../../components/Buttons/main-button';
import encodeToBase64 from '../../../utils/encodeToBase64';
import * as Yup from 'yup';

interface Props {
  slug: string,
  special?: Special,
}

const SpecialsDetail: FC<Props> = ({special,slug}) => {
  const title = '特集編集画面'
  const breadCrumbs: BreadCrumbItemProps[] = [
    {href: '/', name: 'ホーム'},
    {href: '/specials', name: '特集'},
    {href: `/specials/${slug}`, name: `${title}`}, 
  ]
  return (
    <MagazineEditPage breadCrumbs={breadCrumbs} title={title} data={special}>
      {special && <SpecialForm data={special}/>}
    </MagazineEditPage>
  )
}


export default SpecialsDetail


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const slug = context.params?.slug as string;
  const special = await getSpecialHandler(slug)
  return { 
      props: {
          special,
          slug
      } 
  }
}

type SpecialForm = Omit<Special, 'updatedAt'>
const SpecialFormSchema: Yup.SchemaOf<SpecialForm> = Yup.object().shape({
  partition_key: Yup.string(),
  heroImage: Yup.string(),
  title: Yup.string()
    .min(2, '3文字以上を入れてください!')
    .required('この項目は必須です。'),
  description: Yup.string()
    .min(2, '3文字以上を入れてください!')
    .required('この項目は必須です。'),
  isPublished: Yup.boolean().required('この項目は必須です。'),
  posts: Yup.array()
});

interface FormProps {
  data: Special
}

const SpecialForm: FC<FormProps> = ({data}) => {
    
  const {title, description, partition_key} = data;
  const [isPublished, setPublished] = useBoolean(data.isPublished)
  const [heroImage, setHeroImage] = useState(data.heroImage ? `${data.heroImage}?${new Date().getTime()}` : '')
  const [uploadLoading, setUploadLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast()
  const router = useRouter()

  const submitHandler = async (value: Special) => {
      value.heroImage = heroImage
      value.isPublished = isPublished
      const res = await updateSpecialHandler(value)
      await router.back()
      if (res.partition_key) {
          toast({
              title: `成功`,
              description: `${res.title}更新しました`,
              status: "success",
              duration: 2000,
              isClosable: true,
          })
      } else {
          toast({
              title: `エラー`,
              description: `エラー内容${JSON.stringify(res)}`,
              status: "error",
              duration: 2000,
              isClosable: true,
          })    
      } 
  }

  interface Event<T = EventTarget> {
      target: T;
  }
  const uploadHandler = async(v: Event<HTMLInputElement>) => {
      const file = (v.target.files as FileList)[0]
      if (file) {
          setUploadLoading(true)
          const base64 = await encodeToBase64(file);
          setHeroImage(base64)
          setUploadLoading(false)
      }
  }
  
    
  return (
      <Box my={5} w="md" mr={{md:"10"}}>
          <Stack spacing={4}>
              <Formik
                  initialValues={{ title, description, isPublished, heroImage, partition_key }}
                  validationSchema={SpecialFormSchema}
                  onSubmit={(value) => submitHandler(value)}
                  >
                  {({errors, touched, isSubmitting}) => (
                      <Form>
                          <Flex w="12rem" h="14rem" justify="center" margin="auto">
                             {!uploadLoading 
                              ? heroImage
                                  ?<Image src={heroImage} alt={heroImage}  objectFit="cover" onClick={() => inputRef?.current?.click()} cursor="pointer"/>
                                  :<PlaceholderImage
                                      w="100%" h="100%"
                                      cursor="pointer"
                                      onClick={() => inputRef?.current?.click()}
                                  />
                              : <Spinner alignSelf="center" />}
                              <input type='file' accept="image/png, image/gif, image/jpeg" ref={inputRef} style={{ display: 'none' }} onChange={uploadHandler}></input>
                          </Flex> 
                          <Field name="isPublished">
                              {() => (
                                  <FormControl display="flex" alignItems="center" my="3">
                                      <FormLabel id="isPublished" htmlFor="isPublished" >公開する</FormLabel>
                                      <Switch name="isPublished" isChecked={isPublished} onChange={setPublished.toggle} />
                                  </FormControl>
                              )}
                          </Field>
                          <Field name="title">
                              {({ field }: {field: {name: string, value: string}}) => (
                                  <FormControl isInvalid={!!(errors.title && touched.title)} mb="3">
                                      <FormLabel id="title" htmlFor="title" >タイトル</FormLabel>
                                      <Input 
                                          {...field}
                                          id="title" 
                                          placeholder="特集タイトルを記入してください" 
                                          bg={'gray.100'}
                                          border={0}
                                          color={'gray.500'}
                                          _placeholder={{
                                              color: 'gray.500',
                                          }}
                                      />
                                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                                  </FormControl>
                              )}
                          </Field>
                          <Field name="description">
                              {({ field }: {field: {name: string, value: string}}) => (
                                  <FormControl isInvalid={!!(errors.description && touched.description)} mb="5">
                                      <FormLabel id="description" htmlFor="description" >説明</FormLabel>
                                      <Textarea
                                          {...field}
                                          id="description" 
                                          placeholder="特集説明文章を記入してください"
                                          rows={5}
                                          bg={'gray.100'}
                                          border={0}
                                          color={'gray.500'}
                                          _placeholder={{
                                              color: 'gray.500',
                                          }}
                                      />
                                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                                  </FormControl>
                              )}
                          </Field>
                          <MainButton
                              width="full"
                              isLoading={isSubmitting}
                              type="submit"
                          >
                              保存
                          </MainButton>
                      </Form>
                  )}
              </Formik>
          </Stack>
      </Box>
  )
}

