'use client'

import IcsUploader from '../../components/ui/IcsUploader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function ClassSelection() {
    return (
        <Card
          minH = "100vh"
          bg = "gray.100"
          display = "flex"
          justifyContent = "center"
          alignItems = "center"
        >
        <VStack spacing = {4}>
          <Box
            bg = "white"
            p = {7}
            boxShadow = "md"
            maxW = "600px"
            width = "300%"
          >
            <VStack spacing = {4} align = "stretch">
                <Text
                    position = "relative"
                    top = "-8px"
                    color = "maroon"
                    fontSize = "l"
                    fontWeight = "bold"
                    textAlign = "left"
                >Add Your Classes</Text>
                    
                <Input placeholder = "Search By Class Code or Name (e.g., CS 311)"></Input>
                <Button>View My Dashboard</Button>     
            </VStack>   
            </Box>
            <Text color = "maroon" fontSize = "l" fontWeight = "bold">OR</Text>
            <IcsUploader/>
          </VStack>
        </Card>
    )
}