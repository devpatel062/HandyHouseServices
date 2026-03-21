import { useState, useRef, useEffect } from 'react';
import { Input, Box, List, ListItem, Text } from '@chakra-ui/react';

const AddressSelector = ({ value, onChange, placeholder = "Enter address..." }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const searchAddress = async (query) => {
    if (!query.trim() || !MAPBOX_TOKEN) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&limit=5&types=address,poi`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for API call (debouncing)
    timeoutRef.current = setTimeout(() => {
      if (inputValue.length > 2) {
        searchAddress(inputValue);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Box position="relative" width="100%">
      <Input
        ref={inputRef}
        variant="flushed"
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={() => value.length > 2 && setShowSuggestions(suggestions.length > 0)}
        placeholder={placeholder}
        required
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          zIndex={1000}
          maxH="200px"
          overflowY="auto"
        >
          <List spacing={0}>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={suggestion.id || index}
                p={3}
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => handleSuggestionClick(suggestion)}
                borderBottom={index < suggestions.length - 1 ? "1px solid" : "none"}
                borderColor="gray.100"
              >
                <Text fontSize="sm" color="gray.800">
                  {suggestion.place_name}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {isLoading && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={3}
          fontSize="sm"
          color="gray.500"
        >
          Searching addresses...
        </Box>
      )}
    </Box>
  );
};

export default AddressSelector;
