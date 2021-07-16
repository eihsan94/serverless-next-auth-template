import { Button } from "@chakra-ui/react"

interface Props {
    clickHandler?: () => void;
    width?: any;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
}

const MainButton: React.FC<Props> = ({clickHandler, width, children, isLoading, type}) => {
    return (
        <Button
            type={type}
            w={width}
            isLoading={isLoading}
            rounded={'full'}
            px={6}
            colorScheme={'orange'}
            bg={'orange.400'}
            onClick={clickHandler}
            _hover={{ bg: 'orange.500' }}>
            {children}
          </Button>
    )
}

export default MainButton
