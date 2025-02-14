// import React from 'react'
import { Card, Image, Stack, Text, Heading, Divider, ButtonGroup, Button, SimpleGrid, CardBody, CardFooter } from '@chakra-ui/react'
import { useState } from 'react';
import plumber from '../assets/Images/plumber.jpg';
import electrician from '../assets/Images/electrician.jpg';
import carpenter from '../assets/Images/carpenter.jpg';
import babysitter from '../assets/Images/babysitter.png';
import gardener from '../assets/Images/gardener.webp';
import petsitter from '../assets/Images/petsitter.jpg';
import Modal from './Modal'
import Footer from './Footer'

export const RepairServices = () => {
  
  const [showModal, setshowModal] = useState(false);
  return (
    <div className=" relative top-10 z-10">
      <SimpleGrid className="md:flex column" spacing={4} templateColumns='repeat(auto-fill, minmax(400px, 1fr))'>
        <Card maxW='sm'>
          <CardBody>
            <Image
              src={plumber}
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Contact Plumber</Heading>
              <Text>
                Drips driving you crazy? We will have your plumbing flowing smoothly in a flash!
              </Text>
              <Divider />
              <Divider />
              <Divider />
              <Divider />
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
              src={electrician}
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Contact Electrician</Heading>
              <Text>
                Flickering lights got you down? Our electricians will turn your frown upside down!
              </Text>
              <Divider />
              <Divider />
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
              src={carpenter}
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Contact Carpenter</Heading>
              <Text>
                Looking for a skilled carpenter who can tackle any project?
                We specialize in renovations, repairs, custom furniture, and more.
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
              src={babysitter}
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
              src={gardener}
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
              src={petsitter}
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


// export default RepairServices;