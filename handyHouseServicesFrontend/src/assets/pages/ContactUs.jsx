import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Stack,
    Textarea,
    Tooltip,
    useClipboard,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { BsGithub, BsLinkedin, BsPerson, BsTwitter } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

const accentGradient = 'linear(to-r, blue.600, blue.400)';


export default function ContactUs () {
    const { hasCopied, onCopy } = useClipboard('example@example.com');
    return (
        <Flex
            align="center"
            justify="center"
            bgGradient="linear(to-br, blue.50, white)"
            // css={{
            //     backgroundImage: useColorModeValue(CONFETTI_LIGHT, CONFETTI_DARK),
            //     backgroundAttachment: 'fixed',
            // }}
            id="contact">
            <Box
                borderRadius="lg"
                m={{ base: 5, md: 16, lg: 10 }}
                p={{ base: 5, lg: 16 }}>
                <Box>
                    <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
                        <Heading
                            fontSize={{ base: '5xl', md: '5xl' }}
                            bgClip="text"
                            bgGradient={accentGradient}
                        >
                            Get in Touch
                        </Heading>

                        <Stack
                            spacing={{ base: 4, md: 8, lg: 20 }}
                            direction={{ base: 'column', md: 'row' }}>
                            <Stack
                                align="center"
                                justify="space-around"
                                direction={{ base: 'row', md: 'column' }}>
                                <Tooltip label={hasCopied ? 'Email Copied!' : 'Copy Email'} closeOnClick={false} hasArrow>
                                    <IconButton
                                        aria-label="email"
                                        color="blue.600"
                                        variant="ghost"
                                        size="lg"
                                        fontSize="3xl"
                                        icon={<MdEmail />}
                                        _hover={{ bg: 'blue.50', color: 'blue.700' }}
                                        onClick={onCopy}
                                        isRound
                                    />
                                </Tooltip>

                                <Link href="#">
                                    <IconButton
                                        aria-label="github"
                                        variant="ghost"
                                        size="lg"
                                        color="blue.600"
                                        fontSize="3xl"
                                        icon={<BsGithub />}
                                        _hover={{ bg: 'blue.50', color: 'blue.700' }}
                                        isRound
                                    />
                                </Link>

                                <Link href="#">
                                    <IconButton
                                        aria-label="twitter"
                                        variant="ghost"
                                        color="blue.600"
                                        size="lg"
                                        icon={<BsTwitter size="28px" />}
                                        _hover={{ bg: 'blue.50', color: 'blue.700' }}
                                        isRound
                                    />
                                </Link>

                                <Link href="#">
                                    <IconButton
                                        aria-label="linkedin"
                                        variant="ghost"
                                        color="blue.600"
                                        size="lg"
                                        icon={<BsLinkedin size="28px" />}
                                        _hover={{ bg: 'blue.50', color: 'blue.700' }}
                                        isRound
                                    />
                                </Link>
                            </Stack>

                            <Box
                                bg={'white'}
                                borderRadius="lg"
                                p={8}
                                color={'gray.700'}
                                shadow="base"
                                borderWidth="1px"
                                borderColor="blue.50"
                            >
                                <VStack spacing={5}>
                                    <FormControl isRequired>
                                        <FormLabel>Name</FormLabel>

                                        <InputGroup>
                                            <InputLeftElement>
                                                <BsPerson />
                                            </InputLeftElement>
                                            <Input type="text" name="name" placeholder="Your Name" focusBorderColor="blue.400" />
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>

                                        <InputGroup>
                                            <InputLeftElement>
                                                <BsPerson />
                                            </InputLeftElement>
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="Your Email"
                                                focusBorderColor="blue.400"
                                            />
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Message</FormLabel>

                                        <Textarea
                                            name="message"
                                            placeholder="Your Message"
                                            rows={6}
                                            resize="none"
                                            focusBorderColor="blue.400"
                                        />
                                    </FormControl>

                                    <Button
                                        colorScheme="blue"
                                        bg="blue.400"
                                        color="white"
                                        _hover={{
                                            bg: 'blue.500',
                                        }}
                                        isFullWidth>
                                        Send Message
                                    </Button>
                                </VStack>
                            </Box>
                        </Stack>
                    </VStack>
                </Box>
            </Box>
        </Flex>
    )
}
