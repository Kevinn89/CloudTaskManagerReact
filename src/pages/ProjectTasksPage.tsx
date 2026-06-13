import { useEffect, useState } from "react";
import TaskList from "../components/task/TaskList";
// import { useProjects } from "../context/ProjectContext";
import { type TaskResponse } from "../services/TaskService";
import { useAppSelector } from "../store/hooks";


function ProjectTasksPage() {

  // const { selectedProject } = useProjects();

  const selectedProject = useAppSelector(state => state.project.selectedProject);
  const [taskList, setTaskList] = useState<TaskResponse[]>([])

  const editable = true

  if (!selectedProject) {
    throw new Error("No Selected Project");
  }

  // const { id } = selectedProject;

  useEffect(() => {

    // async function getMyTask() {

    //   const tasks = getTask(id).catch(error => console.log(error))

    // }

    setTaskList(selectedProject.tasks)

  })


  return (
    <main className="page project-tasks-page">
      <section>
        <h1>Project tasks</h1>
        <p>Review the tasks assigned to this project.</p>
        <TaskList tasks={taskList} editable={editable} />
      </section>
    </main>
  );
}

export default ProjectTasksPage;


