"use client";
import React, { Fragment, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase/config";
import { useAuth } from "./firebase/AuthContext";
import { useRouter } from "next/navigation";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Delete, Edit } from "@mui/icons-material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { Divider } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "./Component/Loader";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
};

const Page = () => {
  const router = useRouter();
  const { signOut, authUser, isLoading } = useAuth();
  const [newTask, setNewTask] = useState<string>(""); // State for new task input
  const [todos, setTodos] = useState<Todo[]>([]);
  const [update, setUpdate] = useState<Todo | null>(null);

  const getCollection = async () => {
    if (!authUser) return;
    try {
      const q = query(
        collection(db, "todos"),
        where("userId", "==", authUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const todosList: Todo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todosList.push({
          id: doc.id,
          text: data.title,
          completed: data.completed,
          userId: data.userId,
        });
      });
      setTodos(todosList);
    } catch (error) {
      console.error("Error fetching todos: ", error);
      toast("somthing went wrong");
    }
  };

  const addTodo = async () => {
    if (!newTask || !authUser) return;
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        title: newTask,
        completed: false,
        userId: authUser.uid,
      });
      setNewTask("");
      getCollection();
      toast("Task Added successfully");
    } catch (error) {
      console.error("Error adding todo: ", error);
      toast(error.message || "somthing went wrong");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const todoRef = doc(db, "todos", id);
      const todoSnapshot = await getDoc(todoRef);
      if (todoSnapshot.exists()) {
        const currentTodo = todoSnapshot.data();
        await updateDoc(todoRef, {
          completed: !currentTodo.completed,
        });
        getCollection();
        toast(`${currentTodo.completed ? "Task Unchecked" : "Task Checked"}`);
      } else {
        console.error("No such document!");
        toast("No such document!");
      }
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast(error.message || "somthing went wrong");
    }
  };

  const handleUpdateTask = async () => {
    if (update) {
      try {
        const todoRef = doc(db, "todos", update.id);
        await updateDoc(todoRef, {
          title: update.text,
        });
        setUpdate(null);
        getCollection();
        toast("Task updated");
      } catch (error) {
        console.error("Error updating task: ", error);
        toast(error.message || "somthing went wrong");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
      getCollection();
      toast("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task: ", error);
      toast("somthing went wrong");
    }
  };

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/sign-in");
    }
    if (authUser) {
      getCollection();
    }
  }, [authUser, isLoading]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <button onClick={signOut} className="py-2 px-3 rounded-md border-2 my-4">
        Sign Out
      </button>
      <h2 className="text-2xl uppercase font-bold">To Do App</h2>

      <div className="w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] flex flex-col gap-2">
        <Divider sx={{ border: 1 }} />
        <div className="flex flex-row border-2 h-12 border-black justify-between rounded-md">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={`Hello ${authUser?.username}, enter a task`}
            className="outline-none w-full pl-2 rounded-md"
          />
          <button
            onClick={addTodo}
            className="text-white w-16  rounded-r-sm bg-black h-full"
          >
            {<AddOutlinedIcon sx={{ fontSize: 35 }} />}
          </button>
        </div>
        <Divider sx={{ border: 1, my: 2 }} />
        <div className="bg-blue-300 shadow-md p-5">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Fragment key={todo.id}>
                <div
                  key={todo.id}
                  className="flex justify-between items-center space-x-2 bg-white my-1 p-2 rounded-md"
                >
                  <label
                    htmlFor=""
                    className="flex gap-2 items-center flex-row text-xl"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleComplete(todo.id)}
                      className="cursor-pointer w-4 h-4 "
                    />
                    {update?.id === todo.id ? (
                      <input
                        value={update.text}
                        onChange={(e) =>
                          setUpdate({ ...update, text: e.target.value })
                        }
                        className="border-b-2 outline-none w-full border-black"
                      />
                    ) : (
                      <span
                        className={`${
                          todo.completed ? "line-through" : ""
                        } cursor-pointer`}
                        onClick={() => handleComplete(todo.id)}
                      >
                        {todo.text}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-row gap-1">
                    {update?.id === todo.id ? (
                      <button
                        onClick={handleUpdateTask}
                        className="bg-blue-800 px-2 py-1 rounded-md text-white"
                      >
                        Save
                      </button>
                    ) : todo.completed ? (
                      <DoneAllOutlinedIcon sx={{ color: "green" }} />
                    ) : (
                      <button onClick={() => setUpdate(todo)}>
                        {<Edit sx={{ color: "blue" }} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500"
                    >
                      {<Delete />}
                    </button>
                  </div>
                </div>
                <Divider />
              </Fragment>
            ))
          ) : (
            <p className="text-center">No todos found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
