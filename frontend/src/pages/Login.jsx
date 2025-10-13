'use client'

import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { Link, Box, Text, VStack } from '@chakra-ui/react'

export default function Login() {
  return (
    <Box
      minH = "100vh"
      bg = "gray.100"
      display = "flex"
      justifyContent = "center"
      alignItems = "center"
    >
        <Box
        bg = "white"
        p = {10}
        boxShadow = "md"
        maxW = "400px"
        width = "100%"
        >
            <VStack spacing = {4} align = "stretch">
                <Text
                position = "relative"
                top = "-8px"
                color = "maroon"
                fontSize = "2xl"
                fontWeight = "bold"
                textAlign = "center"
                >ClassMatch</Text>
                
                <Input placeholder = "Email Address" type = "email" />
                <Input placeholder = "Password" type = "password" />
                <Button>Log In</Button>
                
                <Text fontSize = "sm" textAlign = "center" color = "black">
                    Don’t have an account? {" "}
                    <Link href = "/Signup" color = "maroon"
                    >Sign Up</Link>
                </Text>
            </VStack>
        </Box>
    </Box>
  )
}
