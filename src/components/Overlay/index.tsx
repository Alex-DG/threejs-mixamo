import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: grey;

  position: absolute;

  margin: 20px;
  width: 200px;

  border-radius: 4px;

  ul {
    list-style: none;
    padding: 10px;
  }
  li {
    color: white;
  }
`

type OverlayProps = {
  display?: boolean
}

const Overlay = ({ display }: OverlayProps) => {
  if (display) {
    return (
      <Container>
        <ul>
          <li>key up: walk</li>
          <li>key down: stop</li>
          <li>space: jump</li>
        </ul>
      </Container>
    )
  }

  return null
}

export default Overlay
