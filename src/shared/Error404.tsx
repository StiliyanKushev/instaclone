import React from 'react'
import { Header, Container } from 'semantic-ui-react'

const styles = {
    'height':'100%',
    'justify-content':'center',
    'align-items':'center',
    'display':'flex'
}

const headerStyles = {
    fontSize:'6rem'
}

const LoadingView = () => (
    <div className='view-container' style={styles}>
        <Container style={{'margin-top':'-5rem'}} textAlign='center'>
            <Header size='huge'><span style={headerStyles}>404</span> Not Found</Header>
            <Header size='large'>The page you are looking for doesn't exist.</Header>
            <Header size='medium'>Click the home icon to go back to the front page. Have a nice day!</Header>
        </Container>
    </div>
)

export default LoadingView;