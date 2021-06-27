import React, { useState, MouseEvent } from 'react'
import { useQuery } from 'react-query'
import {
  Accordion, Menu, MenuItemProps, Popup
} from 'semantic-ui-react'
import { getProjects } from 'Utilities/services/projects'
import { ProjectType } from 'Utilities/types'
import AddProjectModal from 'Components/ProjectsList/AddProjectModal'
import DeleteProjectModal from 'Components/ProjectsList/DeleteProjectModal'

interface SubPanelType extends ProjectType {
  subProjects: ProjectType[]
}

type ProjectItemType = {
  itemKey: string,
  active: boolean,
  onClick: (event: MouseEvent, data: MenuItemProps) => void,
  displayName: string
}

const ProjectItem = ({
  itemKey, active, onClick, displayName
}: ProjectItemType) => {
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  return (
    <>
      <DeleteProjectModal
        itemKey={itemKey}
        displayName={displayName}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <Popup
        size="mini"
        trigger={(
          <Menu.Item
            key={itemKey}
            name={itemKey}
            active={active}
            onClick={onClick}
            onContextMenu={(e: MouseEvent) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            {displayName}
          </Menu.Item>
        )}
        onClose={() => setOpen(false)}
        open={open}
        position="right center"
        closeOnEscape
        closeOnPortalMouseLeave
        closeOnDocumentClick
      >
        <Menu
          secondary
          vertical
          compact
        >
          <Menu.Item name="edit">Edit</Menu.Item>
          <Menu.Item
            name="delete"
            onClick={() => {
              setDeleteModalOpen(true)
              setOpen(false)
            }}
          >
            Delete
          </Menu.Item>
        </Menu>
      </Popup>
    </>
  )
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

  const subPanel = (project: SubPanelType) => (
    [{ key: `${project.id}-subPanel`, title: project.name, content: { content: subContents(project.subProjects) } }]
  )

  const subContents = (projects: ProjectType[]) => (
    <div>
      {
        projects.map((project) => {
          if (project.subProjects) {
            return (
              <Menu.Item key={`${project.id}-subProjects`}>
                <Accordion.Accordion panels={subPanel(project as SubPanelType)} style={{ margin: '0 0 0 1em' }} />
              </Menu.Item>
            )
          }

          return (
            <ProjectItem
              key={project.id}
              itemKey={project.id}
              active={activeItem === project.id}
              onClick={handleClick}
              displayName={project.name}
            />
          )
        })
      }
    </div>
  )

  const subProjectExists = (project: ProjectType): project is SubPanelType => (!!project.subProjects)
  const projectsWithSubprojects = projects.filter(subProjectExists)
  const rootPanel = projectsWithSubprojects.map((project) => (
    { key: `${project.id}-subPanel`, title: project.name, content: { content: subContents(project.subProjects) } }
  ))

  return (
    <div>
      <Menu vertical>
        <Menu.Item header style={{ display: 'flex', alignItems: 'center' }}>
          Projects
          <AddProjectModal />
        </Menu.Item>
        <Accordion panels={rootPanel} fluid />
        {
          projects.map((project) => (
            !project.subProjects && (
              <ProjectItem
                key={project.id}
                itemKey={project.id}
                active={activeItem === project.id}
                onClick={handleClick}
                displayName={project.name}
              />
            )))
        }
      </Menu>
    </div>
  )
}

export default ProjectsList
