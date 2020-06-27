import React from 'react'
import { Header, Container } from 'semantic-ui-react'

const styles = {
    marginTop:'20rem'
}

const LoadingView = () => (
    <Container style={styles} textAlign='center'>
        <Header size='huge'>404 Not Found</Header>
        <Header size='large'>The page you are looking for doesn't exist.</Header>
        <Header size='medium'>Click the home icon to go back to the front page. Have a nice day!</Header>
    </Container>
)

export default LoadingView
