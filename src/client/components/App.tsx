import React from 'react'
import DatasetsView from 'Components/DatasetsView'
import { Container, Grid } from 'semantic-ui-react'
import ProjectsList from 'Components/ProjectsList'

const App = () => (
  <Container style={{ margin: '30px' }}>
    <h1>collectio</h1>
    <Grid stackable>
      <Grid.Column width={3}>
        <ProjectsList />
      </Grid.Column>
      <Grid.Column width={13}>
        <DatasetsView />
      </Grid.Column>
    </Grid>
  </Container>
)

export default App
