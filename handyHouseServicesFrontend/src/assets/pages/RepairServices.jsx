import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  Image,
//   Stack,
  Text,
  Heading,
//   Divider,
//   ButtonGroup,
  Button,
  SimpleGrid,
  CardBody,
  CardFooter,
  Box,
  Skeleton,
  SkeletonText,
  Input,
  InputGroup,
  InputLeftElement,
//   Badge,
//   HStack,
  useToast,
  Flex,
  Icon,
//   Tag,
//   TagLabel,
//   Tooltip,
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import ServiceModal from './serviceproviderModal';
import Footer from './Footer';

export const RepairServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState('');

  const toast = useToast();
  const location = useLocation();

  // ✅ Toast after Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get('payment');

    if (!payment) return;

    if (payment === 'success') {
      toast({
        title: 'Payment successful ✅',
        description: 'Your booking is confirmed.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } else if (payment === 'cancel') {
      toast({
        title: 'Payment cancelled',
        description: 'No charges were made. You can try again.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }

    // remove query param so it doesn’t repeat
    window.history.replaceState({}, '', location.pathname);
  }, [location.search, location.pathname, toast]);

  // Fetch services
  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`);
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        if (isMounted) setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        if (isMounted) {
          setError(e.message);
          toast({
            title: 'Error loading services',
            description: e.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => { isMounted = false; };
  }, [toast]);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    setServices([]);

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`);
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
        toast({
          title: 'Error loading services',
          description: e.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    })();
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    return services.filter(s =>
      [s.service, s.description].some(field =>
        (field || '').toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [services, search]);

  return (
    <Box pt={24} px={6} minH="100vh" bgGradient="linear(to-br, blue.50, white)">
      <Box maxW="7xl" mx="auto">

        {/* Header */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={4} mb={8}>
          <Box>
            <Heading size="xl" bgGradient="linear(to-r, blue.600, blue.400)" bgClip="text">
              Find the Right Service
            </Heading>
            <Text mt={2} color="gray.600" fontSize="sm">
              Browse trusted household professionals and book instantly.
            </Text>
          </Box>

          <InputGroup maxW={{ base: '100%', md: '320px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="blue.400" />
            </InputLeftElement>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              bg="white"
              borderRadius="full"
              boxShadow="sm"
              _focus={{ boxShadow: 'md' }}
            />
          </InputGroup>
        </Flex>

        {/* Error */}
        {error && !loading && (
          <Flex direction="column" align="center" py={16}>
            <Icon as={FiAlertTriangle} boxSize={12} color="red.400" mb={4} />
            <Text fontSize="lg" fontWeight="semibold" mb={2}>Failed to load services</Text>
            <Text mb={6} color="gray.600">{error}</Text>
            <Button leftIcon={<FiRefreshCw />} onClick={retry} colorScheme="blue">
              Retry
            </Button>
          </Flex>
        )}

        {/* Loading */}
        {loading && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} borderRadius="2xl" overflow="hidden" boxShadow="lg" bg="white">
                <Skeleton height="180px" />
                <CardBody>
                  <Skeleton height="20px" mb={3} />
                  <SkeletonText noOfLines={3} spacing={2} />
                </CardBody>
                <CardFooter>
                  <Skeleton height="36px" w="120px" borderRadius="md" />
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Grid */}
        {!loading && !error && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {filtered.map(service => (
              <Card 
                key={service._id || service.service} 
                borderRadius="3xl" 
                boxShadow="xl" 
                bg="white" 
                overflow="hidden"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
                h="100%"
                direction="column"
              >
                <Box h="260px" w="100%" overflow="hidden">
                  <Image 
                    src={service.image} 
                    alt={service.service} 
                    h="100%" 
                    w="100%" 
                    objectFit="cover" 
                    transition="transform 0.4s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                </Box>
                <CardBody flex="1" display="flex" flexDirection="column" gap={3}>
                  <Heading size="md" color="blue.800">{service.service}</Heading>
                  <Text fontSize="md" color="slate.600" noOfLines={3}>
                    {service.description}
                  </Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    width="full" 
                    rounded="xl"
                    onClick={() => handleBookNow(service)}
                    _hover={{ bg: 'blue.600' }}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {showModal && selectedService && (
          <ServiceModal serviceType={selectedService.service} onClose={() => setShowModal(false)} />
        )}

      </Box>
      <Footer />
    </Box>
  );
};

export default RepairServices;
