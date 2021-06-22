import React, { MouseEvent, useState } from 'react'
import { Accordion, Menu, MenuItemProps } from 'semantic-ui-react'
import { ProjectsType, SubPanelType } from 'Utilities/types'

const projects = {
  projects: [
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
}

const ProjectsList = () => {
  const [activeItem, setActiveItem] = useState('')

  const handleClick = (_event: MouseEvent, data: MenuItemProps) => {
    const { name } = data
    console.log(name)
    if (name) { setActiveItem(name) }
  }

  const subPanel = (project: SubPanelType, parentName: string) => (
    [{ key: project.name, title: project.name, content: { content: subContents(project.subProjects, parentName) } }]
  )

  const subContents = (projects: ProjectsType[], parentName: string) => (
    <div>
      {
        projects.map((project) => {
          const key = `${parentName}/////${project.name}`
          if (project.subProjects) {
            return (
              <Menu.Item>
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

  const projectsWithSubprojects = projects.projects.filter((project) => project.subProjects)
  const rootPanel = projectsWithSubprojects.map((project) => (
    { key: project.name, title: project.name, content: { content: subContents(projectsWithSubprojects, project.name) } }
  ))

  return (
    <div>
      <Menu vertical>
        <Menu.Item header>
          Projects
        </Menu.Item>
        <Accordion panels={rootPanel} fluid />
        {
          projects.projects.map((project) => (
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
