import styled from 'styled-components'

export const LoadingWrapper = styled.div`
  min-height: 100vh;

  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const LoadingText = styled.h1`
  color: white;
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  padding: 15px;

  position: relative;

  background-color: grey;

  border-radius: 4px;

  margin: 0 auto;

  z-index: 0;
`

export const StyledCanvas = styled.canvas`
  position: absolute;
  z-index: -1;
  min-height: 100vh;

  background-color: transparent;
`
