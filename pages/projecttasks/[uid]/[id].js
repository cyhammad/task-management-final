import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import ProjectTaskIns from "../../../components/ProjectTask";
import SubNavBar from "../../../components/SubNavBar";
import Task from "../../../components/Task";
import Column from "../../../components/Column";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";

function ProjectTask() {
  const router = useRouter();
  const { user } = useAuth();
  const { uid, id } = router.query;
  const [taskList, setTaskList] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskCount, setNewTaskCount] = useState(3);
  const [todoTaskCount, setTodoTaskCount] = useState(3);
  const [inProgressTaskCount, setInProgressTaskCount] = useState(3);
  const [completedTaskCount, setCompletedTaskCount] = useState(3);
  useEffect(() => {
    const docRef = doc(db, `users/${uid}/projects`, id);
    const docSnap = getDoc(docRef).then((snapshot) => {
      setTaskList(snapshot.data().tasks);
    });
  }, [id, uid, newTasks, todoTasks, inProgressTasks, completedTasks]);
  useEffect(() => {
    var a = taskList.filter((item) => item.status == "new" || !item.status);
    setNewTasks(a);
  }, [taskList]);
  useEffect(() => {
    var a = taskList.filter((item) => item.status == "todo");
    setTodoTasks(a);
  }, [taskList]);
  useEffect(() => {
    var a = taskList.filter((item) => item.status == "inprogress");
    setInProgressTasks(a);
  }, [taskList]);
  useEffect(() => {
    var a = taskList.filter((item) => item.status == "completed");
    setCompletedTasks(a);
  }, [taskList]);
  const viewMore = (task) => {
    if (task == "new"){
      setNewTaskCount(newTasks.length)
    }
    if (task == "todo"){
      setTodoTaskCount(todoTasks.length)
    }
    if (task == "inProgress"){
      setInProgressTaskCount(inProgressTasks.length)
    }
    if (task == "completed"){
      setCompletedTaskCount(completedTasks.length)
    }
  }
  const viewLess = (task) => {
    if (task == "new") {
      setNewTaskCount(3);
    }
    if (task == "todo") {
      setTodoTaskCount(3);
    }
    if (task == "inProgress") {
      setInProgressTaskCount(3);
    }
    if (task == "completed") {
      setCompletedTaskCount(3);
    }
  };
  return (
    <div className="bg-default">
      <Head>
        <title>Task Management | Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header selectedTab="work" />

      {/* Tasks */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 min-h-screen">
        <h1 className="text-3xl font-bold mt-11">Project Tasks</h1>
        <SubNavBar selectedTab="projects" />
        <div className="flex space-x-5 w-full overflow-x-auto scroll-smooth scrollbar pb-60">
          <Column name="New Projects" taskCount={newTasks.length} viewMore={()=>viewMore("new")} viewLess={()=>viewLess("new")} >
            {newTasks.slice(0, newTaskCount).map((task) => (
              <ProjectTaskIns task={task} projectId={id} key={task.taskId} />
            ))}
          </Column>
          <Column name="Todo" taskCount={todoTasks.length} viewMore={()=>viewMore("todo")} viewLess={()=>viewLess("todo")} >
            {todoTasks.slice(0, todoTaskCount).map((task) => (
              <ProjectTaskIns task={task} projectId={id} key={task.taskId} />
            ))}
          </Column>
          <Column name="In Progress" taskCount={inProgressTasks.length} viewMore={()=>viewMore("inProgress")} viewLess={()=>viewLess("inProgress")} >
            {inProgressTasks.slice(0, inProgressTaskCount).map((task) => (
              <ProjectTaskIns task={task} projectId={id} key={task.taskId} />
            ))}
          </Column>
          <Column name="Completed" taskCount={completedTasks.length} viewMore={()=>viewMore("completed")} viewLess={()=>viewLess("completed")} >
            {completedTasks.slice(0, completedTaskCount).map((task) => (
              <ProjectTaskIns task={task} projectId={id} key={task.taskId} />
            ))}
          </Column>
        </div>
      </div>
      {/* Modal */}
    </div>
  );
}

export default ProjectTask;
