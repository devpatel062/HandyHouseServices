// import {
//   Box,
//   Flex,
//   Text,
//   IconButton,
//   Button,
//   Stack,
//   Collapse,
//   Icon,
//   Link,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   useColorModeValue,
//   useBreakpointValue,
//   useDisclosure,
// } from '@chakra-ui/react'
// import {
//   HamburgerIcon,
//   CloseIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
// } from '@chakra-ui/icons'
// import { useEffect, useState } from "react";
// import axios from "axios";

// export const Navbar = () => {
//   const { isOpen, onToggle } = useDisclosure();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     console.log("hello")
//     axios
//       .get("https://handy-house-services-backend.vercel.app/api/user", { withCredentials: true }) // Ensure credentials (cookies) are sent
//       .then((response) => {
//         console.log("response.data")
//         setUser(response.data); // Store user data
//       })
//       .catch(() => {
//         setUser(null); // If error, set user as null
//       });
//   },[]);  

//   return (
//     <Box>
//       <Flex
//         bg={useColorModeValue('white', 'gray.800')}
//         color={useColorModeValue('gray.600', 'white')}
//         minH={'60px'}
//         py={{ base: 2 }}
//         px={{ base: 4 }}
//         borderBottom={1}
//         borderStyle={'solid'}
//         borderColor={useColorModeValue('gray.200', 'gray.900')}
//         align={'center'}>
//         <Flex
//           flex={{ base: 1, md: 'auto' }}
//           ml={{ base: -2 }}
//           display={{ base: 'flex', md: 'none' }}>
//           <IconButton
//             onClick={onToggle}
//             icon={
//               isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
//             }
//             variant={'ghost'}
//             aria-label={'Toggle Navigation'}
//           />
//         </Flex>
//         <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
//           <Text
//             textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
//             fontFamily={'heading'}
//             color={useColorModeValue('gray.800', 'white')}>
//             Logo
//           </Text>

//           <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
//             <DesktopNav />
//           </Flex>
//         </Flex>

//         <Stack flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} spacing={6}>
//           {user ? (
//             <>
//               <Text fontSize={"md"} fontWeight={600} color={"gray.700"}>
//                 {user.fullname} 
//                 {/* ({user.email}) */}
//               </Text>
//               <Button
//                 onClick={() => {
//                   axios.post("https://handy-house-services-backend.vercel.app/api/logout", {}, { withCredentials: true }).then(() => {
//                     setUser(null); // Clear user on logout
//                   });
//                 }}
//                 fontSize={"sm"}
//                 fontWeight={600}
//                 color={"white"}
//                 bg={"red.400"}
//                 _hover={{ bg: "red.300" }}
//               >
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button as={"a"} fontSize={"sm"} fontWeight={400} variant={"link"} href="/signin">
//                 Sign In
//               </Button>
//               <Button
//                 as={"a"}
//                 fontSize={"sm"}
//                 fontWeight={600}
//                 color={"white"}
//                 bg={"blue.400"}
//                 href="/signup"
//                 _hover={{ bg: "blue.300" }}
//               >
//                 Sign Up
//               </Button>
//             </>
//           )}
//         </Stack>
//       </Flex>

//       <Collapse in={isOpen} animateOpacity>
//         <MobileNav />
//       </Collapse>
//     </Box>
//   );
// }

// const DesktopNav = () => {
//   const linkColor = useColorModeValue('gray.600', 'gray.200');
//   const linkHoverColor = useColorModeValue('gray.800', 'white');
//   const popoverContentBgColor = useColorModeValue('white', 'gray.800');

//   return (
//     <Stack direction={'row'} spacing={4}>
//       {NAV_ITEMS.map((navItem) => (
//         <Box key={navItem.label}>
//           <Popover trigger={'hover'} placement={'bottom-start'}>
//             <PopoverTrigger>
//               <Link
//                 p={2}
//                 to={navItem.href ?? '#'}
//                 fontSize={'sm'}
//                 fontWeight={500}
//                 color={linkColor}
//                 _hover={{
//                   textDecoration: 'none',
//                   color: linkHoverColor,
//                 }}>
//                 {navItem.label}
//               </Link>
//             </PopoverTrigger>

//             {navItem.children && (
//               <PopoverContent
//                 border={0}
//                 boxShadow={'xl'}
//                 bg={popoverContentBgColor}
//                 p={4}
//                 rounded={'xl'}
//                 minW={'sm'}>
//                 <Stack>
//                   {navItem.children.map((child) => (
//                     <DesktopSubNav key={child.label} {...child} />
//                   ))}
//                 </Stack>
//               </PopoverContent>
//             )}
//           </Popover>
//         </Box>
//       ))}
//     </Stack>
//   );
// };

// import PropTypes from 'prop-types';

// const DesktopSubNav = ({ label, href, subLabel }) => {

//   return (
//     <Link
//       href={href}
//       role={'group'}
//       display={'block'}
//       p={2}
//       rounded={'md'}
//       _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}>
//       <Stack direction={'row'} align={'center'}>
//         <Box>
//           <Text
//             transition={'all .3s ease'}
//             _groupHover={{ color: 'blue.400' }}
//             fontWeight={500}>
//             {label}
//           </Text>
//           <Text fontSize={'sm'}>{subLabel}</Text>
//         </Box>
//         <Flex
//           transition={'all .3s ease'}
//           transform={'translateX(-10px)'}
//           opacity={0}
//           _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
//           justify={'flex-end'}
//           align={'center'}
//           flex={1}>
//           <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
//         </Flex>
//       </Stack>
//     </Link>
//   );
// };

