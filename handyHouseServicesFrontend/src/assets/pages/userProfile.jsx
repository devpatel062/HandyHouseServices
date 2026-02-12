import { useContext, useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  useToast,
  Divider,
  Flex,
  Avatar,
  Input,
  IconButton,
  HStack,
  Tag,
  TagLabel,
  Skeleton,
  SkeletonCircle,
  FormControl,
  FormLabel,
  Tooltip,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { FiCheck, FiLogOut, FiTrash2 } from 'react-icons/fi';
import axios from "axios";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    location: "",
    email: "",
  });
  const cardBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");
  const bannerGradient = useColorModeValue(
    "linear(to-r, blue.600, blue.400)",
    "linear(to-r, blue.400, blue.600)"
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user`,
          { withCredentials: true }
        );
        setUser(response.data);
        setFormData({
          username: response.data.username || "",
            location: response.data.location || "",
            email: response.data.email || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          title: "Failed to fetch user data.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const dirty =
    formData.username !== (user?.username || "") ||
    formData.email !== (user?.email || "") ||
    formData.location !== (user?.location || "");

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/signin");
    } catch (error) {
      toast({
        title: "Logout failed.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/deleteuser`,
        {
          withCredentials: true,
        }
      );
      setUser(null);
      toast({
        title: "Account deleted.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      navigate("/signup");
    } catch (error) {
      toast({
        title: "Failed to delete account.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    if (!dirty) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user`,
        formData,
        { withCredentials: true }
      );
      toast({
        title: "Profile updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setEditing(false);
      setUser({ ...user, ...formData });
    } catch (error) {
      toast({
        title: "Update failed.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bgGradient="linear(to-br, blue.50, white)">
        <Box w="100%" maxW="560px" p={0} mx={4}>
          <Skeleton height="140px" borderTopRadius="xl" />
          <Box p={6} bg={cardBg} borderBottomRadius="xl" boxShadow="xl" backdropFilter="blur(6px)">
            <SkeletonCircle size="20" mt={-20} mb={4} />
            <Skeleton height="28px" mb={4} />
            <Skeleton height="16px" mb={2} />
            <Skeleton height="16px" mb={2} />
            <Skeleton height="16px" mb={6} />
            <HStack spacing={4}>
              <Skeleton height="40px" flex={1} />
              <Skeleton height="40px" flex={1} />
            </HStack>
          </Box>
        </Box>
      </Flex>
    );
  }

  if (!user) {
    return (
      <Text textAlign="center" mt={10}>
        You must be logged in to view this page.
      </Text>
    );
  }

  return (
    <Flex justify="center" align="flex-start" minH="100vh" py={14} px={4} bgGradient="linear(to-br, blue.50, white)">
      <Box w="100%" maxW="640px" position="relative">
  {/* Banner */}
  <Box h="150px" borderTopRadius="2xl" bgGradient={bannerGradient} boxShadow="md" />
        {/* Card */}
        <Box
          mt={-16}
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          boxShadow="2xl"
          backdropFilter="blur(10px) saturate(160%)"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
        >
          <Flex direction={{ base: 'column', sm: 'row' }} align={{ base: 'flex-start', sm: 'center' }} mb={4}>
            <Box position="relative" mr={{ base: 0, sm: 6 }} mb={{ base: 4, sm: 0 }}>
              <Avatar size="2xl" name={user.username} />
              {editing && (
                <Tooltip label="Editing mode" hasArrow>
                  <Badge position="absolute" bottom={1} right={1} colorScheme='blue' borderRadius='full' px={2} fontSize='0.6rem'>EDIT</Badge>
                </Tooltip>
              )}
            </Box>
            <Box flex={1}>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={1}>
                {user.username || 'User'}
              </Heading>
              <HStack spacing={3} flexWrap="wrap" mb={3}>
                <Tag colorScheme='blue' borderRadius='full' size='sm'>
                  <TagLabel>{user.location || 'Location: N/A'}</TagLabel>
                </Tag>
                <Tag colorScheme='blue' borderRadius='full' size='sm'>
                  <TagLabel>{user.email}</TagLabel>
                </Tag>
              </HStack>
              {!editing && (
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme='blue'
                  size='sm'
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Flex>

          <Divider mb={6} />

          {editing ? (
            <Stack spacing={5}>
              <FormControl>
                <FormLabel fontSize='sm' fontWeight='semibold'>Name</FormLabel>
                <Input
                  value={formData.username}
                  onChange={(e)=>setFormData({...formData, username: e.target.value})}
                  placeholder='Your name'
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize='sm' fontWeight='semibold'>Email</FormLabel>
                <Input
                  type='email'
                  value={formData.email}
                  onChange={(e)=>setFormData({...formData, email: e.target.value})}
                  placeholder='you@example.com'
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize='sm' fontWeight='semibold'>Location</FormLabel>
                <Input
                  value={formData.location}
                  onChange={(e)=>setFormData({...formData, location: e.target.value})}
                  placeholder='City, State'
                />
              </FormControl>
              <HStack spacing={4} pt={2}>
                <Button
                  leftIcon={<FiCheck />}
                  colorScheme='green'
                  size='sm'
                  onClick={handleSave}
                  isDisabled={!dirty || saving}
                  isLoading={saving}
                  loadingText='Saving'
                >
                  Save Changes
                </Button>
                <Button
                  leftIcon={<CloseIcon boxSize={3} />}
                  size='sm'
                  variant='ghost'
                  onClick={()=>{ setEditing(false); setFormData({ username: user.username||'', email: user.email||'', location: user.location||'' }); }}
                >
                  Cancel
                </Button>
              </HStack>
            </Stack>
          ) : (
            <Stack spacing={3} fontSize='sm'>
              <Text><strong>Name:</strong> {user.username}</Text>
              <Text><strong>Email:</strong> {user.email}</Text>
              <Text><strong>Location:</strong> {user.location || 'Not provided'}</Text>
            </Stack>
          )}

          <Divider my={8} />

          <HStack spacing={4} justify='space-between' flexWrap='wrap'>
            <Button
              size='sm'
              leftIcon={<FiLogOut />}
              colorScheme='blue'
              variant='outline'
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              size='sm'
              leftIcon={<FiTrash2 />}
              colorScheme='red'
              variant='solid'
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default UserProfile;
