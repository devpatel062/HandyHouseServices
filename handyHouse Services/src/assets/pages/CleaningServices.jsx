// import React from 'react'
import { Card, Image, Stack, Text, Heading, Divider, ButtonGroup, Button, SimpleGrid, CardBody, CardFooter } from '@chakra-ui/react'
import { useState } from 'react';
import Modal from './Modal'
import Footer from './Footer'

export const CleaningServices = () => {

  const [showModal, setshowModal] = useState(false);
  return (
    <div className="relative top-20">
      <SimpleGrid className=" md:flex column" spacing={4} templateColumns='repeat(auto-fill, minmax(400px, 1fr))'>
        
        <Card maxW='sm'>
          <CardBody>
            <Image
              src='.\src\assets\Images\babysitter.png'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Contact BabySitting</Heading>
              <Text>
                Relax and enjoy your night out!  Our Company connects you with caring, qualified babysitters who will
                keep your kids safe, happy, and entertained.  Call today for a fun-filled evening!.
              </Text>
              <Text color='blue.600' fontSize='2xl'>
                $10
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='ghost' colorScheme='blue'>
                Reviews
              </Button>
              <Button onClick={() => setshowModal(true)} variant='solid' colorScheme='blue'>
                Book Service
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
        <Card maxW='sm'>
          <CardBody>
            <Image
              src='.\src\assets\Images\gardener.webp'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Contact Gardener</Heading>
              <Text>
                Lawn care, weeding, planting, and more! We offer a full range of gardening services
                to bring your vision to life.
              </Text>
              <Text color='blue.600' fontSize='2xl'>
                $10
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='ghost' colorScheme='blue'>
                Reviews
              </Button>
              <Button onClick={() => setshowModal(true)} variant='solid' colorScheme='blue'>
                Book Service
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
        <Card maxW='sm'>
          <CardBody>
            <Image
              src='.\src\assets\Images\petsitter.jpg'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Contact PetSitter</Heading>
              <Text>
                Peace of mind for you, playtime for your pet! Professional pet sitting services.
                Spoil your furry friend with TLC! In-home pet sitting with cuddles guaranteed.
              </Text>
              <Text color='blue.600' fontSize='2xl'>
                $10
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='ghost' colorScheme='blue'>
                Reviews
              </Button>
              <Button onClick={() => setshowModal(true)} variant='solid' colorScheme='blue'>
                Book Service
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
        {showModal && <Modal onClose={() => setshowModal(false)} />}
      </SimpleGrid>
      <Footer />
    </div>
  )
}


export default CleaningServices;