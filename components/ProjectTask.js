import React, { useState } from "react";
import ProjectTaskOptions from "./ProjectTaskOptions";
import TaskModal from "./TaskModal";

function ProjectTaskIns({task, projectId}) {
  return (
    <div className="px-5 pt-5 pb-1 bg-white m-3 rounded-xl w-auto mb-3">
      <TaskModal task={task} projectTask={true} />
      <ProjectTaskOptions task={task} projectId={projectId} />
    </div>
  );
}

export default ProjectTaskIns;
