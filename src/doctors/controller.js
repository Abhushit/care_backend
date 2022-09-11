import pool from "../../db.js";
import queries from "./queries.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { basename, dirname, join } from "path";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getDoctors = (req, res) => {
  pool.query(queries.getDoctors, (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
};

const getSingleDoctor = (req, res) => {
  const id = req.params.id;

  pool.query(queries.getSingleDoctor, [id], (err, result) => {
    if (err) throw err;
    const noDoctorFound = !result.rows.length;
    if (noDoctorFound) {
      res.json({
        msg: "Doctor does not exist!",
      });
    } else {
      res.status(200).json({
        msg: "Doctor Selected Successfully",
        data: result.rows,
      });
    }
  });
};

const addDoctor = (req, res) => {
  // console.log('<<<<<<<<<<file >>>>>>>>>>>>>>', req.file);

  // console.log("body", req.body);
  const image = req.file;
  const { user_id, firstname, lastname, specialist, active } = req.body;

  const currImage = `${process.env.ROOT_URL}/api/v1/images/${image.filename}`;

  pool.query(
    queries.addDoctor,
    [user_id, firstname, lastname, specialist, currImage, active],
    (err, result) => {
      if (err) throw err;
      // console.log('result',result.rows);
      res.status(200).json({
        data: {
          user_id: user_id,
          firstname: firstname,
          lastname: lastname,
          specialist: specialist,
          image: currImage,
          active: active,
        },
        msg: "Doctor Added Successfully!",
      });
    }
  );
};

const updateDoctor = (req, res) => {
  var oldImg, oldFileName, newImg;

  const id = req.params.id;
  const image = req.file;
  // console.log('bodyyyy', req.body);
  // console.log("img", req.file);

  var doctorData = {
    firstname: "",
    lastname: "",
    specialist: "",
    active: true,
  };

  // const { firstname, lastname, specialist, active } = req.body;
  
  // if(image != undefined){
  //   newImg = `${process.env.ROOT_URL}/api/v1/images/${image.filename}`;
  // }
  pool.query(queries.getSingleDoctor, [id], (err, result) => {
    const noDoctorFound = !result.rows.length;
    if (noDoctorFound) {
      res.json({
        msg: "Doctor does not exist!",
      });
      
    } else {
      // console.log('image is', image);
      // console.log('rowsss', result.rows[0]);
      if(image){
        newImg = `${process.env.ROOT_URL}/api/v1/images/${image.filename}`;
        oldImg = result.rows[0].image;
      }else{
        newImg = result.rows[0].image;
        oldImg = "";
      }
      
        // oldFileName = oldImg.split("/").pop();

      doctorData.firstname = req.body.firstname
        ? req.body.firstname
        : result.rows[0].firstname;
      doctorData.lastname = req.body.lastname
        ? req.body.lastname
        : result.rows[0].lastname;
      doctorData.specialist = req.body.specialist
        ? req.body.specialist
        : result.rows[0].specialist;
      doctorData.active = req.body.active
        ? req.body.active
        : result.rows[0].active;
    }
  });
  setTimeout(() => {
    pool.query(
      queries.updateDoctor,
      [
        doctorData.firstname,
        doctorData.lastname,
        doctorData.specialist,
        newImg,
        doctorData.active,
        id,
      ],
      (err, result) => {
        if (err) throw err;
        if (oldImg) {
          // console.log('old img', oldImg.split("/").pop());
          const oldPath = path.join(
            path.resolve("./"),
            "images",
            oldImg.split("/").pop()
          );
          // console.log('old path >>>', oldPath);
          if (fs.existsSync(oldPath)) {
            fs.unlink(oldPath, (err) => {
              if (err) throw err;
            });
          }
        }
        res.status(200).json({
          msg: "Doctor Updated Successfully",
          doctor_id: id,
        });
      }
    );
  }, 500);
};

const deleteDoctor = (req, res) => {
  const id = req.params.id;

  pool.query(queries.getSingleDoctor, [id], (err, result) => {
    const noDoctorFound = !result.rows.length;
    if (noDoctorFound) {
      res.json({
        msg: "Doctor does not exist!",
      });
    } else {
      pool.query(queries.deleteDoctor, [id], (err, result) => {
        if (err) throw err;
        res.status(200).json({
          msg: "Doctor Deleted Successfully",
          doctor_id: id,
        });
      });
    }
  });
};

export default {
  getDoctors,
  addDoctor,
  getSingleDoctor,
  deleteDoctor,
  updateDoctor,
};
