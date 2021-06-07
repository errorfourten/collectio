import React from 'react'
import { useQuery } from 'react-query'
import { getDatasets } from 'Utilities/services/dataset'
import { Dataset } from 'Types'
import { Container, Segment } from 'semantic-ui-react'

import DatasetModal from './DatasetModal'
import AddDatasetFormModal from './AddDatasetFormModal'

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
  const datasetsQuery = useQuery<[Dataset], Error>('datasets', getDatasets)
  if (!datasetsQuery.data) {return null}
  const sortedDatasets = datasetsQuery.data.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
  console.log(sortedDatasets)

  return (
    <Container text>
      <AddDatasetFormModal />
      {sortedDatasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </Container>
  )
}

export default DatasetsView
