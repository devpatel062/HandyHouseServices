import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Toast
} from '@chakra-ui/react'
import axios from "axios";
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export const SimpleCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://handy-house-services-backend.vercel.app/api/signin", formData,  { withCredentials: true });
            // alert(response.data.message);
            Toast({
                title: response.data.message,
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            navigate('/homePage')
        } catch (error) {
            if (error.response) {
                // If the server responded with an error status
                alert(error.response.data.message);
              } else {
                // Handle network or other errors
                alert('An error occurred. Please try again.');
              }
            
            navigate('/signup')
        }
    };
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/signup')
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <br />
                    <br />
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <InputGroup>
                                <Input type="email" name="email" onChange={handleChange} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Text color={'blue.400'}>Forgot password?</Text>
                            </Stack>
                            <Button
                                onClick={handleSubmit}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign in
                            </Button>
                            <Button
                            onClick={handleNavigate}
                                bg={'gray.600'}
                                color={'white'}
                                _hover={{
                                    bg: 'gray.700',
                                }}>
                                Sign up
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
