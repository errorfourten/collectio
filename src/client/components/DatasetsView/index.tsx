import React from 'react'
import { useQuery } from 'react-query'
import { getDatasets } from 'Utilities/services/dataset'
import { Dataset } from 'Utilities/types'
import { Container, Segment } from 'semantic-ui-react'

import DatasetModal from './DatasetDetailModal'
import AddDatasetModal from './AddDatasetModal'

const DatasetCard = ({ dataset }: {dataset: Dataset}) => (
  <Segment clearing>
    <h2>{dataset.name}</h2>
    <div>
      {dataset.description && <i>{dataset.description}</i>}
      <DatasetModal dataset={dataset} />
    </div>
  </Segment>
)

const DatasetsView = () => {
  const datasetsQuery = useQuery<[Dataset], Error>('datasets', getDatasets)
  if (!datasetsQuery.data) { return null }
  const sortedDatasets = datasetsQuery.data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Container text>
      <AddDatasetModal />
      {
        sortedDatasets.length
          ? (
            sortedDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))
          )
          : (
            <Segment color="blue"><h3>Add your first dataset!</h3></Segment>
          )
      }
    </Container>
  )
}

export default DatasetsView
