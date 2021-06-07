import React from 'react'
import DatasetsView from 'Components/DatasetsView'
import { Container } from 'semantic-ui-react'

const App = () => (
  <Container style={{ margin: '30px' }}>
    <h1>collectio</h1>
    <DatasetsView />
  </Container>
)

export default App
