import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useRef, useState } from 'react'
import { db, storage } from '../firebase';

function AddQuickTask() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descRef = useRef(null);
    const priorityRef = useRef(null);
    const dueDateRef = useRef(null);
    const statusRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [ taskImage, setTaskImage ] = useState("");
    const [ attachments, setAttachments ] = useState([]);


    const addFilesToQuickTask = (e) => {
        let files = [];
        for ( var i = 0; i < e.target.files.length; i++) {
            const reader = new FileReader();
            if (e.target.files[i]) {
              reader.readAsDataURL(e.target.files[0]);
            }
            reader.onload = (readerEvent) => {  
              files.push(readerEvent.target.result)
            };
        }
        setAttachments(files)
    }
    const addTaskImage = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]){
            reader.readAsDataURL(e.target.files[0])
        }
        reader.onload = (readerEvent) => {
            setTaskImage(readerEvent.target.result);
        }
    }
    const uploadQuickTask = async () => {
        if (loading) return;
        setLoading(true);
        const docRef = await addDoc(collection(db, "quicktasks"), {
            title: titleRef.current.value,
            subtitle: subtitleRef.current.value,
            description: descRef.current.value,
            priority: priorityRef.current.value,
            dueDate: dueDateRef.current.value,
            status: statusRef.current.value,
            timestamp: serverTimestamp(),
        })
        console.log("New quicktasks collection with ID: ", docRef.id);
        const taskImgRef = ref(storage, `quickTasks/${docRef.id}/taskImage`);
        await uploadString(taskImgRef, taskImage, "data_url").then(
            async (snapshot) => {
                const downloadURL = await getDownloadURL(taskImgRef);
                await updateDoc(doc(db, "quicktasks", docRef.id), {
                    taskImage: downloadURL,
                });
            });
        var files = [];
        var fileNumber = 1;
        attachments.map( async(file) => {
            const attachRef = ref(storage, `quickTasks/${docRef.id}/attachment_${fileNumber}`);
            fileNumber = fileNumber + 1;
            await uploadString(attachRef, file, "data_url").then(
            async (snapshot) => {
                const downloadURL = await getDownloadURL(attachRef);
                files.push(downloadURL);
                await updateDoc(doc(db, "quicktasks", docRef.id), {
                    attachments: files,
                });
            });
        });
        
        setLoading(false);
        setAttachments(null);
    }
    return (
        <div className="flex w-screen h-screen justify-center items-center">
        <div className="max-w-lg flex flex-col space-y-5">
            <h1 className="text-center text-xl font-bold">Add Quick Task</h1>
            <input ref={titleRef} type="text" placeholder="title" />
            <input ref={subtitleRef} type="text" placeholder="subtitle" />
            <textarea
                ref={descRef}
                name="description"
                id="desc"
                cols="40"
                rows="4"
                placeholder="Description"
            ></textarea>
            <input type="file" name="taskImg" id="taskImg" onChange={addTaskImage} />
            <select name="priority" id="priority" ref={priorityRef} defaultValue="high" >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <input type="date" name="duedate" id="duedate" ref={dueDateRef} />
            <select name="status" id="status" ref={statusRef} defaultValue="new" >
                <option value="assigned">Assigned</option>
                <option value="inprogress">In Progress</option>
                <option value="pendingclientreview">Pending Client Review</option>
                <option value="pending3rdpartyaction">
                    Pending 3rd Party Action
                </option>
                <option value="revision">Revision</option>
                <option value="readyforreview">Ready For Review</option>
                <option value="completed">Completed</option>
                <option value="archiveafter30days">Archive After 30 Days</option>
            </select>
            <input type="file" name="attachments" id="attachments" onChange={addFilesToQuickTask} multiple />
            <button onClick={uploadQuickTask}>Add Quick Task</button>
        </div>
        </div>
    )
}

export default AddQuickTask

