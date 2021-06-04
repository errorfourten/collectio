import React from 'react'
import { useQuery } from 'react-query'
import { getDatasets } from 'Utilities/services/dataset'
import { Dataset } from 'Types'
import { Container, Segment } from 'semantic-ui-react'

import DatasetModal from './DatasetModal'

const DatasetCard = ({ dataset }: {dataset: Dataset}) => (
  <Segment clearing>
    <h2>{dataset.name}</h2>
    <div>
      <i>{dataset.project}</i>
      <DatasetModal dataset={dataset} />
    </div>
  </Segment>
)

const DatasetsView = () => {
  const datasets = useQuery<[Dataset], Error>('datasets', getDatasets)

  if (!datasets) {
    return null
  }

  return (
    <Container text>
      {datasets.data?.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </Container>
  )
}

export default DatasetsView
