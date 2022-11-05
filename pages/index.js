import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import SubNavBar from "../components/SubNavBar";
import Header from "../components/Header";
import Column from "../components/Column";
import Project from "../components/Project";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export default function Home() {
  const { user, logout } = useAuth();
  const [taskList, setTaskList] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskCount, setNewTaskCount] = useState(3);
  const [todoTaskCount, setTodoTaskCount] = useState(3);
  const [inProgressTaskCount, setInProgressTaskCount] = useState(3);
  const [completedTaskCount, setCompletedTaskCount] = useState(3);
  useEffect(
    () =>
      onSnapshot(query(collectionGroup(db, "projects")), (snapshot) => {
        setTaskList(snapshot.docs);
      }),
    [db]
  );
  useEffect(() => {
    var a = taskList.filter((item) => item.data().status == "new");
    setNewTasks(a);
  }, [taskList]);
  useEffect(() => {
    var a = taskList.filter((item) => item.data().status == "todo");
    setTodoTasks(a);
  }, [taskList]);
  useEffect(() => {
    var a = taskList.filter((item) => item.data().status == "inprogress");
    setInProgressTasks(a);
  }, [taskList]);
  useEffect(() => {
    var a = taskList.filter((item) => item.data().status == "completed");
    setCompletedTasks(a);
  }, [taskList]);
  const viewMore = (task) => {
    if (task == "new") {
      setNewTaskCount(newTasks.length);
    }
    if (task == "todo") {
      setTodoTaskCount(todoTasks.length);
    }
    if (task == "inProgress") {
      setInProgressTaskCount(inProgressTasks.length);
    }
    if (task == "completed") {
      setCompletedTaskCount(completedTasks.length);
    }
  };
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
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 lg:min-h-screen">
        <h1 className="text-3xl font-semibold mt-11">Projects</h1>
        <SubNavBar selectedTab="projects" />
        <div className="flex space-x-5 w-full overflow-x-auto scroll-smooth scrollbar pb-60">
          <Column
            name="New Projects"
            taskCount={newTasks.length}
            viewMore={() => viewMore("new")}
            viewLess={() => viewLess("new")}
          >
            {newTasks.slice(0, newTaskCount).map((task) => (
              <>
                <Project
                  name={task.data().title}
                  priority={task.data().priorityValue}
                  userId={task.data().userId}
                  desc={task.data().description}
                  projectId={task.data().projectId}
                  key={task.data().id}
                  comments={task.data().comments}
                />
              </>
            ))}
          </Column>
          <Column
            name="Todo"
            taskCount={todoTasks.length}
            viewMore={() => viewMore("todo")}
            viewLess={() => viewLess("todo")}
          >
            {todoTasks.slice(0, newTaskCount).map((task) => (
              <>
                <Project
                  name={task.data().title}
                  priority={task.data().priorityValue}
                  userId={task.data().userId}
                  desc={task.data().description}
                  projectId={task.data().projectId}
                  key={task.data().id}
                />
              </>
            ))}
          </Column>
          <Column
            name="In Progress"
            taskCount={inProgressTasks.length}
            viewMore={() => viewMore("inProgress")}
            viewLess={() => viewLess("inProgress")}
          >
            {inProgressTasks.slice(0, inProgressTaskCount).map((task) => (
              <>
                <Project
                  name={task.data().title}
                  priority={task.data().priorityValue}
                  userId={task.data().userId}
                  desc={task.data().description}
                  projectId={task.data().projectId}
                  key={task.data().id}
                />
              </>
            ))}
          </Column>
          <Column
            name="Completed"
            taskCount={completedTasks.length}
            viewMore={() => viewMore("completed")}
            viewLess={() => viewLess("completed")}
          >
            {completedTasks.slice(0, completedTaskCount).map((task) => (
              <>
                <Project
                  name={task.data().title}
                  priority={task.data().priorityValue}
                  userId={task.data().userId}
                  desc={task.data().description}
                  projectId={task.data().projectId}
                  key={task.data().id}
                />
              </>
            ))}
          </Column>
        </div>
      </div>
      {/* Modal */}
    </div>
  );
}
