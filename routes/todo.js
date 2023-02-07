const express = require("express");
const router = express.Router();
const client = require("../config/db");

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the content
 *         content:
 *           type: string
 *           description: The todo content
 *         status:
 *           type: int
 *           description: status of the todo
 *       example:
 *
 *         content: The is my first todo
 */

/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: The Todo managing API
 */

/**
 * @swagger
 * /api/Todo:
 *   get:
 *     summary: Returns all the tasks
 *     tags: [Todo]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */

router.get("/", (req, res) => {
  let query = "SELECT * FROM todo";

  try {
    client.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      } else {
        res.status(200).json(result.rows);
      }
    });
  } catch (err) {
    res.status(404).send("Some error occured in fetching");
  }
});

/**
 * @swagger
 * /api/Todo:
 *   post:
 *     summary: Create a new Todo task
 *     tags: [Todo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: New Todo task is created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
  if (req.body.status < 1 || req.body.status > 3) {
    return res.status(500).send("You can only enter values between 1 and 3");
  }
  const query = `INSERT INTO todo (content,status) 
                     VALUES ($1,$2)`;

  const values = [req.body.content, req.body.status];

  try {
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error inserting data into database");
      } else {
        res.status(201).send("New Todo task is created successfully");
      }
    });
  } catch (err) {
    res.status(404).send("Some error occured in fetching");
  }
});

/**
 * @swagger
 * /api/Todo/{id}:
 *   delete:
 *     summary: Remove the Todo task by id
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Todo task id
 *
 *     responses:
 *       200:
 *         description: The Todo task was deleted
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Error deleting data from database
 */

router.delete("/:id", (req, res) => {
  const query = "DELETE FROM todo WHERE id = $1";
  const value = [req.params.id];

  try {
    client.query(query, value, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting data from database");
      } else {
        res
          .status(200)
          .send(`The todo task with id ${req.params.id} was deleted`);
      }
    });
  } catch (err) {
    res.status(404).send("Some error occured in fetching");
  }
});

/**
 * @swagger
 * /api/Todo/{id}:
 *  put:
 *    summary: Update the Todo task by the id
 *    tags: [Todo]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Todo id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Todo'
 *    responses:
 *      200:
 *        description: Task updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Todo'
 *      404:
 *        description: Some error occured in fetching
 *      500:
 *        description: Error updating data in database
 */

router.put("/:id", (req, res) => {
  if (req.body.status < 1 || req.body.status > 3) {
    return res.status(500).send("You can only enter values between 1 and 3");
  }

  const query = `UPDATE todo 
                     SET content = $1, status = $2 
                     WHERE id = $3`;

  const values = [req.body.content, req.body.status, req.params.id];

  try {
    client.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating data in database");
      } else {
        res.status(200).send("Task updated successfully");
      }
    });
  } catch (err) {
    res.status(404).send("Some error occured in fetching");
  }
});

/**
 * @swagger
 * /api/Todo/{id}:
 *   get:
 *     summary: Get the Todo task by id
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Todo task id
 *     responses:
 *       200:
 *         description: The task by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: The book was not found
 */

router.get("/:id", (req, res) => {
  let query = `SELECT * FROM todo 
                  WHERE id = $1`;
  const value = [req.params.id];
  try {
    client.query(query, value, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      } else {
        res.status(200).json(result.rows);
      }
    });
  } catch (err) {
    res.status(404).send("Some error occured in fetching");
  }
});
module.exports = router;
