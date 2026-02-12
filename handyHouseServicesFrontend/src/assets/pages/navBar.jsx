import { useEffect, useState, useContext } from "react";
import {
  Flex,
  Button,
  IconButton,
  Box,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import { Icon } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";

const accentGradient = "linear(to-r, blue.600, blue.400)";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [display, changeDisplay] = useState("none");
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box w="100%" px={0} py={0} position="relative" zIndex={100}>
      <Flex
        w="100%"
        px={{ base: 2, md: 8 }}
        py={{ base: 2, md: 3 }}
        align="center"
        justify="space-between"
        borderRadius="2xl"
        boxShadow="lg"
        bg="whiteAlpha.70"
        backdropFilter="blur(12px)"
        borderWidth="2px"
        borderStyle="solid"
        borderImage={accentGradient + " 1"}
        position="relative"
      >
        {/* Logo/Title */}
        <Link to={user ? "/" : "#"} aria-label="Home">
          <Text
            fontWeight="bold"
            fontSize={{ base: "lg", md: "2xl" }}
            bgClip="text"
            bgGradient={accentGradient}
            letterSpacing="tight"
          >
            HandyHouse
          </Text>
        </Link>
        {/* Desktop Nav */}
        <Flex
          display={["none", "none", "flex", "flex"]}
          align="center"
          gap={6}
          ml={4}
        >
          <Link to={user ? "/" : "#"} aria-label="Home">
            <Button
              variant="ghost"
              fontWeight="semibold"
              fontSize="md"
              px={4}
              _hover={{ bg: "blue.50" }}
            >
              Home
            </Button>
          </Link>
          <Link
            to={user ? "/RepairServices" : "#"}
            aria-label="Repair Services"
          >
            <Button
              variant="ghost"
              fontWeight="semibold"
              fontSize="md"
              px={4}
              isDisabled={!user}
              _hover={{ bg: "blue.50" }}
            >
              Repair Services
            </Button>
          </Link>
          <Link to={user ? "/aboutUs" : "#"} aria-label="About Us">
            <Button
              variant="ghost"
              fontWeight="semibold"
              fontSize="md"
              px={4}
              isDisabled={!user}
              _hover={{ bg: "blue.50" }}
            >
              About Us
            </Button>
          </Link>
          {user && (
            <Flex gap={2} ml={4}>
              <Link to="/UserProfile" aria-label="User Profile">
                <IconButton
                  icon={<FaUser />}
                  aria-label="Profile"
                  colorScheme="blue"
                  variant="solid"
                  borderRadius="full"
                  size="md"
                />
              </Link>
              <Link to="/myBookings" aria-label="My Bookings">
                <IconButton
                  icon={<MdEventNote />}
                  aria-label="Bookings"
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="full"
                  size="md"
                />
              </Link>
              <Button
                onClick={handleLogout}
                colorScheme="blue"
                variant="ghost"
                size="md"
                ml={2}
              >
                Logout
              </Button>
            </Flex>
          )}
        </Flex>
        {/* Mobile Hamburger */}
        <IconButton
          aria-label="Open Menu"
          size="lg"
          icon={<HamburgerIcon />}
          onClick={() => changeDisplay("flex")}
          display={["flex", "flex", "none", "none"]}
          bgGradient={accentGradient}
          color="white"
          borderRadius="full"
          boxShadow="md"
        />
      </Flex>
      {/* Mobile Menu Slide-in */}
      <Flex
        w="100vw"
        display={display}
        bg="whiteAlpha.90"
        h="100vh"
        pos="fixed"
        top="0"
        right={display === "flex" ? "0" : "-100vw"}
        zIndex={200}
        overflowY="auto"
        flexDir="column"
        transition="right 0.3s cubic-bezier(.4,0,.2,1)"
        boxShadow="2xl"
        borderLeftWidth="6px"
        borderLeftStyle="solid"
        borderImage={accentGradient + " 1"}
      >
        <Flex justify="flex-end">
          <IconButton
            mt={2}
            mr={2}
            aria-label="Close Menu"
            size="lg"
            icon={<CloseIcon />}
            onClick={() => changeDisplay("none")}
            bgGradient={accentGradient}
            color="white"
            borderRadius="full"
            boxShadow="md"
          />
        </Flex>
        <Flex flexDir="column" align="center" mt={8} gap={2}>
          <Link to={user ? "/" : "#"} aria-label="Home">
            <Button
                variant="ghost"
                fontWeight="semibold"
                fontSize="lg"
                w="100%"
                _hover={{ bg: "blue.50" }}
              >
              Home
            </Button>
          </Link>
          <Link
            to={user ? "/RepairServices" : "#"}
            aria-label="Repair Services"
          >
            <Button
              variant="ghost"
              fontWeight="semibold"
              fontSize="lg"
              w="100%"
              isDisabled={!user}
              _hover={{ bg: "blue.50" }}
            >
              Repair Services
            </Button>
          </Link>
          <Link to={user ? "/aboutUs" : "#"} aria-label="About Us">
            <Button
              variant="ghost"
              fontWeight="semibold"
              fontSize="lg"
              w="100%"
              isDisabled={!user}
              _hover={{ bg: "blue.50" }}
            >
              About Us
            </Button>
          </Link>
          {user && (
            <Flex flexDir="row" gap={2} mt={4}>
              <Link to="/UserProfile" aria-label="User Profile">
                <IconButton
                  icon={<FaUser />}
                  aria-label="Profile"
                  colorScheme="blue"
                  variant="solid"
                  borderRadius="full"
                  size="lg"
                />
              </Link>
              <Link to="/myBookings" aria-label="My Bookings">
                <IconButton
                  icon={<MdEventNote />}
                  aria-label="Bookings"
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="full"
                  size="lg"
                />
              </Link>
              <Button
                onClick={handleLogout}
                colorScheme="blue"
                variant="ghost"
                size="lg"
                ml={2}
              >
                Logout
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
