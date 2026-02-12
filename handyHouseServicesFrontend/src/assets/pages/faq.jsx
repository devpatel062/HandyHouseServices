import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Flex,
} from "@chakra-ui/react";
import Footer from "./Footer";

const accentGradient = "linear(to-r, blue.600, blue.400)";

const Faq = () => {
  const faqs = [
    {
      question: "How do I book a service?",
      answer:
        'Simply click on the "Book Now" button under the service provider of your choice and follow the prompts.',
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes, you can cancel a booking up to 24 hours before the scheduled time from your user dashboard.",
    },
    {
      question: "Are service providers verified?",
      answer:
        "Yes, all providers go through a verification process before being listed.",
    },
    {
      question: "How are payments handled?",
      answer:
        "Currently, payments are handled in person. We are working on integrating online payments soon.",
    },
    {
      question: "Is there customer support?",
      answer:
        "Yes, you can reach out to our support team via the contact page or email us at support@handyhouse.com.",
    },
  ];

  return (
    <Flex
      px={6}
      direction="column"
      minH="100vh"
      bg="white"
    >
      {/* Main content area */}
      <Box flex="1" maxW="4xl" mx="auto" p={4} mt={20}>
        <Heading
          as="h1"
          size="xl"
          textAlign="center"
          mb={8}
          bgClip="text"
          bgGradient={accentGradient}
          fontWeight="extrabold"
        >
          Frequently Asked Questions
        </Heading>
        <Box
          borderRadius="2xl"
          boxShadow="xl"
          bg="whiteAlpha.80"
          backdropFilter="blur(8px)"
          borderWidth="2px"
          borderStyle="solid"
          borderColor="blue.100"
          p={{ base: 4, md: 8 }}
        >
          <Accordion allowToggle>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                borderRadius="xl"
                mb={3}
                border="none"
              >
                <h2>
                  <AccordionButton
                    _expanded={{
                      bgGradient: accentGradient,
                      color: "white",
                      boxShadow: "md",
                    }}
                    borderRadius="xl"
                    transition="all 0.2s"
                    py={4}
                  >
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} fontSize="md" color="gray.700">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Box>
      {/* Sticky-to-bottom footer */}
      <Footer />
    </Flex>
  );
};

export default Faq;
