import { v4 as uuid } from 'uuid'
import { NewProjectType, ProjectType } from '@util/types'

const projects: Array<ProjectType> = [
  {
    id: '1779e45d-b740-4bc9-b57b-b62c06f51839',
    name: 'Project 1',
    dateCreated: new Date(2021, 1, 4),
    subProjects: [
      {
        id: '3c2d70ba-ab1d-4146-9542-1072efa47928',
        name: 'Project 1-1',
        dateCreated: new Date(2021, 5, 20),
        subProjects: [
          {
            id: 'f8baa702-0ac5-412a-8c52-26b410f1cba0',
            name: 'Project 1-1-1',
            dateCreated: new Date(2021, 5, 25),
            subProjects: [
              {
                id: '5f3db253-4906-4df7-96cb-c1a898c5b0e0',
                name: 'Project 1-1-1-1',
                dateCreated: new Date(2021, 6, 3)
              }
            ]
          }
        ]
      },
      {
        id: 'b19de291-04f3-4917-9321-c42f0de0002e',
        name: 'Project 1-2',
        dateCreated: new Date(2021, 6, 13),
        subProjects: [
          {
            id: 'e12a04cb-339c-45c7-afca-9aabd02142bf',
            name: 'Project 1-2-1',
            dateCreated: new Date(2021, 6, 14)
          },
          {
            id: 'c2b7efc7-eb86-4464-b5dd-0d2b066b6c9f',
            name: 'Project 1-2-2',
            dateCreated: new Date(2021, 6, 15)
          }
        ]
      },
      {
        id: 'f8d3b762-2ae9-4300-a0f1-51a8dac6616f',
        name: 'Project 1-3',
        dateCreated: new Date(2021, 6, 20)
      }
    ]
  },
  {
    id: 'a7b767f5-cb9e-4481-8884-f69e910c0e44',
    name: 'Project 2',
    dateCreated: new Date(2021, 6, 17),
    subProjects: [
      {
        id: 'ced63f98-59c1-4ec9-a9b1-98060fc32b90',
        name: 'Project 2-1',
        dateCreated: new Date(2021, 6, 18)
      }
    ]
  },
  {
    id: '376f5d17-3d73-4cdb-8a8e-76c2b699104b',
    name: 'Project 3',
    dateCreated: new Date(2021, 6, 20)
  }
]

const allProjects = () => (projects)

const addProject = (newProjectData: NewProjectType): ProjectType => {
  const newProject = { id: uuid(), name: newProjectData.name, dateCreated: new Date() }

  const recursivelyAddToProjects = (toSearch: ProjectType[]): ProjectType | undefined => (
    toSearch.find((project) => {
      if (newProjectData.parentProject === project.id) {
        if (project.subProjects) {
          project.subProjects.push(newProject)
        } else {
          // eslint-disable-next-line no-param-reassign
          project.subProjects = [newProject]
        }
        return true
      }
      if (project.subProjects) {
        return recursivelyAddToProjects(project.subProjects)
      }
      return false
    })
  )

  if (newProjectData.parentProject) {
    const found = recursivelyAddToProjects(projects)
    if (!found) throw new Error(`Unable to find parentProject ${newProjectData.parentProject}`)
  } else {
    projects.push(newProject)
  }

  return newProject
}

export default {
  allProjects,
  addProject
}
