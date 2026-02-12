// import React from 'react'
import { Box, Heading, Text, Flex, Image, Divider, SimpleGrid, Stack, Icon, Badge, useColorModeValue, Button } from '@chakra-ui/react';
import { FaHandshake, FaTools, FaShieldAlt, FaClock, FaUserCheck, FaLeaf } from 'react-icons/fa';
import Footer from './Footer';
import collage from '../Images/collage.jpg';

export const AboutUs = () => {
  const sectionBg = useColorModeValue('white', 'whiteAlpha.100');
  const subtle = useColorModeValue('gray.600', 'gray.300');
  const accentGradient = 'linear(to-r, blue.600, blue.400)';

  const values = [
    { icon: FaTools, title: 'Skilled Experts', desc: 'Vetted professionals with proven experience.' },
    { icon: FaHandshake, title: 'Trusted Service', desc: 'Transparent processes & clear communication.' },
    { icon: FaShieldAlt, title: 'Quality & Safety', desc: 'Adherence to safety & quality standards.' },
    { icon: FaClock, title: 'On-Time Delivery', desc: 'Punctual and reliable scheduling.' },
    { icon: FaUserCheck, title: 'Customer First', desc: 'Personalized solutions for every request.' },
    { icon: FaLeaf, title: 'Sustainable Choices', desc: 'Eco‑friendly methods & materials where possible.' },
  ];

  const timeline = [
    { year: '2022', text: 'Founded with a mission to simplify home care.' },
    { year: '2023', text: 'Expanded provider network & introduced smart recommendations.' },
    { year: '2024', text: 'Launched AI Chatbot & booking analytics engine.' },
    { year: '2025', text: 'Scaling nationwide with sustainable service initiatives.' },
  ];

  return (
    <Box pt={24} px={6} bgGradient="linear(to-b, blue.50, white)">
      {/* Hero Section (accent gradient wrapper) */}
      <Box
        bgGradient={`${accentGradient}`}
        py={{ base: 10, md: 16 }}
        px={{ base: 6, md: 10 }}
        borderRadius="3xl"
        maxW="7xl"
        mx="auto"
        mb={24}
        position="relative"
        overflow="hidden"
  boxShadow="0 8px 28px -6px rgba(37,99,235,0.08)"
        _before={{ content:'""', position:'absolute', inset:0, backdropFilter:'blur(2px)', bg:'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.35))' }}
      >
        <Flex direction={{ base: 'column-reverse', lg: 'row' }} align='center' gap={14} position="relative">
          {/* ...existing hero left box but using accentGradient for heading ... */}
          <Box flex={1}>
            <Badge mb={4} colorScheme='blue' px={3} py={1} borderRadius='full' bg='whiteAlpha.800' backdropFilter='blur(4px)'>Who We Are</Badge>
            <Heading size='2xl' mb={6} lineHeight={1.15} bgGradient='linear(to-r, blue.600, blue.400)' bgClip='text'>Making Home Maintenance Effortless</Heading>
            <Text fontSize='lg' color={subtle} mb={6} maxW='lg'>Welcome to <strong>HomeServices</strong>, your one‑stop platform for dependable home repair, improvement, and maintenance solutions. From plumbing to electrical to custom requests—our curated professionals have you covered.</Text>
    </Box>
    <Box flex={1} position='relative' w='100%'>
            <Box position='absolute' top='-6' left='-6' right='-6' bottom='-6' bgGradient={accentGradient} filter='blur(70px)' opacity={0.35} borderRadius='2xl' />
            <Image src={collage} alt='Service collage' borderRadius='2xl' objectFit='cover' w='100%' h={{ base: '280px', md: '400px' }} boxShadow='2xl' position='relative' />
          </Box>
        </Flex>
      </Box>

      {/* Mission & Commitment (accent timeline line) */}
      <Box maxW='5xl' mx='auto' mb={20}>
        {/* ...existing mission grid ... */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12}>
          {/* ...existing mission left box... */}
          <Box>
            <Heading size='xl' mb={4}>Our Mission</Heading>
            <Text fontSize='md' color={subtle} mb={6}>We provide reliable, high‑quality, and affordable home services—connecting you to trusted professionals while removing the stress from maintenance and improvement.</Text>
            <Heading size='md' mb={3}>Our Commitment</Heading>
            <Text fontSize='md' color={subtle}>From first click to project completion, we ensure transparency, professionalism, and craftsmanship. Your satisfaction drives our platform innovation.</Text>
          </Box>
          <Stack spacing={6}>
            <Heading size='md'>Growth Journey</Heading>
            <Stack spacing={4} position='relative' pl={4} _before={{ content:'""', position:'absolute', left:0, top:1, bottom:1, width:'3px', bgGradient:accentGradient, borderRadius:'full' }}>
              {timeline.map(item => (
                <Box key={item.year} position='relative' pl={4} _before={{ content:'""', position:'absolute', left:'-7px', top:'6px', width:'12px', height:'12px', bg:'white', border:'3px solid', borderColor:'blue.400', borderRadius:'full', boxShadow:'0 0 0 4px rgba(255,255,255,0.6)' }}>
                  <Text fontWeight='bold' fontSize='sm' color='blue.600'>{item.year}</Text>
                  <Text fontSize='sm' color={subtle}>{item.text}</Text>
                </Box>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>
      </Box>

      {/* Values Grid (accent border remains) */}
      <Box maxW='7xl' mx='auto' mb={24}>
        {/* ...existing values grid unchanged ... */}
        <Heading size='xl' textAlign='center' mb={12}>Why Choose Us?</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={10}>
          {/* ...existing mapping ... */}
          {values.map(v => (
            <Stack key={v.title} spacing={4} p={8} borderRadius='2xl' bg={sectionBg} boxShadow='md' position='relative' _before={{ content:'""', position:'absolute', inset:0, borderRadius:'2xl', padding:'2px', bgGradient:accentGradient, WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite:'xor', maskComposite:'exclude' }}>
              <Flex w={14} h={14} borderRadius='full' align='center' justify='center' bgGradient={accentGradient} color='white' boxShadow='lg'>
                <Icon as={v.icon} boxSize={6} />
              </Flex>
              <Heading size='md'>{v.title}</Heading>
              <Text fontSize='sm' color={subtle}>{v.desc}</Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Box>

      {/* Contact Form Section (accent halo) */}
      <Box maxW='7xl' mx='auto' mb={24} position='relative'>
  <Box position='absolute' inset={0} bgGradient={accentGradient} opacity={0.06} filter='blur(40px)' borderRadius='3xl' />
        {/* ...existing form heading & iframe ... */}
        <Heading size='xl' textAlign='center' mb={6} position='relative'>Get In Touch</Heading>
        <Text textAlign='center' maxW='2xl' mx='auto' mb={10} fontSize='md' color={subtle} position='relative'>Have a question or special request? Send us a message and our support team will get back to you promptly.</Text>
        <Flex justify='center' position='relative'>
          <Box borderRadius='2xl' overflow='hidden' boxShadow='2xl' bg={sectionBg} p={2} _hover={{ boxShadow:'3xl' }} transition='.3s'>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeE96BkhttxLkHkcCVKbNGVIjt8XylAxt8_OBkgm4VbogrO-g/viewform?embedded=true"
              width="640"
              height="720"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              style={{ borderRadius: '1rem' }}
              title="Google Contact Form"
            >Loading…</iframe>
          </Box>
        </Flex>
      </Box>

      {/* Call To Action Section with accent gradient */}
      <Box maxW='6xl' mx='auto' mb={28} px={6}>
        <Flex direction={{ base:'column', md:'row' }} align='center' justify='space-between' gap={8} p={10} borderRadius='3xl' bgGradient={accentGradient} color='white' boxShadow='2xl' position='relative' overflow='hidden'>
          <Box position='absolute' inset={0} bg='blackAlpha.060' />
          <Heading flex={1} size='lg' position='relative'>Ready to Book Your Next Service?</Heading>
          <Text flex={2} fontSize='sm' opacity={0.95} position='relative'>Explore our marketplace of vetted professionals and schedule a service in minutes. Fast, reliable, and tailored to you.</Text>
          <Button as='a' href='/repair-services' size='lg' colorScheme='whiteAlpha' bg='white' color='blue.700' _hover={{ bg:'whiteAlpha.900' }} position='relative'>Browse Services</Button>
        </Flex>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutUs;
