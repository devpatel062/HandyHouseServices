import { useEffect, useState, useContext } from "react";
import {
  useColorMode,
  Switch,
  Flex,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [display, changeDisplay] = useState("none");

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://handy-house-services-backend.vercel.app/api/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      // dispatch({ type: UserContext, payload: false });
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Flex>
      <>dsdsdsadsad</>
      <Flex position="absolute" top="1rem" right="1rem" align="center">
        <Flex display={["none", "none", "flex", "flex"]}>
          <Link to={user ? "/" : "#"} aria-label="Home">
            <Button as="a" variant="ghost" my={5} w="100%">
              Home
            </Button>
          </Link>

          <Link
            to={user ? "/RepairServices" : "#"}
            aria-label="Repair Services"
          >
            <Button as="a" variant="ghost" my={5} w="100%" isDisabled={!user}>
              Repair Services
            </Button>
          </Link>

          <Link to={user ? "/aboutUs" : "#"} aria-label="About Us">
            <Button as="a" variant="ghost" my={5} w="100%" isDisabled={!user}>
              About Us
            </Button>
          </Link>
          {user ? (
            <Button
              onClick={handleLogout}
              bg="white"
              color="black"
              border="1px solid #ccc"
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.200" }}
            >
              Logout
            </Button>
          ) : (
            <></>
          )}
        </Flex>

        <IconButton
          aria-label="Open Menu"
          size="lg"
          mr={2}
          icon={<HamburgerIcon />}
          onClick={() => changeDisplay("flex")}
          display={["flex", "flex", "none", "none"]}
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
            onClick={() => changeDisplay("none")}
          />
        </Flex>

        <Flex flexDir="column" align="center">
          <Link to="/" aria-label="Home">
            <Button as="a" variant="ghost" my={5} w="100%">
              Home
            </Button>
          </Link>

          <Link
            to={user ? "/RepairServices" : "#"}
            aria-label="Repair Services"
          >
            <Button as="a" variant="ghost" my={5} w="100%" isDisabled={!user}>
              Repair Services
            </Button>
          </Link>

          <Link to={user ? "/aboutUs" : "#"} aria-label="About Us">
            <Button as="a" variant="ghost" my={5} w="100%" isDisabled={!user}>
              About Us
            </Button>
          </Link>
          {user ? (
            <Button
              onClick={handleLogout}
              bg="white"
              color="black"
              border="1px solid #ccc"
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.200" }}
            >
              Logout
            </Button>
          ) : (
            <></>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
