import React, { useState, MouseEvent } from 'react'
import { useQuery } from 'react-query'
import {
  Accordion, Menu, MenuItemProps, Popup, Icon, AccordionTitleProps
} from 'semantic-ui-react'
import { getProjects } from 'Utilities/services/projects'
import { ProjectType } from 'Utilities/types'
import AddProjectModal from 'Components/ProjectsList/AddProjectModal'
import DeleteProjectModal from 'Components/ProjectsList/DeleteProjectModal'

interface SubPanelType extends ProjectType {
  subProjects: ProjectType[]
}

type ContextMenuWrapperType = {
  itemKey: string,
  displayName: string,
  children: React.ReactElement
}

const ContextMenuWrapper = ({
  itemKey, displayName, children
}: ContextMenuWrapperType) => {
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
        trigger={
          React.cloneElement(children, {
            onContextMenu: (e: Event) => {
              e.preventDefault()
              setOpen(true)
            }
          })
        }
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

type ActiveItemType = {
  [depth: number]: string
}

const ProjectsList = () => {
  const [activeItem, setActiveItem] = useState<ActiveItemType>({})

  const projectsQuery = useQuery<ProjectType[], Error>('projects', getProjects)
  if (!projectsQuery.data) { return null }
  const projects = projectsQuery.data

  const handleClick = (_event: MouseEvent, data: MenuItemProps | AccordionTitleProps) => {
    const { name } = data
    console.log(name)
    if (name) { setActiveItem(name) }
  }

  const subContents = (projects: ProjectType[], depth: number) => {
    const handleAccordionClick = (id: string) => {
      // If a child in a new parent is clicked, collapse all children of original parent
      const newItems: ActiveItemType = {}
      Object.entries(activeItem).forEach(([key, value]) => {
        if (depth > Number(key)) { newItems[Number(key)] = value }
      })

      // Close open accordion if it is clicked again
      if (activeItem[depth] === id) setActiveItem({ ...newItems, [depth]: '' })
      else setActiveItem({ ...newItems, [depth]: id })
    }

    return (
      <div>
        {
          projects.map((project) => {
            if (project.subProjects) {
              return (
                <Menu.Item
                  key={`${project.id}-subProjects`}
                >
                  <Accordion style={{ margin: '0' }}>
                    <ContextMenuWrapper
                      itemKey={project.id}
                      displayName={project.name}
                    >
                      <Accordion.Title
                        active={activeItem[depth] === project.id}
                      >
                        <Icon
                          name="dropdown"
                          onClick={() => handleAccordionClick(project.id)}
                        />
                        <Menu.Item
                          name={project.id}
                          onClick={handleClick}
                        >
                          {project.name}
                        </Menu.Item>
                      </Accordion.Title>
                    </ContextMenuWrapper>
                    <Accordion.Content active={activeItem[depth] === project.id}>
                      {subContents(project.subProjects, depth + 1)}
                    </Accordion.Content>
                  </Accordion>
                </Menu.Item>
              )
            }

            return (
              <ContextMenuWrapper
                key={project.id}
                itemKey={project.id}
                displayName={project.name}
              >
                <Menu.Item
                  name={project.id}
                  onClick={handleClick}
                >
                  {project.name}
                </Menu.Item>
              </ContextMenuWrapper>
            )
          })
        }
      </div>
    )
  }

  const subProjectExists = (project: ProjectType): project is SubPanelType => (!!project.subProjects)
  const projectsWithSubprojects = projects.filter(subProjectExists)

  return (
    <div>
      <Menu vertical>
        <Menu.Item header style={{ display: 'flex', alignItems: 'center' }}>
          Projects
          <AddProjectModal />
        </Menu.Item>
        <Accordion fluid>
          {subContents(projectsWithSubprojects, 0)}
        </Accordion>

        {
          projects.map((project) => (
            !project.subProjects && (
              <ContextMenuWrapper
                key={project.id}
                itemKey={project.id}
                displayName={project.name}
              >
                <Menu.Item
                  name={project.id}
                  onClick={handleClick}
                >
                  {project.name}
                </Menu.Item>
              </ContextMenuWrapper>
            )))
        }
      </Menu>
    </div>
  )
}

export default ProjectsList
