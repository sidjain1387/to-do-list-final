const pool = require("./db");
const express = require("express");
const cors=require("cors");
const path=require("path");


const app=express();
app.use(express.json());
app.use(cors());


//ROUTES//

app.get("/",(req,res)=>{
    res.sendFile(
        path.join(__dirname,"../client/build/index.html"),
        function (err){
            if(err){
                res.status(500).send(err);
            }
        }
    )
});


//create a todo
app.post("/todos",async(req,res)=>{
    try {
        const {description}=req.body;
        const allRows= await pool.query("Insert into todo(description) values($1) returning *;",[description]);
        res.json(allRows.rows[0]);
        
    } catch (error) {
        console.error(error.message);
        
    }
})


//get a todo
app.get("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const allTodos=await pool.query("Select * from todo where todo_id=$1;",[id]);
        res.json(allTodos.rows[0]);
        
    } catch (error) {
        console.error(error.message);
        
    }
})


//get all todos
app.get("/todos",async(req,res)=>{
    try {
        const allTodos=await pool.query("Select * from todo;");
        res.json(allTodos.rows);
        
    } catch (error) {
        console.error(error.message);
        
    }
})



//update a todo
app.put("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const {description}=req.body;
        const allRows=await pool.query("Update todo set description=$1 where todo_id=$2 returning *;",[description,id]);
        res.json(allRows.rows[0]);

    } catch (error) {
        console.error(error.message);
        
    }
})


//delete a todo
app.delete("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const allRows=await pool.query("Delete from todo where todo_id=$1 returning *;",[id]);
        res.json({
            message:"Todo Deleted",
            deletedTodo:allRows.rows[0]
        });
        
    } catch (error) {
        console.error(error.message);
    }

})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server Started on Port 5000");
})