// DesktopSubNav.propTypes = {
//   label: PropTypes.string.isRequired,
//   href: PropTypes.string,
//   subLabel: PropTypes.string,
// };

// const MobileNav = () => {
//   return (
//     <Stack
//       bg={useColorModeValue('white', 'gray.800')}
//       p={4}
//       display={{ md: 'none' }}>
//       {NAV_ITEMS.map((navItem) => (
//         <MobileNavItem key={navItem.label} {...navItem} />
//       ))}
//     </Stack>
//   );
// };


// const MobileNavItem = ({ label, children, href }) => {
//   const { isOpen, onToggle } = useDisclosure();

//   return (
//     <Stack spacing={4} onClick={children && onToggle}>
//       <Flex
//         py={2}
//         as={Link}
//         href={href ?? '#'}
//         justify={'space-between'}
//         align={'center'}
//         _hover={{
//           textDecoration: 'none',
//         }}>
//         <Text
//           fontWeight={600}
//           color={useColorModeValue('gray.600', 'gray.200')}>
//           {label}
//         </Text>
//         {children && (
//           <Icon
//             as={ChevronDownIcon}
//             transition={'all .25s ease-in-out'}
//             transform={isOpen ? 'rotate(180deg)' : ''}
//             w={6}
//             h={6}
//           />
//         )}
//       </Flex>

//       <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
//         <Stack
//           mt={2}
//           pl={4}
//           borderLeft={1}
//           borderStyle={'solid'}
//           borderColor={useColorModeValue('gray.200', 'gray.700')}
//           align={'start'}>
//           {children &&
//             children.map((child) => (
//               <Link key={child.label} py={2} href={child.href}>
//                 {child.label}
//               </Link>
//             ))}
//         </Stack>
//       </Collapse>
//     </Stack>
//   );
// };

// MobileNavItem.propTypes = {
//   label: PropTypes.string.isRequired,
//   children: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string.isRequired,
//       href: PropTypes.string,
//     })
//   ),
//   href: PropTypes.string,
// };


// const NAV_ITEMS = [
//   {
//     label: 'HOME',
//     href: '/',
//   },
//   {
//     label: 'SERVICES',
//     href: '/RepairServices',
//   },
//   {
//     label: 'ABOUT US',
//     href: '/aboutUs',
//   },
// ];


import { useEffect, useState, useContext } from 'react'
import {
  useColorMode,
  Switch,
  Flex,
  Button,
  IconButton
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../App'

const { state, dispatch } = useContext(UserContext);

export const Navbar = ({ user }) => {

  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [display, changeDisplay] = useState('none')

  const handleLogout = async () => {
    try {
      await axios.post("https://handy-house-services-backend.vercel.app/api/logout", {}, { withCredentials: true });
      setUser(null);
      dispatch({ type: UserContext, payload: false })
      navigate('/signin');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const decision = () => {
    if (state) {
      <Button
        onClick={handleLogout}
        variant="solid"
        colorScheme="red"
        my={5}
        w="100%"
      >
        Logout
      </Button>
    }
  }


  return (

    <Flex>
      <Flex position="absolute" top="1rem" right="1rem" align="center">
        <Flex display={['none', 'none', 'flex', 'flex']}>
          <Link to="/" aria-label="Home">
            <Button as="a" variant="ghost" my={5} w="100%">
              Home
            </Button>
          </Link>

          <Link to="/RepairServices" aria-label="Repair Services">
            <Button
              as="a"
              variant="ghost"
              my={5}
              w="100%"
              isDisabled={!user}
            >
              Repair Services
            </Button>
          </Link>

          <Link to="/aboutUs" aria-label="About Us">
            <Button
              as="a"
              variant="ghost"
              my={5}
              w="100%"
              isDisabled={!user}
            >
              About Us
            </Button>
          </Link>
          {decision()}
        </Flex>

        <IconButton
          aria-label="Open Menu"
          size="lg"
          mr={2}
          icon={<HamburgerIcon />}
          onClick={() => changeDisplay('flex')}
          display={['flex', 'flex', 'none', 'none']}
        />
        <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />
      </Flex>

      <Flex
        w="100vw"
        display={display}
        bgColor="gray.50"
        h="100vh"
        pos="fixed"
        top="0"
        left="0"
        zIndex={20}
        overflowY="auto"
        flexDir="column"
      >
        <Flex justify="flex-end">
          <IconButton
            mt={2}
            mr={2}
            aria-label="Close Menu"
            size="lg"
            icon={<CloseIcon />}
            onClick={() => changeDisplay('none')}
          />
        </Flex>

        <Flex flexDir="column" align="center">
          <Link to="/" aria-label="Home">
            <Button as="a" variant="ghost" my={5} w="100%">
              Home
            </Button>
          </Link>

          <Link to={user ? "/RepairServices" : "#"} aria-label="Repair Services">
            <Button
              as="a"
              variant="ghost"
              my={5}
              w="100%"
              isDisabled={!user}
            >
              Repair Services
            </Button>
          </Link>

          <Link to={user ? "/aboutUs" : "#"} aria-label="About Us">
            <Button
              as="a"
              variant="ghost"
              my={5}
              w="100%"
              isDisabled={!user}
            >
              About Us
            </Button>
          </Link>
          {decision()}
        </Flex>
      </Flex>
    </Flex>
  )
}
