// import React from 'react'
import { Card, Image, Stack, Text, Heading, Divider, ButtonGroup, Button, SimpleGrid, CardBody, CardFooter } from '@chakra-ui/react'
import { useState } from 'react';
import ServiceModal from './serviceproviderModal'
import Footer from './Footer'

export const RepairServices = () => {
  const [services, setServices] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetch('https://handy-house-services-backend.vercel.app/api/services')
      .then(res => res.json())
      .then(data => setServices(data));
  }
  , []);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setshowModal(true);
  };

  return (
    <div className="relative top-20">
      {services.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={10} className="mx-10">
          {services.map((service) => (
            <Card key={idx} maxW='sm' className="w-full">
              <CardBody>
                <Image
                  src={service.image}
                  alt={service.name}
                  borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                  <Heading size='md'>{service.service}</Heading>
                  <Text>
                    {service.description}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing='2'>
                  <Button variant='solid' colorScheme='orange' onClick={() => handleBookNow(service)}>
                    Book Now
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
      {showModal && <ServiceModal serviceType={selectedService.service} onClose={() => setshowModal(false)} />}
      <Footer />
    </div>
  )
}


export default RepairServices;