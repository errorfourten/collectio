import React from 'react'
import { useQuery } from 'react-query'
import { getDatasets } from 'Utilities/services/dataset'
import { Dataset } from 'Types'
import { Segment } from 'semantic-ui-react'

const DatasetCard = ({ dataset }: {dataset: Dataset}) => (
  <Segment>
    <h2>{dataset.name}</h2>
    <i>{dataset.project}</i>
  </Segment>
)

const DatasetsView = () => {
  const datasets = useQuery<[Dataset], Error>('datasets', getDatasets)

  if (!datasets) {
    return null
  }

  return (
    <div>
      {datasets.data?.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </div>
  )
}

export default DatasetsView
