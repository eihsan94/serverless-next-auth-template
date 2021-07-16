import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { BreadCrumbItemProps } from '../../../components/layout';
import MagazineEditPage from '../../../components/layout/magazine-page';
import { Regular } from '../../../@types/regular';
import { GetServerSideProps } from 'next';
import { getRegularHandler, updateRegularHandler } from '../../../queries/regulars';
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
  regular?: Regular,
}

const RegularsDetail: FC<Props> = ({regular,slug}) => {
  const title = '連載編集画面'
  const breadCrumbs: BreadCrumbItemProps[] = [
    {href: '/', name: 'ホーム'},
    {href: '/regulars', name: '連載'},
    {href: `/regulars/${slug}`, name: `${title}`}, 
  ]
  return (
    <MagazineEditPage breadCrumbs={breadCrumbs} title={title} data={regular}>
      {regular && <RegularForm data={regular}/>}
    </MagazineEditPage>
  )
}


export default RegularsDetail


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

  const { data } = await context.query
  const slug = context.params?.slug as string;
  const regular = await getRegularHandler(slug)

  return { 
      props: {
          regular,
          slug
      } 
  }
}

type RegularForm = Omit<Regular, 'updatedAt'>
const RegularFormSchema: Yup.SchemaOf<RegularForm> = Yup.object().shape({
  partition_key: Yup.string(),
  heroImage: Yup.string(),
  topImage: Yup.string(),
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
  data: Regular
}

const RegularForm: FC<FormProps> = ({data}) => {
  const {title, description, partition_key} = data;
  const [isPublished, setPublished] = useBoolean(data.isPublished)
  const [heroImage, setHeroImage] = useState(data.heroImage)
  const [uploadHeroImgLoading, setUploadHeroImgLoading] = useState(false)
  const [topImage, setTopImage] = useState(data.topImage)
  const [uploadTopImgLoading, setUploadTopImgLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const inputTopRef = useRef<HTMLInputElement>(null);
  const toast = useToast()
  const router = useRouter()

  const submitHandler = async (value: Regular) => {
      value.heroImage = heroImage
      value.topImage = topImage
      value.isPublished = isPublished
      const res = await updateRegularHandler(value)
      if (res.partition_key) {
          toast({
              title: `成功`,
              description: `${res.title}更新しました`,
              status: "success",
              duration: 2000,
              isClosable: true,
          })
          router.back()
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

  const uploadHandler = async(file: File, setImgFn: Dispatch<SetStateAction<string | undefined>>, setLoadingFn: Dispatch<SetStateAction<boolean>>) => {
      if (file) {
          setLoadingFn(true)
          const img = URL.createObjectURL(file);
          const base64 = await encodeToBase64(file);
          setImgFn(img)
          setLoadingFn(false)
      }
  }
  
    
  return (
      <Box my={5} w="md" mr={{md:"10"}}>
          <Stack spacing={4}>
              <Formik
                  initialValues={{ title, description, isPublished, heroImage, partition_key }}
                  validationSchema={RegularFormSchema}
                  onSubmit={(value) => submitHandler(value)}
                  >
                  {({errors, touched, isSubmitting}) => (
                      <Form>
                          <Flex w="12rem" h="14rem" justify="center" margin="auto">
                             {!uploadHeroImgLoading 
                              ? heroImage
                                  ?<Image src={heroImage} alt={heroImage}  objectFit="cover" onClick={() => inputRef?.current?.click()} cursor="pointer"/>
                                  :<PlaceholderImage
                                      w="100%" h="100%"
                                      cursor="pointer"
                                      onClick={() => inputRef?.current?.click()}
                                  />
                              : <Spinner alignSelf="center" />}
                              <input 
                                type='file'
                                accept="image/png, image/gif, image/jpeg"
                                ref={inputRef}
                                style={{ display: 'none' }} 
                                onChange={(v) => v.target.files && uploadHandler(v.target.files[0], setHeroImage, setUploadHeroImgLoading)} />

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
                                          placeholder="連載タイトルを記入してください" 
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
                                          placeholder="連載説明文章を記入してください"
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
                          <Box w="full" mb="5">
                            <FormLabel id="description" htmlFor="description" >トップページ用の画像</FormLabel>
                            <Box w="full" bg={'gray.100'} borderRadius="md">
                              {!uploadTopImgLoading 
                                ? topImage
                                    ?<Image w="6rem" height="7rem" margin="auto" src={topImage} alt={topImage}  objectFit="cover" onClick={() => inputTopRef?.current?.click()} cursor="pointer"/>
                                    :<PlaceholderImage
                                        w="6rem" height="7rem" margin="auto"
                                        cursor="pointer"
                                        onClick={() => inputTopRef?.current?.click()}
                                    />
                                : <Flex w="6rem" height="7rem" margin="auto" justify="center"><Spinner alignSelf="center" /></Flex>}
                                <input 
                                  type='file'
                                  accept="image/png, image/gif, image/jpeg"
                                  ref={inputTopRef}
                                  style={{ display: 'none' }} 
                                  onChange={(v) => v.target.files && uploadHandler(v.target.files[0], setTopImage, setUploadTopImgLoading)} />
                            </Box>
                          </Box> 
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

