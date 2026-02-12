import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  useToast,
  Spinner,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  HStack,
  VStack,
  Skeleton,
  SkeletonText,
  Divider,
  Avatar,
  Tooltip,
  Flex,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FiRefreshCw } from 'react-icons/fi';

const serviceEmoji = (type='') => {
  const t = type.toLowerCase();
  if (t.includes('plumb')) return '🛠️';
  if (t.includes('electric')) return '⚡';
  if (t.includes('clean')) return '🧹';
  if (t.includes('repair')) return '🔧';
  if (t.includes('paint')) return '🎨';
  return '🛎️';
};

const formatDate = (d) => new Date(d).toLocaleString(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
});

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/mybookings`,
          { withCredentials: true }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Failed to load bookings.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const total = bookings.length;

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/mybookings/${bookingId}`,
        { withCredentials: true }
      );

      setBookings(prev => prev.filter(b => b._id !== bookingId));

      toast({
        title: "Booking Cancelled",
        description: "Your service booking has been removed.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Cancellation error:", error);
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel the booking. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box maxW="7xl" mx="auto" px={6} py={12} mt={10}>
        <Heading size="lg" mb={8} color="orange.500">My Service Bookings</Heading>
        <SimpleGrid columns={[1, 1, 2, 3]} spacing={8}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} p={6} borderWidth={1} borderRadius="xl" bg="white" boxShadow="sm">
              <Skeleton height="24px" mb={4} />
              <SkeletonText noOfLines={4} spacing={3} />
              <Skeleton height="32px" mt={6} />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" mt={28} px={6}>
        <Box fontSize="72px" mb={2}>🗂️</Box>
        <Heading size="lg" mb={2}>No Bookings Yet</Heading>
        <Text color="gray.600" mb={6} maxW="sm" textAlign="center">You haven't scheduled any services. Head over and book your first household help now!</Text>
        <Button colorScheme="orange" onClick={() => window.location.href = '/'} leftIcon={<FiRefreshCw />}>Browse Services</Button>
      </Flex>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" px={6} py={12} mt={10}>
      <HStack justify="space-between" align="center" mb={8}>
        <Heading size="xl" color="orange.500" textShadow="0 2px 4px rgba(0,0,0,0.1)">
          My Service Bookings
        </Heading>
        <Box bg="orange.100" px={4} py={2} borderRadius="full">
          <Text fontWeight="bold" color="orange.700">Total Bookings: {total}</Text>
        </Box>
      </HStack>

      <SimpleGrid columns={[1, 1, 2, 3]} spacing={8}>
        {bookings.map((booking, index) => {
          return (
            <Box
              key={index}
              position="relative"
              p={6}
              borderWidth={1}
              borderRadius="2xl"
              boxShadow="lg"
              bgGradient="linear(to-br, white, orange.50)"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
              transition="all 0.25s"
            >
              <Box position="absolute" top={0} left={0} right={0} h="3px" bgGradient="linear(to-r, orange.400, pink.300)" borderTopRadius="2xl" />
              <HStack justify="space-between" mb={3} align="flex-start">
                <HStack spacing={3} align="center">
                  <Box fontSize="32px" lineHeight={1}>{serviceEmoji(booking.serviceType)}</Box>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="bold" fontSize="lg">{booking.serviceType}</Text>
                    {booking.serviceProviderRating && (
                      <Text fontSize="xs" color="purple.500" fontWeight="bold">Rating: {booking.serviceProviderRating}</Text>
                    )}
                  </VStack>
                </HStack>
                <Tooltip label={formatDate(booking.date)} fontSize="xs">
                  <Text fontSize="sm" color="gray.500">{formatDate(booking.date).split(',')[0]}</Text>
                </Tooltip>
              </HStack>

              <Divider my={4} />
              <SimpleGrid columns={1} spacingY={2} fontSize="sm">
                <Text><strong>Name:</strong> {booking.fullname}</Text>
                <Text><strong>Email:</strong> {booking.email}</Text>
                <Text><strong>Problem:</strong> {booking.problem}</Text>
              </SimpleGrid>

              {/* Provider Info */}
              <Accordion allowToggle mt={5} reduceMotion>
                <AccordionItem border="none">
                  <AccordionButton _expanded={{ bg: 'orange.100' }} px={0}>
                    <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="sm">Service Provider Details</Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={0} pt={3} pb={1} fontSize="sm">
                    <HStack align="flex-start" spacing={4}>
                      <Avatar name={booking.serviceProvidername} size="sm" bg="orange.400" color="white" />
                      <VStack align="flex-start" spacing={1}>
                        <Text><strong>Name:</strong> {booking.serviceProvidername}</Text>
                        <Text><strong>Email:</strong> {booking.serviceProvideremail}</Text>
                        <Text><strong>Phone:</strong> {booking.serviceProvidernumber}</Text>
                        {booking.serviceProviderRating && (
                          <Text><strong>Rating:</strong> {booking.serviceProviderRating}</Text>
                        )}
                      </VStack>
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Button
                mt={4}
                w="full"
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => handleCancelBooking(booking._id)}
                _hover={{ bg: 'red.50' }}
              >
                Cancel Booking
              </Button>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};



export default UserBookings;
