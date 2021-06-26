import React, { MouseEvent, useState } from 'react'
import { useQuery } from 'react-query'
import { Accordion, Menu, MenuItemProps } from 'semantic-ui-react'
import { getProjects } from 'Utilities/services/projects'
import { ProjectType } from 'Utilities/types'
import AddProjectModal from 'Components/ProjectsList/AddProjectModal'

interface SubPanelType extends ProjectType {
  subProjects: ProjectType[]
}

const ProjectsList = () => {
  const [activeItem, setActiveItem] = useState('')

  const projectsQuery = useQuery<ProjectType[], Error>('projects', getProjects)
  if (!projectsQuery.data) { return null }
  const projects = projectsQuery.data

  const handleClick = (_event: MouseEvent, data: MenuItemProps) => {
    const { name } = data
    console.log(name)
    if (name) { setActiveItem(name) }
  }

  const subPanel = (project: SubPanelType, parentName: string) => (
    [{ key: project.name, title: project.name, content: { content: subContents(project.subProjects, parentName) } }]
  )

  const subContents = (projects: ProjectType[], parentName: string) => (
    <div>
      {
        projects.map((project) => {
          const key = `${parentName}/////${project.name}`
          if (project.subProjects) {
            return (
              <Menu.Item key={`${key}-subProjects`}>
                <Accordion.Accordion panels={subPanel(project as SubPanelType, key)} style={{ margin: '0 0 0 1em' }} />
              </Menu.Item>
            )
          }
          return (
            <Menu.Item
              key={key}
              name={key}
              active={activeItem === key}
              onClick={handleClick}
            >
              {project.name}
            </Menu.Item>
          )
        })
      }
    </div>
  )

  const projectsWithSubprojects = projects.filter((project) => project.subProjects)
  const rootPanel = projectsWithSubprojects.map((project) => (
    { key: project.name, title: project.name, content: { content: subContents(projectsWithSubprojects, project.name) } }
  ))

  return (
    <div>
      <Menu vertical>
        <Menu.Item header>
          Projects
          <AddProjectModal />
        </Menu.Item>
        <Accordion panels={rootPanel} fluid />
        {
          projects.map((project) => (
            !project.subProjects && (
              <Menu.Item
                key={project.name}
                name={project.name}
                active={activeItem === project.name}
                onClick={handleClick}
              >
                {project.name}
              </Menu.Item>
            )))
        }
      </Menu>
    </div>
  )
}

export default ProjectsList
