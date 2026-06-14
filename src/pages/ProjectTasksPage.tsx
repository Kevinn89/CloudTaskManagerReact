import { useEffect, useState } from "react";
import TaskList from "../components/task/TaskList";
import { type TaskResponse } from "../services/TaskService";
import { useAppSelector } from "../store/hooks";


function ProjectTasksPage() {


  const selectedProjectId = useAppSelector(state => state.project.selectedProjectId);

  const projects = useAppSelector(state => state.project.projects);

  const [taskList, setTaskList] = useState<TaskResponse[]>([])

  const editable = true

  useEffect(() => {

    const selectedProjectTask = projects.find(pro => pro.id === selectedProjectId)?.tasks;

    if (selectedProjectTask)
      setTaskList(selectedProjectTask)

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


