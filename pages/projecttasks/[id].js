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
import Header from "../../components/Header";
import SubNavBar from "../../components/SubNavBar";
import Task from "../../components/Task";
import TaskColumn from "../../components/TaskColumn";
import { db } from "../../firebase";

function ProjectTask() {
  const router = useRouter();
  const { id } = router.query;
  const [taskList, setTaskList] = useState([]);
  useEffect(
    () =>
      onSnapshot(query(collectionGroup(db, "projects")), (snapshot) => {
        snapshot.docs.forEach((doc) => {
          doc.id == id ? setTaskList(doc.data().tasks) : null;
        });
      }),
    []
  );
  console.log("TASKS:", taskList)
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
        <div className="flex space-x-5 w-full overflow-x-scroll scroll-smooth scrollbar">
          <TaskColumn name="New Projects">
            {taskList.map((task) => (
              <>
                {task.status == "new" || !task.status ? (
                  <Task
                    name={task.title}
                    priority={task.priorityValue}
                    userId={task.userId}
                    desc={task.description}
                    projectId={task.projectId}
                    key={task.id}
                  />
                ) : null}
              </>
            ))}
          </TaskColumn>
          <TaskColumn name="Todo">
            {taskList.map((task) => (
              <>
                {task.status == "todo" ? (
                  <Task
                    name={task.data().title}
                    priority={task.data().priorityValue}
                    userId={task.data().userId}
                    desc={task.data().description}
                    projectId={task.data().projectId}
                    key={task.data().id}
                  />
                ) : null}
              </>
            ))}
          </TaskColumn>
          <TaskColumn name="In Progress">
            {taskList.map((task) => (
              <>
                {task.status == "inprogress" ? (
                  <Task
                    name={task.data().title}
                    priority={task.data().priorityValue}
                    userId={task.data().userId}
                    desc={task.data().description}
                    projectId={task.data().projectId}
                    key={task.data().id}
                  />
                ) : null}
              </>
            ))}
          </TaskColumn>
          <TaskColumn name="Completed">
            {taskList.map((task) => (
              <>
                {task.status == "completed" ? (
                  <Task
                    name={task.data().title}
                    priority={task.data().priorityValue}
                    userId={task.data().userId}
                    desc={task.data().description}
                    projectId={task.data().projectId}
                    key={task.data().id}
                  />
                ) : null}
              </>
            ))}
          </TaskColumn>
        </div>
      </div>
      {/* Modal */}
    </div>
  );
}

export default ProjectTask;
