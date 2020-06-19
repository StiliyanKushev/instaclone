import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const fullScrean = {
    "height": "calc(100vh + 3rem)",
    "border": "none",
    "border-radius": "0rem",
    "margin": "-3rem"
}

const LoadingView = () => (
  <Segment style={fullScrean}>
    <Dimmer active>
      <Loader />
    </Dimmer>
  </Segment>
)

export default LoadingView
