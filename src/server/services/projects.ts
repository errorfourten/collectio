import { ProjectsType } from '@util/types'

const projects: Array<ProjectsType> = [
  {
    name: 'Project 1',
    subProjects: [
      {
        name: 'Project 1-1',
        subProjects: [
          {
            name: 'Project 1-1-1',
            subProjects: [
              {
                name: 'Project 1-1-1-1'
              }
            ]
          }
        ]
      },
      {
        name: 'Project 1-2',
        subProjects: [
          {
            name: 'Project 1-2-1'
          },
          {
            name: 'Project 1-2-2'
          }
        ]
      },
      {
        name: 'Project 1-3'
      }
    ]
  },
  {
    name: 'Project 2',
    subProjects: [
      {
        name: 'Project 2-1'
      }
    ]
  },
  {
    name: 'Project 3'
  }
]

const allProjects = () => (projects)

export default {
  allProjects
}
